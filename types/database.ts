export type PlanType = "free" | "starter" | "pro" | "agency";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete";

export interface User {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: PlanType;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  template_id: string;
  published_at: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  site_id: string;
  primary_color: string;
  font_heading: string;
  font_body: string;
  logo_url: string | null;
}

export interface SectionRow {
  id: string;
  site_id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}
