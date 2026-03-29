// Types
export type Currency = "USD" | "EUR" | "GBP" | "ISK" | "SEK";
export type PlanName = "Business" | "Premium" | "Enterprise";
export type Tier = { credits: number; monthly: number; annual: number };

// Currency data
export const currencyRates: Record<Currency, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, ISK: 138, SEK: 10.5,
};

export const currencySymbols: Record<Currency, { prefix: string; suffix: string }> = {
  USD: { prefix: "$", suffix: "" },
  EUR: { prefix: "€", suffix: "" },
  GBP: { prefix: "£", suffix: "" },
  ISK: { prefix: "", suffix: " kr" },
  SEK: { prefix: "", suffix: " kr" },
};

export const currencies: Currency[] = ["USD", "EUR", "GBP", "ISK", "SEK"];

// Format helpers
export function formatPrice(usd: number, currency: Currency): string {
  const converted = usd * currencyRates[currency];
  const { prefix, suffix } = currencySymbols[currency];
  if (currency === "ISK") {
    const rounded = Math.round(converted / 1000) * 1000;
    return `${prefix}${rounded.toLocaleString("en-US")}${suffix}`;
  }
  if (currency === "SEK") {
    const rounded = Math.round(converted / 100) * 100;
    return `${prefix}${rounded.toLocaleString("en-US")}${suffix}`;
  }
  return `${prefix}${Math.round(converted).toLocaleString("en-US")}${suffix}`;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// Tier data
export const businessTiers: Tier[] = [
  { credits: 3000, monthly: 349, annual: 291 },
  { credits: 5000, monthly: 499, annual: 416 },
  { credits: 8000, monthly: 649, annual: 541 },
  { credits: 12000, monthly: 799, annual: 666 },
  { credits: 18000, monthly: 999, annual: 832 },
];

export const premiumTiers: Tier[] = [
  { credits: 18000, monthly: 1149, annual: 958 },
  { credits: 25000, monthly: 1349, annual: 1124 },
  { credits: 35000, monthly: 1599, annual: 1332 },
  { credits: 50000, monthly: 1949, annual: 1624 },
  { credits: 75000, monthly: 2449, annual: 2041 },
  { credits: 100000, monthly: 2949, annual: 2458 },
];

export const enterpriseTiers: Tier[] = [
  { credits: 50000, monthly: 2249, annual: 1874 },
  { credits: 70000, monthly: 2699, annual: 2249 },
  { credits: 100000, monthly: 3349, annual: 2791 },
  { credits: 140000, monthly: 4049, annual: 3374 },
  { credits: 200000, monthly: 4949, annual: 4124 },
];

export const allTiers: Record<PlanName, Tier[]> = {
  Business: businessTiers,
  Premium: premiumTiers,
  Enterprise: enterpriseTiers,
};

// Plan recommendation
export function recommendPlan(credits: number): PlanName {
  if (credits <= 100000) return "Premium";
  return "Enterprise";
}

export function findBestTier(credits: number, tiers: Tier[]): Tier {
  for (const tier of tiers) {
    if (tier.credits >= credits) return tier;
  }
  return tiers[tiers.length - 1];
}

export function findTierIndex(credits: number, tiers: Tier[]): number {
  for (let i = 0; i < tiers.length; i++) {
    if (tiers[i].credits >= credits) return i;
  }
  return tiers.length - 1;
}

// Plan limits (NEW - for differentiation)
export const planLimits: Record<PlanName, { adminUsers: string; workspaces: string; baseCredits: string; sms: string }> = {
  Business: { adminUsers: "5", workspaces: "2", baseCredits: "3,000", sms: "100" },
  Premium: { adminUsers: "20", workspaces: "10", baseCredits: "18,000", sms: "500" },
  Enterprise: { adminUsers: "Unlimited", workspaces: "Unlimited", baseCredits: "Custom", sms: "Custom" },
};

// Feature comparison data (updated with limits + string values)
export type FeatureValue = boolean | string;

export type FeatureRow = {
  name: string;
  business: FeatureValue;
  premium: FeatureValue;
  enterprise: FeatureValue;
};

export type FeatureGroup = {
  category: string;
  features: FeatureRow[];
};

export const featureGroups: FeatureGroup[] = [
  {
    category: "Limits",
    features: [
      { name: "Admin users", business: "5", premium: "20", enterprise: "Unlimited" },
      { name: "Workspaces", business: "2", premium: "10", enterprise: "Unlimited" },
      { name: "Monthly credits (base)", business: "3,000", premium: "18,000", enterprise: "Custom" },
      { name: "SMS included", business: "100", premium: "500", enterprise: "Custom" },
    ],
  },
  {
    category: "Platform",
    features: [
      { name: "Custom lists", business: true, premium: true, enterprise: true },
      { name: "Synced lists", business: true, premium: true, enterprise: true },
      { name: "Workspaces", business: true, premium: true, enterprise: true },
      { name: "Private workspaces", business: true, premium: true, enterprise: true },
      { name: "API access key", business: true, premium: true, enterprise: true },
      { name: "Document templates", business: true, premium: true, enterprise: true },
      { name: "Bulk import", business: true, premium: true, enterprise: true },
      { name: "Custom email domain", business: true, premium: true, enterprise: true },
      { name: "Custom portal URL", business: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "Automation",
    features: [
      { name: "Basic actions", business: true, premium: true, enterprise: true },
      { name: "Webhook actions", business: false, premium: true, enterprise: true },
      { name: "Code actions", business: false, premium: true, enterprise: true },
      { name: "Calendar event actions", business: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "AI",
    features: [
      { name: "AI Agents", business: true, premium: true, enterprise: true },
      { name: "AI Workflow Helper", business: true, premium: true, enterprise: true },
    ],
  },
  {
    category: "Support & Services",
    features: [
      { name: "Live support", business: true, premium: true, enterprise: true },
      { name: "Up to 20hrs implementation", business: false, premium: true, enterprise: true },
      { name: "Retainer with experts", business: false, premium: true, enterprise: false },
      { name: "Dedicated account manager", business: false, premium: false, enterprise: true },
      { name: "Customer support engineer", business: false, premium: false, enterprise: true },
      { name: "Priority support", business: false, premium: false, enterprise: true },
      { name: "Custom payment options", business: false, premium: false, enterprise: true },
      { name: "Azure SSO", business: false, premium: false, enterprise: true },
      { name: "Annual credit limits", business: false, premium: false, enterprise: true },
    ],
  },
];

// FAQ data
export const faqs = [
  {
    q: "What are credits and how do they work?",
    a: "A Journey is a workflow made up of actions \u2014 like sending an email, triggering a background check, or updating a record. When someone goes through a Journey, each action that completes uses one credit. If a Journey has 10 actions and 50 people go through it this month, that\u2019s 500 credits. AI-powered actions may use more than one credit depending on complexity. Credits reset every month.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "Your workflows will pause until the next billing cycle. You can increase your monthly credit limit at any time by upgrading to a higher tier \u2014 and the more credits you use, the better the rate. We also offer one-time credit top-ups if you need a quick boost.",
  },
  {
    q: "Do you help us set up our workflows?",
    a: "Yes \u2014 Premium and Enterprise plans include up to 20 hours of expert implementation at no extra cost. Our team helps design and build your first workflows so you see value from day one. Additional implementation hours are available as a retainer.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. We offer a 2-week free trial with access to all essential features. No credit card required.",
  },
  {
    q: "What if my usage is seasonal?",
    a: "Many of our customers have hiring peaks (January, September). You can change your credit tier at any time to match your needs. Enterprise customers can also use flexible monthly credit pools that absorb seasonal variation.",
  },
  {
    q: "How is this different from Zapier or other automation tools?",
    a: "Journeys is purpose-built for HR and people workflows \u2014 onboarding, offboarding, background checks, document generation, and employee lifecycle management. Every credit powers a step in a people process, not a generic data sync. Plus, we help build your workflows with you.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade at any time by contacting our customer success team. Upgrades take effect immediately.",
  },
  {
    q: "What currencies do you support?",
    a: "We bill in USD, EUR, and GBP. Icelandic and Swedish customers can see equivalent pricing in ISK and SEK. For enterprise customers, we offer flexible payment terms in your preferred currency.",
  },
];

// Journey templates for the calculator
export type JourneyTemplate = {
  id: string;
  name: string;
  description: string;
  actions: number;
  peopleFn: (size: number) => number;
  defaultOn: boolean;
  hoursSaved: number;
};

export const journeyTemplates: JourneyTemplate[] = [
  {
    id: "onboarding",
    name: "Employee Onboarding",
    description: "Welcome emails, IT provisioning, document collection, training assignments, compliance forms, benefits enrollment, manager notifications, check-ins",
    actions: 75,
    peopleFn: (s) => Math.max(2, Math.round(s * 0.08)),
    defaultOn: true,
    hoursSaved: 6,
  },
  {
    id: "offboarding",
    name: "Employee Offboarding",
    description: "Exit interview, access revocation, equipment return, knowledge transfer, final paycheck, benefits termination, manager handoff",
    actions: 45,
    peopleFn: (s) => Math.max(1, Math.round(s * 0.04)),
    defaultOn: true,
    hoursSaved: 4,
  },
  {
    id: "contracts",
    name: "Contract & NDA Generation",
    description: "Template selection, data merge, multi-party e-signature, reminders, countersigning, filing, compliance logging",
    actions: 25,
    peopleFn: (s) => Math.max(2, Math.round(s * 0.08)),
    defaultOn: true,
    hoursSaved: 2.5,
  },
  {
    id: "background",
    name: "Background Checks",
    description: "Consent collection, provider submission, result routing, risk assessment, notifications, record updates, compliance audit",
    actions: 30,
    peopleFn: (s) => Math.max(1, Math.round(s * 0.06)),
    defaultOn: false,
    hoursSaved: 2,
  },
  {
    id: "requests",
    name: "Employee Requests",
    description: "Equipment, certificates, address changes, role changes, approval routing, notifications, record updates",
    actions: 15,
    peopleFn: (s) => Math.max(5, Math.round(s * 0.25)),
    defaultOn: true,
    hoursSaved: 1,
  },
  {
    id: "performance",
    name: "Performance Reviews",
    description: "Self-assessment, manager review, calibration, goal setting, documentation, development plan, follow-up scheduling",
    actions: 35,
    peopleFn: (s) => Math.max(5, Math.round(s / 4)),
    defaultOn: false,
    hoursSaved: 3,
  },
  {
    id: "leave",
    name: "Leave Management",
    description: "Request, multi-level approval routing, calendar sync, team notification, balance updates, payroll flagging",
    actions: 18,
    peopleFn: (s) => Math.max(3, Math.round(s * 0.15)),
    defaultOn: false,
    hoursSaved: 0.5,
  },
  {
    id: "probation",
    name: "Probation & Check-ins",
    description: "Scheduled check-ins, feedback collection, manager notifications, assessment forms, extension/confirmation triggers",
    actions: 25,
    peopleFn: (s) => Math.max(2, Math.round(s * 0.05)),
    defaultOn: false,
    hoursSaved: 1.5,
  },
];

// Month names for seasonal modeling
export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Seasonal spike presets
export type SeasonalSpike = { month: number; multiplier: number; label: string };

export const seasonalPresets: { name: string; spikes: SeasonalSpike[] }[] = [
  { name: "Hiring season (Jan + Sep)", spikes: [{ month: 0, multiplier: 3, label: "January hiring" }, { month: 8, multiplier: 3, label: "September hiring" }] },
  { name: "Year-end (Dec)", spikes: [{ month: 11, multiplier: 2, label: "Year-end processes" }] },
  { name: "Summer lull (Jun-Aug)", spikes: [{ month: 5, multiplier: 0.5, label: "June" }, { month: 6, multiplier: 0.5, label: "July" }, { month: 7, multiplier: 0.5, label: "August" }] },
];
