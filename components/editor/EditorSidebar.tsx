"use client";

import { cn } from "@/lib/utils";
import type { EditableSection } from "@/types/sections";

interface EditorSidebarProps {
  sections: EditableSection[];
  activeSectionId: string | null;
  primaryColor: string;
  previewMode: "desktop" | "mobile";
  onSelectSection: (id: string) => void;
  onPrimaryColorChange: (color: string) => void;
  onPreviewModeChange: (mode: "desktop" | "mobile") => void;
  onPublish: () => void;
  isPublishing: boolean;
  customDomain?: string | null;
  canUseCustomDomain: boolean;
  onCustomDomainChange: (domain: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  services: "Services",
  testimonials: "Témoignages",
  cta: "CTA",
};

export function EditorSidebar({
  sections,
  activeSectionId,
  primaryColor,
  previewMode,
  onSelectSection,
  onPrimaryColorChange,
  onPreviewModeChange,
  onPublish,
  isPublishing,
  customDomain,
  canUseCustomDomain,
  onCustomDomainChange,
}: EditorSidebarProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <aside
      className="flex h-full w-80 shrink-0 flex-col border-r border-slate-200 bg-white"
      aria-label="Panneau d'édition"
    >
      <div className="border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Éditeur</h2>
        <p className="text-xs text-slate-500">Modifiez directement dans l&apos;aperçu</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4" aria-label="Sections">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          Sections
        </p>
        <ul className="space-y-1">
          {sorted.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSelectSection(section.id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activeSectionId === section.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                aria-current={activeSectionId === section.id ? "true" : undefined}
              >
                {SECTION_LABELS[section.type] ?? section.type}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-4 border-t border-slate-200 p-4">
        <div>
          <label
            htmlFor="primary-color"
            className="mb-1 block text-xs font-medium text-slate-600"
          >
            Couleur principale
          </label>
          <input
            id="primary-color"
            type="color"
            value={primaryColor}
            onChange={(e) => onPrimaryColorChange(e.target.value)}
            className="h-10 w-full cursor-pointer rounded border border-slate-200"
          />
        </div>

        {canUseCustomDomain && (
          <div>
            <label
              htmlFor="custom-domain"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Domaine personnalisé (CNAME)
            </label>
            <input
              id="custom-domain"
              type="text"
              placeholder="www.monentreprise.fr"
              value={customDomain ?? ""}
              onChange={(e) => onCustomDomainChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Pointez un CNAME vers cname.vercel-dns.com
            </p>
          </div>
        )}

        <div role="group" aria-label="Mode aperçu">
          <p className="mb-2 text-xs font-medium text-slate-600">Aperçu</p>
          <div className="flex gap-2">
            {(["desktop", "mobile"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onPreviewModeChange(mode)}
                className={cn(
                  "flex-1 rounded-lg py-2 text-xs font-medium capitalize",
                  previewMode === mode
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="w-full rounded-full bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPublishing ? "Publication…" : "Publier en 1 clic"}
        </button>
      </div>
    </aside>
  );
}
