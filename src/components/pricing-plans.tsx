"use client";

import { useState, useMemo } from "react";
import {
  type Currency,
  type PlanName,
  type FeatureValue,
  type Tier,
  currencies,
  currencySymbols,
  currencyRates,
  formatPrice,
  featureGroups,
  faqs,
  businessTiers,
  premiumTiers,
  enterpriseTiers,
} from "@/lib/pricing-data";

/* ─── Icons ─── */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 mt-0.5 ${className}`}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 mt-0.5"
    >
      <path d="M5 8H11" stroke="#C8C8D0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 8L10 13L15 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-indigo-300">{value}</span>;
  }
  return value ? <CheckIcon className="text-green" /> : <DashIcon />;
}

/* ─── Plan tier labels ─── */

const planTiers: Record<string, Tier[]> = {
  business: businessTiers,
  premium: premiumTiers,
  enterprise: enterpriseTiers,
};

const planMeta: {
  key: string;
  name: PlanName;
  tagline: string;
  sizing: string;
  features: string[];
  preamble: string | null;
  ctaLabel: string;
  defaultIdx: number;
}[] = [
  {
    key: "business",
    name: "Business",
    tagline: "For growing teams",
    sizing: "50–200 employees",
    features: [
      "Up to 3 active workflows",
      "Onboarding & offboarding templates",
      "Email & Slack notifications",
      "Standard integrations",
      "Email support",
    ],
    preamble: null,
    ctaLabel: "Get started",
    defaultIdx: 0,
  },
  {
    key: "premium",
    name: "Premium",
    tagline: "For scaling organizations",
    sizing: "200–500 employees",
    features: [
      "Unlimited active workflows",
      "Webhooks & code actions",
      "Calendar event triggers",
      "Custom portal URL",
      "Up to 20hrs expert implementation",
      "Priority support",
    ],
    preamble: "Everything in Business, plus:",
    ctaLabel: "Get started",
    defaultIdx: 1,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    tagline: "For large organizations",
    sizing: "500+ employees",
    features: [
      "Multi-entity & multi-country",
      "SSO / SAML included",
      "Fully branded employee portal",
      "Dedicated account manager",
      "No hard credit limits",
      "Annual credit smoothing",
    ],
    preamble: "Everything in Premium, plus:",
    ctaLabel: "Talk to an expert",
    defaultIdx: 2,
  },
];

/* ─── Helpers ─── */

function fmtCredits(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

function fmtMoney(usd: number, currency: Currency): string {
  return formatPrice(usd, currency);
}

/* ─── Enterprise constants ─── */

const SUPPORT_RATE = 215;
const SMS_RATE = 0.05;
const RETAINER_RATE = 200;

/* ─── Main Component ─── */

export function PricingPlans() {
  const [annual, setAnnual] = useState(true);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    business: 0,
    premium: 1,
    enterprise: 2,
  });
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculator state
  const [calcEmployees, setCalcEmployees] = useState(20);
  const [calcWorkflows, setCalcWorkflows] = useState(3);
  const [calcSteps, setCalcSteps] = useState(20);

  // Enterprise add-on state
  const [supportHours, setSupportHours] = useState(8);
  const [smsExtra, setSmsExtra] = useState(0);
  const [retainerHours, setRetainerHours] = useState(0);

  const calcEstimate = useMemo(() => {
    return Math.round(calcEmployees * calcWorkflows * calcSteps * 0.8);
  }, [calcEmployees, calcWorkflows, calcSteps]);

  const calcRecommendation = useMemo(() => {
    if (calcEstimate <= 18000) return "Business";
    if (calcEstimate <= 100000) return "Premium";
    return "Enterprise";
  }, [calcEstimate]);

  // Enterprise total
  const enterpriseTier = enterpriseTiers[sliderValues.enterprise];
  const enterpriseCreditsPrice = annual
    ? enterpriseTier.annual
    : enterpriseTier.monthly;
  const supportCost = supportHours * SUPPORT_RATE;
  const smsCost = smsExtra * SMS_RATE;
  const retainerCost = retainerHours * RETAINER_RATE;
  const enterpriseTotal = enterpriseCreditsPrice + supportCost + smsCost + retainerCost;
  const enterpriseAnnualSavings = (enterpriseTier.monthly - enterpriseTier.annual) * 12;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="pt-32 pb-12 text-center">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-indigo-300 mb-3">
            Pricing
          </p>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[40px] md:text-[52px] leading-[1.05] tracking-[-0.03em] text-indigo-400 mb-5">
            Simple pricing that
            <br />
            scales with your team
          </h1>
          <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto mb-10 leading-relaxed">
            Every workflow step costs one credit per person. Pick the plan that
            fits your team size — upgrade anytime as you grow.
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  annual
                    ? "bg-white text-indigo-400 shadow-sm"
                    : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                Annual
                <span className="text-[10px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  !annual
                    ? "bg-white text-indigo-400 shadow-sm"
                    : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Currency selector */}
            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                    currency === c
                      ? "bg-white text-indigo-400 shadow-sm"
                      : "text-gray-500 hover:text-indigo-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. PLAN CARDS
      ═══════════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {planMeta.map((plan) => {
              const tiers = planTiers[plan.key];
              const idx = sliderValues[plan.key];
              const tier = tiers[idx];
              const price = annual ? tier.annual : tier.monthly;
              const isPremium = plan.key === "premium";
              const isEnterprise = plan.key === "enterprise";

              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl p-7 transition-all duration-200 ${
                    isPremium
                      ? "bg-white border-2 border-indigo-300 shadow-[0_0_0_1px_rgba(110,93,198,0.1),0_8px_24px_rgba(110,93,198,0.08)]"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  {/* Popular badge */}
                  {isPremium && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[0.04em] uppercase px-3 py-1 bg-indigo-300 text-white rounded-full">
                      Most popular
                    </span>
                  )}

                  {/* Header */}
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[22px] text-indigo-400 mb-0.5">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-gray-500 mb-5">{plan.tagline}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-0.5 mb-1">
                    <span className="font-[family-name:var(--font-display)] font-black text-[38px] leading-none text-indigo-400 tracking-tight">
                      {fmtMoney(price, currency)}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">/mo</span>
                  </div>
                  <p className="text-[13px] text-gray-500 mb-3">
                    {tier.credits.toLocaleString()} credits/mo included
                  </p>

                  {/* Sizing */}
                  <div className="flex items-center gap-2 pb-5 border-b border-gray-100 mb-5">
                    <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-gray-200">
                      Best for
                    </span>
                    <span className="text-[13px] font-medium text-indigo-400">
                      {plan.sizing}
                    </span>
                  </div>

                  {/* Credit slider */}
                  <div className="mb-6">
                    <label className="block text-[11px] font-semibold tracking-[0.04em] uppercase text-gray-200 mb-2.5">
                      Adjust credits
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={tiers.length - 1}
                      step={1}
                      value={idx}
                      onChange={(e) =>
                        setSliderValues((prev) => ({
                          ...prev,
                          [plan.key]: parseInt(e.target.value),
                        }))
                      }
                      className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]
                        [&::-webkit-slider-thumb]:bg-indigo-300 [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white
                        [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.15)]
                        [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                    <div className="flex justify-between mt-1.5">
                      {tiers.map((t) => (
                        <span
                          key={t.credits}
                          className="text-[11px] text-gray-200 font-mono font-medium"
                        >
                          {fmtCredits(t.credits)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {isEnterprise ? (
                    <button
                      onClick={() => {
                        setAddonsOpen(true);
                        setTimeout(() => {
                          document
                            .getElementById("enterprise-addons")
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                      className="w-full flex items-center justify-center h-11 rounded-lg text-[15px] font-medium transition-colors bg-white border border-gray-100 text-indigo-400 hover:border-indigo-200 cursor-pointer mb-6"
                    >
                      {plan.ctaLabel}
                    </button>
                  ) : (
                    <a
                      href="#"
                      className={`w-full flex items-center justify-center h-11 rounded-lg text-[15px] font-medium transition-colors mb-6 ${
                        isPremium
                          ? "bg-blue-hl hover:bg-blue-hl-hover text-white"
                          : "bg-white border border-gray-100 text-indigo-400 hover:border-indigo-200"
                      }`}
                    >
                      {plan.ctaLabel}
                    </a>
                  )}

                  {/* Features */}
                  {plan.preamble && (
                    <p className="text-[12px] text-gray-500 font-medium mb-3">
                      {plan.preamble}
                    </p>
                  )}
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[14px] text-gray-500"
                      >
                        <CheckIcon className="text-green" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. HOW CREDITS WORK (collapsible)
      ═══════════════════════════════════════════════ */}
      <section className="pb-4">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <button
            onClick={() => setCreditsOpen(!creditsOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-7 py-5 cursor-pointer hover:border-indigo-100 transition-colors"
          >
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[18px] text-indigo-400">
              How do credits work?
            </h2>
            <ChevronDown open={creditsOpen} />
          </button>

          {creditsOpen && (
            <div className="pt-6 animate-[fadeSlide_350ms_ease-out_both]">
              {/* 3-step explainer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    n: "1",
                    title: "Build a workflow",
                    desc: "Create a Journey — like onboarding — with steps: send email, assign task, request signature, notify manager.",
                  },
                  {
                    n: "2",
                    title: "People go through it",
                    desc: "When someone starts onboarding, each step they pass through consumes one credit.",
                  },
                  {
                    n: "3",
                    title: "Scale predictably",
                    desc: "A 25-step onboarding for 10 people = 250 credits. Conditions skip steps that don't apply — so real usage is lower.",
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="bg-white border border-gray-100 rounded-xl p-6"
                  >
                    <div className="w-7 h-7 bg-indigo-5 text-indigo-300 rounded-full flex items-center justify-center text-[13px] font-bold mb-3">
                      {step.n}
                    </div>
                    <h3 className="text-[15px] font-semibold text-indigo-400 mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calculator */}
              <div className="bg-white border border-gray-100 rounded-xl p-7">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[16px] text-indigo-400 mb-5">
                  Estimate your usage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1.2fr] gap-4 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.04em] uppercase text-gray-200 mb-1.5">
                      Employees/month
                    </label>
                    <input
                      type="number"
                      value={calcEmployees}
                      onChange={(e) =>
                        setCalcEmployees(Math.max(1, parseInt(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-[15px] font-medium text-indigo-400 bg-gray-50 outline-none focus:border-indigo-300 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.04em] uppercase text-gray-200 mb-1.5">
                      Active workflows
                    </label>
                    <input
                      type="number"
                      value={calcWorkflows}
                      onChange={(e) =>
                        setCalcWorkflows(Math.max(1, parseInt(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-[15px] font-medium text-indigo-400 bg-gray-50 outline-none focus:border-indigo-300 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.04em] uppercase text-gray-200 mb-1.5">
                      Avg. steps/workflow
                    </label>
                    <input
                      type="number"
                      value={calcSteps}
                      onChange={(e) =>
                        setCalcSteps(Math.max(1, parseInt(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-[15px] font-medium text-indigo-400 bg-gray-50 outline-none focus:border-indigo-300 transition-colors"
                    />
                  </div>
                  <div className="bg-indigo-5 rounded-xl p-4 text-center">
                    <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-indigo-300 mb-1">
                      Estimated monthly credits
                    </p>
                    <p className="font-[family-name:var(--font-display)] font-black text-[28px] leading-none text-indigo-300">
                      ~{calcEstimate.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      After ~20% condition savings
                    </p>
                    <p className="text-[12px] font-semibold text-indigo-400 mt-2 pt-2 border-t border-indigo-50">
                      Fits {calcRecommendation} plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. COMPARE FEATURES (collapsible)
      ═══════════════════════════════════════════════ */}
      <section className="pb-4">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <button
            onClick={() => setCompareOpen(!compareOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-7 py-5 cursor-pointer hover:border-indigo-100 transition-colors"
          >
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[18px] text-indigo-400">
              Compare all features
            </h2>
            <ChevronDown open={compareOpen} />
          </button>

          {compareOpen && (
            <div className="pt-4 animate-[fadeSlide_350ms_ease-out_both]">
              <div className="border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
                {/* Header */}
                <div className="grid grid-cols-[1fr_90px_90px_90px] md:grid-cols-[1fr_140px_140px_140px] bg-gray-50 px-6 py-4 text-sm font-semibold text-indigo-400">
                  <span>Feature</span>
                  <span className="text-center">Business</span>
                  <span className="text-center">Premium</span>
                  <span className="text-center">Enterprise</span>
                </div>

                {featureGroups.map((group) => (
                  <div key={group.category}>
                    <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                        {group.category}
                      </span>
                    </div>
                    {group.features.map((feat) => (
                      <div
                        key={feat.name}
                        className="grid grid-cols-[1fr_90px_90px_90px] md:grid-cols-[1fr_140px_140px_140px] px-6 py-3 border-b border-gray-100 text-[14px]"
                      >
                        <span className="text-indigo-400">{feat.name}</span>
                        <span className="flex justify-center">
                          <FeatureCell value={feat.business} />
                        </span>
                        <span className="flex justify-center">
                          <FeatureCell value={feat.premium} />
                        </span>
                        <span className="flex justify-center">
                          <FeatureCell value={feat.enterprise} />
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. ENTERPRISE ADD-ONS (revealed on demand)
      ═══════════════════════════════════════════════ */}
      {addonsOpen && (
        <section id="enterprise-addons" className="py-12">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 animate-[fadeSlide_350ms_ease-out_both]">
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[24px] md:text-[28px] tracking-[-0.02em] text-indigo-400 mb-2">
              Customize your Enterprise package
            </h2>
            <p className="text-[15px] text-gray-500 mb-8">
              Add dedicated support hours, SMS messaging, or a service retainer
              to your plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Support hours */}
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-[15px] font-semibold text-indigo-400 mb-1">
                  Dedicated support hours
                </h3>
                <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                  Expert help with workflows, integrations, and optimization.
                </p>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={4}
                  value={supportHours}
                  onChange={(e) => setSupportHours(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer mb-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-indigo-300 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                />
                <p className="text-[13px] text-gray-500">{supportHours} hrs/mo</p>
                <p className="text-[15px] font-semibold text-indigo-400 mt-1">
                  {supportHours === 0
                    ? "$0/mo"
                    : `${fmtMoney(supportCost, currency)}/mo`}
                </p>
              </div>

              {/* SMS */}
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-[15px] font-semibold text-indigo-400 mb-1">
                  SMS messaging
                </h3>
                <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                  2,000 SMS included. Additional messages at $0.05 each.
                </p>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={500}
                  value={smsExtra}
                  onChange={(e) => setSmsExtra(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer mb-2
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-indigo-300 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                />
                <p className="text-[13px] text-gray-500">
                  +{smsExtra.toLocaleString()} extra/mo
                </p>
                <p className="text-[15px] font-semibold text-indigo-400 mt-1">
                  {smsExtra === 0
                    ? "Included"
                    : `${fmtMoney(smsCost, currency)}/mo`}
                </p>
              </div>

              {/* Retainer */}
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="text-[15px] font-semibold text-indigo-400 mb-1">
                  Service retainer
                </h3>
                <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                  Ongoing workflow building and optimization at $200/hr.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    { label: "None", hours: 0 },
                    { label: "0.5 day/wk", hours: 8 },
                    { label: "1 day/wk", hours: 16 },
                    { label: "2 days/wk", hours: 32 },
                  ].map((opt) => (
                    <button
                      key={opt.hours}
                      onClick={() => setRetainerHours(opt.hours)}
                      className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                        retainerHours === opt.hours
                          ? "bg-indigo-5 border border-indigo-300 text-indigo-300"
                          : "bg-gray-50 border border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[15px] font-semibold text-indigo-400">
                  {retainerHours === 0
                    ? "$0/mo"
                    : `${fmtMoney(retainerCost, currency)}/mo`}
                </p>
              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-white border border-gray-100 rounded-xl p-7 max-w-[420px]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px] text-gray-500">
                  <span>Credits ({fmtCredits(enterpriseTier.credits)}/mo)</span>
                  <span>{fmtMoney(enterpriseCreditsPrice, currency)}/mo</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500">
                  <span>Support</span>
                  <span>
                    {supportCost === 0
                      ? "$0/mo"
                      : `${fmtMoney(supportCost, currency)}/mo`}
                  </span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500">
                  <span>SMS</span>
                  <span>
                    {smsCost === 0
                      ? "Included"
                      : `${fmtMoney(smsCost, currency)}/mo`}
                  </span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500">
                  <span>Retainer</span>
                  <span>
                    {retainerCost === 0
                      ? "$0/mo"
                      : `${fmtMoney(retainerCost, currency)}/mo`}
                  </span>
                </div>
                <div className="flex justify-between text-[18px] font-bold text-indigo-400 pt-3 mt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{fmtMoney(enterpriseTotal, currency)}/mo</span>
                </div>
              </div>
              {annual && (
                <p className="text-[12px] text-green font-medium mt-2">
                  You save {fmtMoney(enterpriseAnnualSavings, currency)}/yr with
                  annual billing
                </p>
              )}
              <a
                href="#"
                className="mt-4 w-full flex items-center justify-center h-11 rounded-lg text-[15px] font-medium bg-blue-hl hover:bg-blue-hl-hover text-white transition-colors"
              >
                Get a custom quote
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          6. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[28px] md:text-[32px] leading-[1] tracking-[-0.02em] text-indigo-400 text-center mb-8">
            Common questions
          </h2>
          <div className="border-t border-gray-100">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="text-[16px] font-medium text-indigo-400">
                    {faq.q}
                  </span>
                  <span className="text-gray-200 text-lg shrink-0">
                    {openFaq === i ? "\u2212" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-[14px] text-gray-500 max-w-[600px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. BOTTOM CTA
      ═══════════════════════════════════════════════ */}
      <section className="bg-indigo-5 py-20">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[32px] leading-[1.1] tracking-[-0.02em] text-indigo-400 mb-6">
            Ready to automate your HR workflows?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="bg-blue-hl hover:bg-blue-hl-hover text-white text-[15px] font-medium rounded-lg px-6 h-11 flex items-center transition-colors"
            >
              Book a Demo
            </a>
            <a
              href="#"
              className="text-[15px] font-medium text-indigo-400 border border-gray-100 hover:border-indigo-200 rounded-lg px-6 h-11 flex items-center transition-colors"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
