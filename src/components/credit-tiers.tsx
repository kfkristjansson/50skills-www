"use client";

import { useState } from "react";
import {
  type Currency,
  type PlanName,
  currencies,
  formatPrice,
  fmt,
  allTiers,
  currencyRates,
  currencySymbols,
} from "@/lib/pricing-data";

/* ─── Main Component ─── */

export function CreditTiers() {
  const [activePlan, setActivePlan] = useState<PlanName>("Business");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [annual, setAnnual] = useState(false);

  const tiers = allTiers[activePlan];
  const planNames: PlanName[] = ["Business", "Premium", "Enterprise"];

  function fmtRate(usdPerThousand: number): string {
    const converted = usdPerThousand * currencyRates[currency];
    const { prefix, suffix } = currencySymbols[currency];
    if (currency === "ISK") {
      return `${prefix}${Math.round(converted).toLocaleString("en-US")}${suffix}`;
    }
    if (currency === "SEK") {
      return `${prefix}${Math.round(converted).toLocaleString("en-US")}${suffix}`;
    }
    return `${prefix}${converted.toFixed(2)}${suffix}`;
  }

  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[28px] md:text-[32px] leading-[1] tracking-[-0.02em] text-indigo-400 mb-3">
            Credit tiers
          </h2>
          <p className="text-[15px] text-gray-500 max-w-[480px] mx-auto">
            The more you use, the less each credit costs. Annual billing saves 2 months.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Plan tabs */}
          <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
            {planNames.map((name) => (
              <button
                key={name}
                onClick={() => setActivePlan(name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePlan === name
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                !annual
                  ? "bg-white text-indigo-400 shadow-sm"
                  : "text-gray-500 hover:text-indigo-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                annual
                  ? "bg-white text-indigo-400 shadow-sm"
                  : "text-gray-500 hover:text-indigo-400"
              }`}
            >
              Annual
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
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
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

        {/* Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden max-w-[800px] mx-auto">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50 px-6 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
              Credits / month
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500 text-right">
              {annual ? "Annual" : "Monthly"} price
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500 text-right">
              Per 1,000 credits
            </span>
          </div>

          {/* Table rows */}
          {tiers.map((tier, i) => {
            const price = annual ? tier.annual : tier.monthly;
            const ratePerThousand = tier.monthly / tier.credits * 1000;

            return (
              <div
                key={tier.credits}
                className={`grid grid-cols-[1fr_1fr_1fr] px-6 py-4 ${
                  i < tiers.length - 1 ? "border-b border-gray-100" : ""
                } transition-colors hover:bg-gray-50/50`}
              >
                <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-indigo-400">
                  {fmt(tier.credits)}
                </span>
                <span className="text-[15px] font-medium text-indigo-400 text-right">
                  {formatPrice(price, currency)}
                  <span className="text-gray-500 font-normal">/mo</span>
                </span>
                <span className="text-[14px] text-gray-500 text-right font-mono">
                  {fmtRate(ratePerThousand)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        {activePlan === "Enterprise" && (
          <p className="text-center text-[14px] text-gray-500 mt-4">
            Need more than 200,000 credits?{" "}
            <a
              href="mailto:sales@50skills.com"
              className="text-blue-hl hover:text-blue-hl-hover font-medium transition-colors"
            >
              Talk to sales
            </a>{" "}
            for a custom quote.
          </p>
        )}
      </div>
    </section>
  );
}
