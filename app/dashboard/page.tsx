import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAN_DISPLAY } from "@/lib/plans";
import { PLAN_LIMITS } from "@/types/plans";
import { getSiteUrl } from "@/lib/utils";
import type { PlanType } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage(): Promise<JSX.Element> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: sites }] = await Promise.all([
    supabase.from("users").select("plan, trial_ends_at").eq("id", user.id).single(),
    supabase
      .from("sites")
      .select("id, name, slug, is_published, custom_domain, published_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const plan = (profile?.plan ?? "free") as PlanType;
  const limits = PLAN_LIMITS[plan];
  const planInfo = PLAN_DISPLAY[plan];
  const siteCount = sites?.length ?? 0;
  const atLimit = siteCount >= limits.maxSites;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-syne text-xl font-bold">
            VitrineLab
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {planInfo.name} · {planInfo.price}
            </span>
            <Link href="/billing" className="text-sm text-slate-600 hover:text-slate-900">
              Facturation
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-syne text-3xl font-bold">Mes sites</h1>
          {!atLimit ? (
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Nouveau site
            </Link>
          ) : (
            <Link
              href="/billing"
              className="rounded-full bg-amber-500 px-6 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Upgrade pour plus de sites
            </Link>
          )}
        </div>

        {profile?.trial_ends_at && plan === "free" && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Essai actif jusqu&apos;au{" "}
            {new Date(profile.trial_ends_at).toLocaleDateString("fr-FR")}
          </p>
        )}

        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {sites?.map((site) => (
            <li
              key={site.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-lg">{site.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {site.custom_domain
                  ? site.custom_domain
                  : getSiteUrl(site.slug).replace("https://", "")}
              </p>
              <p className="mt-2 text-xs">
                {site.is_published ? (
                  <span className="text-green-600">● Publié</span>
                ) : (
                  <span className="text-amber-600">○ Brouillon</span>
                )}
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/editor/${site.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Éditer
                </Link>
                {site.is_published && (
                  <a
                    href={getSiteUrl(site.slug, site.custom_domain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:underline"
                  >
                    Voir le site
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        {(!sites || sites.length === 0) && (
          <p className="mt-12 text-center text-slate-500">
            Aucun site.{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Créez votre premier site
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
