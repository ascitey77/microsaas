import type { NextRequest } from "next/server";
import { getAppHost } from "@/lib/utils";

export interface TenantContext {
  type: "app" | "subdomain" | "custom_domain";
  slug?: string;
  hostname: string;
}

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "dashboard",
  "editor",
  "preview",
  "admin",
  "billing",
  "login",
  "signup",
]);

export function resolveTenant(request: NextRequest): TenantContext {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const appHost = getAppHost();

  if (host === appHost || host === `www.${appHost}` || host === "localhost") {
    return { type: "app", hostname: host };
  }

  if (host.endsWith(`.${appHost}`)) {
    const slug = host.replace(`.${appHost}`, "");
    if (!RESERVED_SUBDOMAINS.has(slug)) {
      return { type: "subdomain", slug, hostname: host };
    }
  }

  if (host.endsWith(".localhost") && process.env.NODE_ENV === "development") {
    const slug = host.replace(".localhost", "");
    if (!RESERVED_SUBDOMAINS.has(slug)) {
      return { type: "subdomain", slug, hostname: host };
    }
  }

  return { type: "custom_domain", hostname: host };
}
