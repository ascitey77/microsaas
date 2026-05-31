import type { PlanType } from "./database";

export interface PlanLimits {
  maxSites: number;
  maxSections: number | null;
  customDomain: boolean;
  customSubdomain: boolean;
  watermark: boolean;
  allTemplates: boolean;
  analytics: boolean;
  forms: boolean;
  htmlExport: boolean;
  whitelabel: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxSites: 1,
    maxSections: 3,
    customDomain: false,
    customSubdomain: false,
    watermark: true,
    allTemplates: false,
    analytics: false,
    forms: false,
    htmlExport: false,
    whitelabel: false,
  },
  starter: {
    maxSites: 1,
    maxSections: null,
    customDomain: false,
    customSubdomain: true,
    watermark: false,
    allTemplates: false,
    analytics: true,
    forms: true,
    htmlExport: false,
    whitelabel: false,
  },
  pro: {
    maxSites: 3,
    maxSections: null,
    customDomain: true,
    customSubdomain: true,
    watermark: false,
    allTemplates: true,
    analytics: true,
    forms: true,
    htmlExport: false,
    whitelabel: false,
  },
  agency: {
    maxSites: Infinity,
    maxSections: null,
    customDomain: true,
    customSubdomain: true,
    watermark: false,
    allTemplates: true,
    analytics: true,
    forms: true,
    htmlExport: true,
    whitelabel: true,
  },
};
