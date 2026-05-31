import { notFound, redirect } from "next/navigation";
import { EditorShell } from "@/components/editor/EditorShell";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_OBSIDIAN_SECTIONS,
} from "@/components/templates/obsidian/ObsidianTemplate";
import type { EditableSection, SiteEditorData } from "@/types/sections";
import type { PlanType } from "@/types/database";

interface EditorPageProps {
  params: Promise<{ siteId: string }>;
}

function mapSectionsFromDb(
  rows: Array<{
    id: string;
    type: string;
    order: number;
    content: Record<string, unknown>;
    settings: Record<string, unknown>;
  }>
): EditableSection[] {
  if (rows.length === 0) {
    return DEFAULT_OBSIDIAN_SECTIONS;
  }
  return rows.map((row) => ({
    id: row.id,
    type: row.type as EditableSection["type"],
    order: row.order,
    content: row.content as EditableSection["content"],
    settings: row.settings as EditableSection["settings"],
  }));
}

export default async function EditorPage({
  params,
}: EditorPageProps): Promise<JSX.Element> {
  const { siteId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, name, slug, template_id, is_published, user_id")
    .eq("id", siteId)
    .eq("user_id", user.id)
    .single();

  if (error || !site) {
    notFound();
  }

  const [{ data: theme }, { data: sectionRows }, { data: profile }] =
    await Promise.all([
      supabase
        .from("themes")
        .select("primary_color")
        .eq("site_id", siteId)
        .single(),
      supabase
        .from("sections")
        .select("id, type, order, content, settings")
        .eq("site_id", siteId)
        .order("order"),
      supabase.from("users").select("plan").eq("id", user.id).single(),
    ]);

  const editorData: SiteEditorData = {
    siteId: site.id,
    siteName: site.name,
    slug: site.slug,
    templateId: site.template_id,
    primaryColor: theme?.primary_color ?? "#C9A84C",
    isPublished: site.is_published,
    plan: (profile?.plan as PlanType) ?? "free",
    sections: mapSectionsFromDb(sectionRows ?? []),
  };

  return <EditorShell initialData={editorData} />;
}
