"use client";

import { useState } from "react";
import {
  type Currency,
  type PlanName,
  type FeatureValue,
  currencies,
  formatPrice,
  featureGroups,
  faqs,
  planLimits,
  allTiers,
} from "@/lib/pricing-data";

/* ─── Icons ─── */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
    >
      <path
        d="M5 8H11"
        stroke="#C8C8D0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Accordion ─── */

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
      >
        <span className="text-[18px] font-medium text-indigo-400">
          {question}
        </span>
        <ChevronDown open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-base text-gray-500 max-w-[640px]">{answer}</p>
      </div>
    </div>
  );
}

/* ─── Feature Value Cell ─── */

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm font-medium text-indigo-400">{value}</span>
    );
  }
  return value ? <CheckIcon className="text-green" /> : <DashIcon />;
}

/* ─── Plan Card Data ─── */

type PlanCardData = {
  name: PlanName;
  description: string;
  monthlyUsd: number | null;
  yearlyUsd: number | null;
  credits: string;
  features: { text: string; bold: boolean }[];
  preamble: string | null;
  ctaLabel: string;
  ctaPrimary: boolean;
};

const plans: PlanCardData[] = [
  {
    name: "Business",
    description: "For small teams getting started",
    monthlyUsd: 349,
    yearlyUsd: 291,
    credits: "3,000",
    features: [
      { text: "AI Agents & Workflow Helper", bold: false },
      { text: "Private workspaces", bold: false },
      { text: "Document templates", bold: false },
      { text: "Custom email domain", bold: false },
      { text: "100 free SMS", bold: false },
      { text: "Live support", bold: false },
    ],
    preamble: null,
    ctaLabel: "Get started",
    ctaPrimary: false,
  },
  {
    name: "Premium",
    description: "For teams ready to automate at scale",
    monthlyUsd: 1149,
    yearlyUsd: 958,
    credits: "18,000",
    features: [
      { text: "Custom portal URL", bold: false },
      { text: "Webhook actions", bold: false },
      { text: "Code actions", bold: false },
      { text: "Calendar event actions", bold: false },
      { text: "Retainer with experts", bold: false },
      { text: "500 free SMS", bold: false },
    ],
    preamble: "Everything in Business, plus:",
    ctaLabel: "Get started",
    ctaPrimary: true,
  },
  {
    name: "Enterprise",
    description: "For large teams with complex needs",
    monthlyUsd: null,
    yearlyUsd: null,
    credits: "Custom",
    features: [
      { text: "Azure Single Sign-On (SSO)", bold: false },
      { text: "Dedicated account manager", bold: false },
      { text: "Customer support engineer", bold: false },
      { text: "Priority support", bold: false },
      { text: "Custom payment options", bold: false },
      { text: "Annual credit limits", bold: false },
    ],
    preamble: "Everything in Premium, plus:",
    ctaLabel: "Talk to an expert",
    ctaPrimary: false,
  },
];

/* Premium-only features shown as upsell on Business card */
const premiumUpsellFeatures = [
  "Webhook actions",
  "Code actions",
  "Calendar event actions",
  "Custom portal URL",
  "20hrs expert implementation",
];

/* ─── Main Component ─── */

export function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("Premium");
  const [annual, setAnnual] = useState(true);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [compareOpen, setCompareOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const planNames: PlanName[] = ["Business", "Premium", "Enterprise"];

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[48px] md:text-[56px] leading-[1.0] tracking-[-0.03em] text-indigo-400 mb-5">
            Plans that grow with your team
          </h1>
          <p className="text-lg text-gray-500 max-w-[640px] mx-auto">
            Every plan includes live support and AI-powered workflow automation.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. CONTROLS BAR
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* Plan selector tabs */}
            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
              {planNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedPlan(name)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedPlan === name
                      ? "bg-white text-indigo-400 shadow-sm"
                      : "text-gray-500 hover:text-indigo-400"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
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
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  annual
                    ? "bg-white text-indigo-400 shadow-sm"
                    : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                Yearly
                <span className="text-[11px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                  ~17%
                </span>
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

      {/* ═══════════════════════════════════════════════════
          3. PLAN CARDS
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.name;
              const isDark = isSelected;
              const isPremium = plan.name === "Premium";
              const isBusiness = plan.name === "Business";
              const priceUsd = annual ? plan.yearlyUsd : plan.monthlyUsd;
              const hasPrice = priceUsd !== null;
              const limits = planLimits[plan.name];

              return (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                    isDark
                      ? "bg-indigo-400 text-white"
                      : isPremium
                        ? "bg-white border border-gray-100 ring-2 ring-indigo-50"
                        : "bg-white border border-gray-100"
                  }`}
                >
                  {/* Recommended badge — always on Premium */}
                  {isPremium && (
                    <span
                      className={`inline-block text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full mb-4 ${
                        isDark
                          ? "bg-green/20 text-green"
                          : "bg-orange/10 text-orange"
                      }`}
                    >
                      Recommended
                    </span>
                  )}

                  {/* Plan name */}
                  <h3
                    className={`font-[family-name:var(--font-display)] font-bold text-2xl mb-1 ${
                      isDark ? "text-white" : "text-indigo-400"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm mb-5 ${
                      isDark ? "text-[#EFECFE]" : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-1">
                    {hasPrice ? (
                      <>
                        <span
                          className={`font-[family-name:var(--font-display)] font-black text-[40px] leading-none ${
                            isDark ? "text-white" : "text-indigo-400"
                          }`}
                        >
                          {formatPrice(priceUsd, currency)}
                        </span>
                        <span
                          className={`text-sm ml-1 ${
                            isDark ? "text-[#EFECFE]" : "text-gray-500"
                          }`}
                        >
                          /mo
                        </span>
                      </>
                    ) : (
                      <span
                        className={`font-[family-name:var(--font-display)] font-black text-[40px] leading-none ${
                          isDark ? "text-white" : "text-indigo-400"
                        }`}
                      >
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Credits */}
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-[#EFECFE]" : "text-indigo-400"
                    }`}
                  >
                    {plan.credits} credits/month
                  </p>

                  {/* Plan limits */}
                  <p
                    className={`text-xs mb-6 ${
                      isDark ? "text-[#EFECFE]" : "text-gray-500"
                    }`}
                  >
                    {plan.name === "Enterprise"
                      ? "Unlimited users & workspaces"
                      : `${limits.adminUsers} admin users \u00B7 ${limits.workspaces} workspaces`}
                  </p>

                  {/* Implementation callout — Premium only */}
                  {isPremium && (
                    <div
                      className={`rounded-lg px-3 py-2 mb-4 ${
                        isDark ? "bg-white/10" : "bg-indigo-5"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold flex items-start gap-1.5 ${
                          isDark ? "text-white" : "text-indigo-400"
                        }`}
                      >
                        <CheckIcon className="text-green" />
                        Up to 20 hours expert implementation included
                      </p>
                      <p
                        className={`text-xs mt-1 ml-[22px] ${
                          isDark ? "text-[#EFECFE]" : "text-gray-500"
                        }`}
                      >
                        We build your first workflows with you
                      </p>
                    </div>
                  )}

                  {/* Preamble */}
                  {plan.preamble && (
                    <p
                      className={`text-xs mb-4 ${
                        isDark ? "text-[#EFECFE]" : "text-gray-500"
                      }`}
                    >
                      {plan.preamble}
                    </p>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f.text}
                        className={`flex items-start gap-2 text-[15px] ${
                          f.bold
                            ? isDark
                              ? "font-semibold text-white"
                              : "font-semibold text-indigo-400"
                            : isDark
                              ? "text-[#EFECFE]"
                              : "text-gray-500"
                        }`}
                      >
                        <CheckIcon className="text-green" />
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  {/* Premium upsell on Business card */}
                  {isBusiness && (
                    <div className="mb-6">
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.06em] mb-3 ${
                          isDark ? "text-[#EFECFE]" : "text-gray-500"
                        }`}
                      >
                        Available on Premium
                      </p>
                      <ul className="space-y-2.5">
                        {premiumUpsellFeatures.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center gap-2 text-gray-200 text-[14px]"
                          >
                            <span className="text-gray-200">{feat}</span>
                            <span className="bg-indigo-5 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                              Premium
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <a
                    href="#"
                    className={`w-full flex items-center justify-center h-11 rounded-lg text-[15px] font-medium transition-colors ${
                      isDark && plan.ctaPrimary
                        ? "bg-blue-hl hover:bg-blue-hl-hover text-white"
                        : isDark
                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          : "bg-white border border-gray-100 text-indigo-400 hover:border-indigo-200"
                    }`}
                  >
                    {plan.ctaLabel}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. CALCULATOR LINK
      ═══════════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
            <div className="bg-indigo-5 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-[20px] md:text-[22px] tracking-[-0.02em] text-indigo-400 mb-2">
                See all credit tiers
              </h3>
              <p className="text-[14px] text-gray-500 mb-4">
                Full tier-by-tier pricing across all plans and currencies.
              </p>
              <a
                href="/pricing/overview"
                className="inline-flex items-center text-blue-hl hover:text-blue-hl-hover text-[15px] font-medium transition-colors"
              >
                View credit overview &rarr;
              </a>
            </div>
            <div className="bg-indigo-5 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-[20px] md:text-[22px] tracking-[-0.02em] text-indigo-400 mb-2">
                Estimate your usage
              </h3>
              <p className="text-[14px] text-gray-500 mb-4">
                Build a business case based on your company size and workflows.
              </p>
              <a
                href={`/pricing/calculator?plan=${selectedPlan}&annual=${annual}`}
                className="inline-flex items-center text-blue-hl hover:text-blue-hl-hover text-[15px] font-medium transition-colors"
              >
                Build your business case &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. FEATURE COMPARISON TABLE
      ═══════════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
          <button
            onClick={() => setCompareOpen(!compareOpen)}
            className="w-full flex items-center justify-center gap-2 py-4 text-[15px] font-medium text-indigo-400 hover:text-blue-hl transition-colors cursor-pointer"
          >
            Compare all features
            <ChevronDown open={compareOpen} />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              compareOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border border-gray-100 rounded-2xl overflow-hidden mt-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px_80px] md:grid-cols-[1fr_140px_140px_140px] bg-gray-50 px-6 py-4 text-sm font-semibold text-indigo-400">
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
                      className="grid grid-cols-[1fr_80px_80px_80px] md:grid-cols-[1fr_140px_140px_140px] px-6 py-3 border-b border-gray-100 text-[15px]"
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. FAQ
      ═══════════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[28px] md:text-[32px] leading-[1] tracking-[-0.02em] text-indigo-400 text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="border-t border-gray-100">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. BOTTOM CTA
      ═══════════════════════════════════════════════════ */}
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
