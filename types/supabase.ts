export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanType = "free" | "starter" | "pro" | "agency";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          stripe_customer_id: string | null;
          plan: PlanType;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          stripe_customer_id?: string | null;
          plan?: PlanType;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          stripe_customer_id?: string | null;
          plan?: PlanType;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sites: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          custom_domain?: string | null;
          template_id?: string;
          published_at?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          custom_domain?: string | null;
          template_id?: string;
          published_at?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          site_id: string;
          type: string;
          order: number;
          content: Json;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          type: string;
          order?: number;
          content?: Json;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          type?: string;
          order?: number;
          content?: Json;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          id: string;
          site_id: string;
          primary_color: string;
          font_heading: string;
          font_body: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          primary_color?: string;
          font_heading?: string;
          font_body?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          primary_color?: string;
          font_heading?: string;
          font_body?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string | null;
          status: string;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_price_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_price_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      analytics: {
        Row: {
          id: string;
          site_id: string;
          path: string;
          referrer: string | null;
          country: string | null;
          device: string | null;
          event_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          path?: string;
          referrer?: string | null;
          country?: string | null;
          device?: string | null;
          event_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          path?: string;
          referrer?: string | null;
          country?: string | null;
          device?: string | null;
          event_type?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
