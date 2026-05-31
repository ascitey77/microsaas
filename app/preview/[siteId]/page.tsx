import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ObsidianTemplate } from "@/components/templates/obsidian/ObsidianTemplate";
import { DEFAULT_OBSIDIAN_SECTIONS } from "@/components/templates/obsidian/ObsidianTemplate";
import type { EditableSection } from "@/types/sections";

interface PreviewPageProps {
  params: Promise<{ siteId: string }>;
}

export default async function PreviewPage({
  params,
}: PreviewPageProps): Promise<JSX.Element> {
  const { siteId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: site } = await supabase
    .from("sites")
    .select("id, user_id, template_id")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .single();

  if (!site) notFound();

  const [{ data: theme }, { data: sections }] = await Promise.all([
    supabase.from("themes").select("primary_color").eq("site_id", siteId).single(),
    supabase
      .from("sections")
      .select("id, type, order, content, settings")
      .eq("site_id", siteId)
      .order("order"),
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

  return (
    <ObsidianTemplate
      sections={mapped}
      primaryColor={theme?.primary_color ?? "#C9A84C"}
      showWatermark
    />
  );
}
