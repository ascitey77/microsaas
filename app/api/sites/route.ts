import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { PLAN_LIMITS } from "@/types/plans";
import type { PlanType } from "@/types/database";

const patchSchema = z.object({
  sections: z.array(z.unknown()).optional(),
  primaryColor: z.string().optional(),
  customDomain: z.string().nullable().optional(),
});

const publishSchema = z.object({
  action: z.literal("publish"),
});

export async function PATCH(request: Request): Promise<NextResponse> {
  const rate = await checkRateLimit(`sites:${request.headers.get("x-forwarded-for") ?? "anon"}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("id");
  if (!siteId) {
    return NextResponse.json({ error: "Missing site id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, user_id")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .single();

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as PlanType;
  const limits = PLAN_LIMITS[plan];

  if (parsed.data.customDomain && !limits.customDomain) {
    return NextResponse.json(
      { error: "Custom domain requires Pro or Agency plan" },
      { status: 403 }
    );
  }

  if (parsed.data.primaryColor) {
    await supabase
      .from("themes")
      .update({ primary_color: parsed.data.primaryColor })
      .eq("site_id", siteId);
  }

  if (parsed.data.customDomain !== undefined) {
    await supabase
      .from("sites")
      .update({ custom_domain: parsed.data.customDomain })
      .eq("id", siteId);
  }

  if (parsed.data.sections && Array.isArray(parsed.data.sections)) {
    for (const section of parsed.data.sections as Array<{
      id: string;
      content: Record<string, unknown>;
      settings?: Record<string, unknown>;
    }>) {
      await supabase
        .from("sections")
        .update({
          content: section.content,
          settings: section.settings ?? {},
        })
        .eq("id", section.id)
        .eq("site_id", siteId);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("id");
  if (!siteId) {
    return NextResponse.json({ error: "Missing site id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { error } = await supabase
    .from("sites")
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq("id", siteId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, published: true });
}
