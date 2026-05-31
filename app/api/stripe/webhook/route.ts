import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { planFromStripePrice } from "@/lib/plans";
import { createServiceClient } from "@/lib/supabase/admin";
import type { PlanType } from "@/types/database";

export const runtime = "nodejs";

async function sendDunningEmail(email: string, plan: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "VitrineLab <billing@vitrinelab.com>",
      to: [email],
      subject: "Action requise — paiement VitrineLab",
      html: `<p>Bonjour,</p><p>Votre paiement pour le plan <strong>${plan}</strong> a échoué. Mettez à jour votre moyen de paiement pour éviter une interruption de service.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/billing">Gérer mon abonnement</a></p>`,
    }),
  });
}

async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createServiceClient();
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const status = subscription.status as
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete";

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function updateUserPlan(
  userId: string,
  plan: PlanType,
  stripeCustomerId?: string
): Promise<void> {
  const supabase = createServiceClient();
  const payload: Record<string, unknown> = {
    plan,
    updated_at: new Date().toISOString(),
  };
  if (stripeCustomerId) {
    payload.stripe_customer_id = stripeCustomerId;
  }
  await supabase.from("users").update(payload).eq("id", userId);
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId as PaidPlanMeta | undefined;

  if (!userId || !planId) {
    console.error("checkout.session.completed: missing metadata", session.id);
    return;
  }

  const plan = planId as PlanType;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  await updateUserPlan(userId, plan, customerId);

  if (session.subscription && typeof session.subscription === "string") {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );
    await upsertSubscription(userId, subscription);
  }
}

type PaidPlanMeta = "starter" | "pro" | "agency";

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createServiceClient();
  const userId = subscription.metadata?.userId;

  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("stripe_customer_id", customerId)
      .single();

    if (!user) return;
    resolvedUserId = user.id;
  }

  await upsertSubscription(resolvedUserId, subscription);

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  const plan = planFromStripePrice(priceId);
  if (!plan) return;

  if (
    subscription.status === "active" ||
    subscription.status === "trialing"
  ) {
    await updateUserPlan(resolvedUserId, plan);
  } else if (
    subscription.status === "past_due" ||
    subscription.status === "unpaid"
  ) {
    const { data: profile } = await supabase
      .from("users")
      .select("email, plan")
      .eq("id", resolvedUserId)
      .single();

    if (profile?.email) {
      await sendDunningEmail(profile.email, profile.plan);
    }
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired"
  ) {
    await updateUserPlan(resolvedUserId, "free");
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const supabase = createServiceClient();
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  if (!customerId) return;

  const { data: user } = await supabase
    .from("users")
    .select("id, email, plan")
    .eq("stripe_customer_id", customerId)
    .single();

  if (user?.email) {
    await sendDunningEmail(user.email, user.plan);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await updateUserPlan(userId, "free");
          const supabase = createServiceClient();
          await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription && typeof invoice.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          await handleSubscriptionUpdated(subscription);
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
