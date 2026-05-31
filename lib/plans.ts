import type { PlanType } from "@/types/database";

export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "price_starter",
  pro: process.env.STRIPE_PRICE_PRO ?? "price_pro",
  agency: process.env.STRIPE_PRICE_AGENCY ?? "price_agency",
} as const;

export type PaidPlanId = keyof typeof STRIPE_PRICE_IDS;

export const PLAN_FROM_PRICE: Record<string, PlanType> = {
  [STRIPE_PRICE_IDS.starter]: "starter",
  [STRIPE_PRICE_IDS.pro]: "pro",
  [STRIPE_PRICE_IDS.agency]: "agency",
};

export function planFromStripePrice(priceId: string): PlanType | null {
  return PLAN_FROM_PRICE[priceId] ?? null;
}

export const PLAN_DISPLAY: Record<PlanType, { name: string; price: string }> = {
  free: { name: "Free", price: "0€" },
  starter: { name: "Starter", price: "19€/mois" },
  pro: { name: "Pro", price: "49€/mois" },
  agency: { name: "Agency", price: "149€/mois" },
};
