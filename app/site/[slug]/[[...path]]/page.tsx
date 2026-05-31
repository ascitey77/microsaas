import { notFound } from "next/navigation";
import { ObsidianTemplate } from "@/components/templates/obsidian/ObsidianTemplate";
import { DEFAULT_OBSIDIAN_SECTIONS } from "@/components/templates/obsidian/ObsidianTemplate";
import { createClient } from "@/lib/supabase/server";
import type { EditableSection } from "@/types/sections";
import { PLAN_LIMITS } from "@/types/plans";
import type { PlanType } from "@/types/database";

export const revalidate = 60;

interface SitePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublishedSitePage({
  params,
}: SitePageProps): Promise<JSX.Element> {
  const { slug } = await params;

  if (slug === "by-domain") {
    notFound();
  }

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id, template_id, is_published, user_id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!site) {
    notFound();
  }

  const [{ data: theme }, { data: sections }, { data: owner }] =
    await Promise.all([
      supabase
        .from("themes")
        .select("primary_color")
        .eq("site_id", site.id)
        .single(),
      supabase
        .from("sections")
        .select("id, type, order, content, settings")
        .eq("site_id", site.id)
        .order("order"),
      supabase.from("users").select("plan").eq("id", site.user_id).single(),
    ]);

  const mapped: EditableSection[] =
    sections && sections.length > 0
      ? sections.map((s) => ({
          id: s.id,
          type: s.type as EditableSection["type"],
          order: s.order,
          content: s.content as EditableSection["content"],
          settings: s.settings as EditableSection["settings"],
        }))
      : DEFAULT_OBSIDIAN_SECTIONS;

  const plan = (owner?.plan ?? "free") as PlanType;

  return (
    <ObsidianTemplate
      sections={mapped}
      primaryColor={theme?.primary_color ?? "#C9A84C"}
      showWatermark={PLAN_LIMITS[plan].watermark}
    />
  );
}
