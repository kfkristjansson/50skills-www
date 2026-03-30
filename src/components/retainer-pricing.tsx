"use client";

import { useState, useMemo } from "react";
import {
  type Currency,
  currencies,
  formatPrice,
} from "@/lib/pricing-data";

/* ─── Constants ─── */

const BASE_RATE_USD = 235; // USD/hr ≈ 32,445 ISK at 138 ISK/USD (ex. VAT)
const BLOCK_SIZE = 16; // hours per block (2 days)

// Progressive marginal discounts — each 16-hour block gets a deeper discount
const BLOCK_DISCOUNTS = [0.05, 0.10, 0.15, 0.20];

const TIERS = [
  { days: 2, hours: 16, blocks: 1 },
  { days: 4, hours: 32, blocks: 2 },
  { days: 6, hours: 48, blocks: 3 },
  { days: 8, hours: 64, blocks: 4 },
];

const SLIDER_MARKS = [2, 4, 6, 8];

/* ─── Helpers ─── */

function calcRetainer(blocks: number) {
  let total = 0;
  const breakdown: { hours: number; rate: number; discount: number; cost: number }[] = [];
  for (let i = 0; i < blocks; i++) {
    const discount = BLOCK_DISCOUNTS[i];
    const rate = BASE_RATE_USD * (1 - discount);
    const cost = BLOCK_SIZE * rate;
    breakdown.push({ hours: BLOCK_SIZE, rate, discount, cost });
    total += cost;
  }
  const totalHours = blocks * BLOCK_SIZE;
  const effectiveRate = total / totalHours;
  const savingsVsBase = (BASE_RATE_USD * totalHours) - total;
  return { total, totalHours, effectiveRate, savingsVsBase, breakdown };
}

/* ─── Component ─── */

export function RetainerPricing() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [selectedDays, setSelectedDays] = useState(2);

  const tier = useMemo(
    () => TIERS.find((t) => t.days === selectedDays) ?? TIERS[0],
    [selectedDays]
  );

  const retainer = useMemo(() => calcRetainer(tier.blocks), [tier]);
  const monthlyCost = retainer.total;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="pt-32 pb-12 text-center">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-indigo-300 mb-3">
            Service Retainers
          </p>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.03em] text-indigo-400 mb-5">
            Dedicated expert time
            <br />
            for your workflows
          </h1>
          <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto mb-10 leading-relaxed">
            For building new workflows, major integrations, or system redesigns.
            Flexible packages measured in days per month — scale up or down with
            30 days notice.
          </p>

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
          <p className="text-xs text-gray-400 mt-4">
            All prices exclude VAT, which is added where applicable.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SLIDER + RESULT
      ═══════════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          {/* Main card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 mb-8">
            {/* Slider header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Days per month
              </span>
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-indigo-400 tracking-tight">
                {selectedDays} days
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              1 day = 8 hours of dedicated expert time
            </p>

            {/* Slider */}
            <div className="mb-8">
              <input
                type="range"
                min={0}
                max={SLIDER_MARKS.length - 1}
                step={1}
                value={SLIDER_MARKS.indexOf(selectedDays)}
                onChange={(e) =>
                  setSelectedDays(SLIDER_MARKS[parseInt(e.target.value)])
                }
                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-hl
                  [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(51,127,255,0.3)] [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-blue-hl [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                {SLIDER_MARKS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    className={`text-xs font-medium transition-colors ${
                      d === selectedDays
                        ? "text-indigo-400"
                        : "text-gray-500 hover:text-indigo-400"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm text-gray-500">Monthly cost</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-indigo-400 tracking-tight">
                    {formatPrice(monthlyCost, currency)}
                  </span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Effective hourly rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(retainer.effectiveRate, currency)}/hr
                  </span>
                  <span className="text-[10px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                    {Math.round((1 - retainer.effectiveRate / BASE_RATE_USD) * 100)}% avg discount
                  </span>
                </div>
              </div>
            </div>

            {/* Progressive breakdown */}
            {retainer.breakdown.map((block, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Hours {i * BLOCK_SIZE + 1}–{(i + 1) * BLOCK_SIZE}
                  </span>
                  <span className="text-[10px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                    {Math.round(block.discount * 100)}% off
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatPrice(block.rate, currency)}/hr
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Total hours</span>
              <span className="text-sm font-semibold text-gray-900">
                {retainer.totalHours} hours
              </span>
            </div>
            {retainer.savingsVsBase > 0 && (
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">You save vs. base rate</span>
                <span className="text-sm font-semibold text-green">
                  {formatPrice(retainer.savingsVsBase, currency)}/mo
                </span>
              </div>
            )}
          </div>

          {/* Tier comparison table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 pt-6 pb-4">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-indigo-400">
                All retainer options
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-8 py-3">
                      Size
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Hours
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Rate
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Discount
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-8 py-3">
                      Monthly
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((t) => {
                    const r = calcRetainer(t.blocks);
                    const isSelected = t.days === selectedDays;
                    return (
                      <tr
                        key={t.days}
                        onClick={() => setSelectedDays(t.days)}
                        className={`border-t border-gray-100 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-indigo-5"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-8 py-4">
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? "text-indigo-400" : "text-gray-900"
                            }`}
                          >
                            {t.days} days/month
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {t.hours} hrs
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatPrice(r.effectiveRate, currency)}/hr
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[10px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                            up to {Math.round(BLOCK_DISCOUNTS[t.blocks - 1] * 100)}% off
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <span
                            className={`text-sm font-bold ${
                              isSelected ? "text-indigo-400" : "text-gray-900"
                            }`}
                          >
                            {formatPrice(r.total, currency)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-5 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E5DC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                What&apos;s included
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Workflow building, integration setup, system architecture,
                optimization, and complex configuration work.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-5 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E5DC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Flexible commitment
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Start, adjust, or stop with 30 days notice.
                Scale up for big projects, scale down when you&apos;re set.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-5 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E5DC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Separate from support
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enterprise plans include support access. Retainers are for
                dedicated project work — completely optional and independent.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="mailto:kristjan@50skills.com"
              className="inline-flex items-center gap-2 bg-indigo-400 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-indigo-300 transition-colors"
            >
              Talk to us about retainers
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Or ask your account manager to set one up
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
