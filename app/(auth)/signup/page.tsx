"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";

const SECTORS = [
  { id: "restaurant", label: "Restaurant" },
  { id: "cabinet", label: "Cabinet pro" },
  { id: "creatif", label: "Créatif" },
  { id: "tech", label: "Tech" },
  { id: "artisan", label: "Artisan" },
  { id: "coach", label: "Coach" },
];

export default function SignupPage(): JSX.Element {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [templateId, setTemplateId] = useState("obsidian");
  const [sector, setSector] = useState("cabinet");
  const [businessName, setBusinessName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#C9A84C");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccount = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    if (data.user) setStep(2);
  };

  const handleCreateSite = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expirée");
      setLoading(false);
      return;
    }

    const slug = slugify(businessName) || "mon-site";
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .insert({
        user_id: user.id,
        name: businessName,
        slug,
        template_id: templateId,
      })
      .select("id")
      .single();

    if (siteError || !site) {
      setError(siteError?.message ?? "Erreur création site");
      setLoading(false);
      return;
    }

    await supabase.from("themes").insert({
      site_id: site.id,
      primary_color: primaryColor,
    });

    const defaultSections = [
      { type: "hero", order: 0 },
      { type: "services", order: 1 },
      { type: "testimonials", order: 2 },
    ];

    for (const s of defaultSections) {
      await supabase.from("sections").insert({
        site_id: site.id,
        type: s.type,
        order: s.order,
        content: {},
        settings: {},
      });
    }

    setLoading(false);
    router.push(`/editor/${site.id}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
          Étape {step} / 3
        </p>

        {step === 1 && (
          <>
            <h1 className="mt-2 font-syne text-2xl font-bold">Créer votre compte</h1>
            <div className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
              />
              <input
                type="password"
                placeholder="Mot de passe (8+ caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={handleAccount} disabled={loading} className="w-full">
                Continuer
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="mt-2 font-syne text-2xl font-bold">Choisir un template</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    sector === s.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setTemplateId("obsidian");
                setStep(3);
              }}
              className="mt-6 w-full rounded-xl border-2 border-slate-900 bg-[#0A0A0A] p-6 text-left text-[#F9F5EE]"
            >
              <span className="text-[#C9A84C] text-sm">Recommandé · {sector}</span>
              <p className="mt-2 font-cormorant text-2xl">Obsidian</p>
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="mt-2 font-syne text-2xl font-bold">Votre marque</h1>
            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="Nom de votre business"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
              />
              <div>
                <label className="text-sm font-medium">Couleur principale</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="mt-1 h-12 w-full cursor-pointer rounded border"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                onClick={handleCreateSite}
                disabled={loading || !businessName}
                className="w-full"
              >
                {loading ? "Construction du site…" : "Lancer mon site"}
              </Button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
