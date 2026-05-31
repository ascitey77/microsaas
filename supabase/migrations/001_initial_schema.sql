-- VitrineLab — Schema initial + RLS
-- Exécuter dans Supabase SQL Editor ou via CLI

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum plans
CREATE TYPE public.plan_type AS ENUM ('free', 'starter', 'pro', 'agency');
CREATE TYPE public.subscription_status AS ENUM (
  'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'
);

-- Profiles (étend auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  plan public.plan_type NOT NULL DEFAULT 'free',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  custom_domain TEXT UNIQUE,
  template_id TEXT NOT NULL DEFAULT 'obsidian',
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE INDEX sites_user_id_idx ON public.sites(user_id);
CREATE INDEX sites_slug_idx ON public.sites(slug);
CREATE INDEX sites_custom_domain_idx ON public.sites(custom_domain) WHERE custom_domain IS NOT NULL;

CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL UNIQUE REFERENCES public.sites(id) ON DELETE CASCADE,
  primary_color TEXT NOT NULL DEFAULT '#C9A84C',
  font_heading TEXT NOT NULL DEFAULT 'Cormorant Garamond',
  font_body TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sections_site_id_order_idx ON public.sections(site_id, "order");

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT,
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);

CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  country TEXT,
  device TEXT,
  event_type TEXT NOT NULL DEFAULT 'pageview',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX analytics_site_id_created_idx ON public.analytics(site_id, created_at DESC);

-- Trigger: créer profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW() + INTERVAL '14 days'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sites_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER themes_updated_at BEFORE UPDATE ON public.themes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sections_updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- sites
CREATE POLICY "sites_select_own" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sites_select_published" ON public.sites
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "sites_insert_own" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sites_update_own" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sites_delete_own" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- themes
CREATE POLICY "themes_all_own_site" ON public.themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.sites s
      WHERE s.id = site_id AND s.user_id = auth.uid()
    )
  );
CREATE POLICY "themes_select_published" ON public.themes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sites s
      WHERE s.id = site_id AND s.is_published = TRUE
    )
  );

-- sections
CREATE POLICY "sections_all_own_site" ON public.sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.sites s
      WHERE s.id = site_id AND s.user_id = auth.uid()
    )
  );
CREATE POLICY "sections_select_published" ON public.sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sites s
      WHERE s.id = site_id AND s.is_published = TRUE
    )
  );

-- subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- analytics: insert public (tracking), select owner only
CREATE POLICY "analytics_insert" ON public.analytics
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "analytics_select_own" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sites s
      WHERE s.id = site_id AND s.user_id = auth.uid()
    )
  );

-- Service role bypasses RLS for webhooks (use service key server-side only)

-- Limites plan: fonction helper
CREATE OR REPLACE FUNCTION public.can_add_site(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan public.plan_type;
  v_count INTEGER;
BEGIN
  SELECT plan INTO v_plan FROM public.users WHERE id = p_user_id;
  SELECT COUNT(*) INTO v_count FROM public.sites WHERE user_id = p_user_id;

  CASE v_plan
    WHEN 'free' THEN RETURN v_count < 1;
    WHEN 'starter' THEN RETURN v_count < 1;
    WHEN 'pro' THEN RETURN v_count < 3;
    WHEN 'agency' THEN RETURN TRUE;
    ELSE RETURN FALSE;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_use_custom_domain(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan public.plan_type;
BEGIN
  SELECT plan INTO v_plan FROM public.users WHERE id = p_user_id;
  RETURN v_plan IN ('pro', 'agency');
END;
$$;
