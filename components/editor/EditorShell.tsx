"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ObsidianTemplate } from "@/components/templates/obsidian/ObsidianTemplate";
import { EditorSidebar } from "./EditorSidebar";
import { cn } from "@/lib/utils";
import type { EditableSection, SiteEditorData } from "@/types/sections";
import { PLAN_LIMITS } from "@/types/plans";
import type { PlanType } from "@/types/database";

interface EditorShellProps {
  initialData: SiteEditorData;
}

export function EditorShell({ initialData }: EditorShellProps) {
  const [sections, setSections] = useState<EditableSection[]>(initialData.sections);
  const [primaryColor, setPrimaryColor] = useState(initialData.primaryColor);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialData.sections[0]?.id ?? null
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [customDomain, setCustomDomain] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const plan = initialData.plan as PlanType;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const showWatermark = limits.watermark;

  const handleSectionChange = useCallback(
    (sectionId: string, field: string, value: string) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                content: { ...s.content, [field]: value } as EditableSection["content"],
              }
            : s
        )
      );
      setSaveStatus("saving");
      window.setTimeout(() => setSaveStatus("saved"), 600);
    },
    []
  );

  const persistSite = useCallback(async () => {
    await fetch(`/api/sites?id=${initialData.siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sections,
        primaryColor,
        customDomain: customDomain || null,
      }),
    });
  }, [sections, primaryColor, customDomain, initialData.siteId]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await persistSite();
      await fetch(`/api/sites?id=${initialData.siteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
            ← Dashboard
          </Link>
          <span className="font-medium text-slate-900">{initialData.siteName}</span>
          {saveStatus === "saved" && (
            <span className="text-xs text-green-600" role="status">
              Enregistré
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/preview/${initialData.siteId}`}
            target="_blank"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Aperçu public
          </Link>
          <Link
            href={`/editor/${initialData.siteId}/seo`}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            SEO
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          primaryColor={primaryColor}
          previewMode={previewMode}
          onSelectSection={setActiveSectionId}
          onPrimaryColorChange={setPrimaryColor}
          onPreviewModeChange={setPreviewMode}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          customDomain={customDomain}
          canUseCustomDomain={limits.customDomain}
          onCustomDomainChange={setCustomDomain}
        />

        <div
          className="flex flex-1 items-start justify-center overflow-auto p-6"
          role="region"
          aria-label="Aperçu du site"
        >
          <div
            className={cn(
              "overflow-hidden rounded-xl border border-slate-300 bg-[#0A0A0A] shadow-2xl transition-all duration-300",
              previewMode === "desktop" ? "w-full max-w-6xl" : "w-[390px]"
            )}
          >
            <ObsidianTemplate
              sections={sections}
              primaryColor={primaryColor}
              showWatermark={showWatermark}
              editable
              onSectionChange={handleSectionChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
