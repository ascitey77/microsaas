import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveTenant } from "@/lib/tenant";
import { getAppHost } from "@/lib/utils";

const PROTECTED_PREFIXES = ["/dashboard", "/editor", "/billing"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const tenant = resolveTenant(request);
  const appHost = getAppHost();
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";

  // ——— Sites clients : sous-domaine ou domaine personnalisé ———
  if (tenant.type === "subdomain" && tenant.slug) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/site/${tenant.slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  if (tenant.type === "custom_domain") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/site/by-domain/${encodeURIComponent(hostname)}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // ——— App principale : auth Supabase ———
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/signup") && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  // Headers pour debug / ISR
  response.headers.set("x-vitrinelab-tenant", "app");
  response.headers.set("x-vitrinelab-host", appHost);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
