import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { checkRateLimit } from "@/lib/ratelimit";
import { DEFAULT_OBSIDIAN_SECTIONS } from "@/lib/templates/obsidian-defaults";
import type { Database } from "@/types/supabase";

const createSiteSchema = z.object({
  name: z.string().min(1).max(120),
  templateId: z.string().default("obsidian"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#C9A84C"),
});

export async function POST(request: Request): Promise<NextResponse> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rate = await checkRateLimit(`create-site:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = createSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, templateId, primaryColor } = parsed.data;
  const slug = slugify(name) || "mon-site";

  const sitePayload: Database["public"]["Tables"]["sites"]["Insert"] = {
    user_id: user.id,
    name,
    slug,
    template_id: templateId,
  };

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .insert(sitePayload)
    .select("id")
    .single();

  if (siteError || !site) {
    return NextResponse.json(
      { error: siteError?.message ?? "Could not create site" },
      { status: 500 }
    );
  }

  await supabase.from("themes").insert({
    site_id: site.id,
    primary_color: primaryColor,
  });

  const sections = DEFAULT_OBSIDIAN_SECTIONS.slice(0, 3);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section) continue;
    await supabase.from("sections").insert({
      site_id: site.id,
      type: section.type,
      order: i,
      content: section.content,
      settings: section.settings,
    });
  }

  return NextResponse.json({ siteId: site.id, slug });
}
