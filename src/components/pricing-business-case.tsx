"use client";

import { useState, useMemo, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Currency,
  PlanName,
  Tier,
  currencies,
  formatPrice,
  fmt,
  allTiers,
  findBestTier,
  findTierIndex,
  recommendPlan,
  journeyTemplates,
  JourneyTemplate,
  MONTH_NAMES,
  SeasonalSpike,
  seasonalPresets,
} from "@/lib/pricing-data";

/* ─── Local Types ─── */

type AiUsage = "none" | "light" | "heavy";
type EstimateTab = "templates" | "custom";

type CustomJourney = {
  id: number;
  name: string;
  actions: number;
  people: number;
};

/* ─── Slider Helpers ─── */

const SLIDER_MIN = 10;
const SLIDER_MAX = 100000;
const SLIDER_TICKS = [50, 200, 500, 1000, 2000, 5000, 10000, 50000];

function linearToLog(value: number): number {
  const minLog = Math.log(SLIDER_MIN);
  const maxLog = Math.log(SLIDER_MAX);
  return Math.round(Math.exp(minLog + (value / 1000) * (maxLog - minLog)));
}

function logToLinear(value: number): number {
  const minLog = Math.log(SLIDER_MIN);
  const maxLog = Math.log(SLIDER_MAX);
  return Math.round(((Math.log(value) - minLog) / (maxLog - minLog)) * 1000);
}

/* ─── Icons ─── */

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M3 4H13M4 4V13C4 13.5523 4.44772 14 5 14H11C11.5523 14 12 13.5523 12 13V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M4 6V2H12V6M4 12H2V8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8V12H12M4 10H12V14H4V10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M5 3H3C2.44772 3 2 3.44772 2 4V13C2 13.5523 2.44772 14 3 14H10C10.5523 14 11 13.5523 11 13V12M6 2H12C12.5523 2 13 2.44772 13 3V10C13 10.5523 12.5523 11 12 11H6C5.44772 11 5 10.5523 5 10V3C5 2.44772 5.44772 2 6 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Toggle Switch ─── */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
        on ? "bg-indigo-300" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ─── Journey Template Card ─── */

function JourneyCard({
  template,
  enabled,
  companySize,
  onToggle,
}: {
  template: JourneyTemplate;
  enabled: boolean;
  companySize: number;
  onToggle: () => void;
}) {
  const people = template.peopleFn(companySize);
  const credits = people * template.actions;

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-200 cursor-pointer ${
        enabled
          ? "bg-white border border-indigo-50 shadow-[0_1px_4px_rgba(35,0,78,0.04)] hover:shadow-[0_2px_8px_rgba(35,0,78,0.08)]"
          : "bg-gray-50 border border-gray-100 opacity-60 hover:opacity-80"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <Toggle on={enabled} onChange={onToggle} />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-indigo-400 mb-0.5">{template.name}</p>
          <p className="text-sm text-gray-500 mb-3 leading-snug">{template.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>~{template.actions} actions</span>
            <span>~{fmt(people)} people/mo</span>
            <span className="font-medium text-indigo-300">~{fmt(credits)} credits/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Custom Journey Row ─── */

function CustomJourneyRow({
  journey,
  onChange,
  onRemove,
  canRemove,
}: {
  journey: CustomJourney;
  onChange: (j: CustomJourney) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const credits = journey.people * journey.actions;

  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_32px] gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Journey name</label>
          <input
            type="text"
            placeholder="e.g., Onboarding"
            value={journey.name}
            onChange={(e) => onChange({ ...journey, name: e.target.value })}
            className="w-full border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 placeholder:text-gray-200 focus:outline-none focus:border-indigo-200 transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">People/mo</label>
          <input
            type="number"
            min={1}
            value={journey.people}
            onChange={(e) => onChange({ ...journey, people: Math.max(1, Number(e.target.value) || 1) })}
            className="w-full border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 text-right focus:outline-none focus:border-indigo-200 transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Actions</label>
          <input
            type="number"
            min={1}
            value={journey.actions}
            onChange={(e) => onChange({ ...journey, actions: Math.max(1, Number(e.target.value) || 1) })}
            className="w-full border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 text-right focus:outline-none focus:border-indigo-200 transition-colors"
          />
        </div>
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className={`h-[38px] w-[32px] flex items-center justify-center rounded-lg transition-colors self-end ${
            canRemove ? "text-gray-200 hover:text-orange hover:bg-orange/5 cursor-pointer" : "text-gray-100 cursor-not-allowed"
          }`}
        >
          <TrashIcon />
        </button>
      </div>
      <div className="mt-2 text-right">
        <span className="text-sm font-medium text-indigo-400">
          {fmt(journey.people)} &times; {fmt(journey.actions)} = {fmt(credits)} credits/mo
        </span>
      </div>
    </div>
  );
}

/* ─── Seasonal Spike Row ─── */

function SpikeRow({
  spike,
  onChange,
  onRemove,
}: {
  spike: SeasonalSpike;
  onChange: (s: SeasonalSpike) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <select
        value={spike.month}
        onChange={(e) => onChange({ ...spike, month: Number(e.target.value) })}
        className="border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 focus:outline-none focus:border-indigo-200 transition-colors w-[120px]"
      >
        {MONTH_NAMES.map((name, i) => (
          <option key={i} value={i}>
            {name}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0.1}
          max={10}
          step={0.1}
          value={spike.multiplier}
          onChange={(e) =>
            onChange({ ...spike, multiplier: Math.max(0.1, Math.min(10, Number(e.target.value) || 1)) })
          }
          className="w-[72px] border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 text-right focus:outline-none focus:border-indigo-200 transition-colors"
        />
        <span className="text-sm text-gray-500">x</span>
      </div>
      <input
        type="text"
        placeholder="Label (optional)"
        value={spike.label}
        onChange={(e) => onChange({ ...spike, label: e.target.value })}
        className="flex-1 border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 placeholder:text-gray-200 focus:outline-none focus:border-indigo-200 transition-colors"
      />
      <button
        onClick={onRemove}
        className="text-gray-200 hover:text-orange hover:bg-orange/5 rounded-lg p-2 transition-colors cursor-pointer"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

/* ─── Monthly Bar Chart ─── */

function MonthlyBarChart({
  monthlyProfile,
  seasonalSpikes,
}: {
  monthlyProfile: number[];
  seasonalSpikes: SeasonalSpike[];
}) {
  const maxCredits = Math.max(...monthlyProfile, 1);
  const spikeMonths = new Set(seasonalSpikes.map((s) => s.month));

  return (
    <div className="flex items-end gap-1.5 h-[120px] mt-4 mb-2">
      {monthlyProfile.map((credits, i) => {
        const heightPct = (credits / maxCredits) * 100;
        const isSpike = spikeMonths.has(i);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-500 font-medium">{fmt(credits)}</span>
            <div
              className={`w-full rounded-t-md transition-all duration-300 ${
                isSpike ? "bg-orange" : "bg-indigo-100"
              }`}
              style={{ height: `${Math.max(heightPct, 2)}%` }}
            />
            <span className="text-[10px] text-gray-500">{MONTH_NAMES[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Plan Tab Bar ─── */

function PlanTabs({
  active,
  onChange,
}: {
  active: PlanName;
  onChange: (p: PlanName) => void;
}) {
  return (
    <div className="flex gap-1 bg-gray-50 rounded-full p-1">
      {(["Business", "Premium", "Enterprise"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`flex-1 text-sm font-medium rounded-full px-4 py-2 transition-colors cursor-pointer ${
            active === p ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

/* ─── Shared Slider Styles ─── */

const sliderClass =
  "flex-1 h-2 appearance-none rounded-full cursor-pointer " +
  "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-100 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-300 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:-mt-1.5 " +
  "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gray-100 " +
  "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-300 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md " +
  "[&::-moz-range-progress]:bg-indigo-200 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:h-2";

/* ─── Auto-populate thresholds ─── */

const SIZE_JOURNEY_DEFAULTS: { max: number; ids: string[] }[] = [
  { max: 49, ids: ["onboarding", "contracts", "requests"] },
  { max: 199, ids: ["onboarding", "offboarding", "contracts", "background", "requests"] },
  { max: 999, ids: ["onboarding", "offboarding", "contracts", "background", "requests", "performance", "leave"] },
  { max: Infinity, ids: journeyTemplates.map((t) => t.id) },
];

function defaultJourneysForSize(size: number): Record<string, boolean> {
  const preset = SIZE_JOURNEY_DEFAULTS.find((p) => size <= p.max)!;
  return Object.fromEntries(journeyTemplates.map((j) => [j.id, preset.ids.includes(j.id)]));
}

/* ═══════════════════════════════════════════════════════════
   INNER COMPONENT (needs useSearchParams inside Suspense)
   ═══════════════════════════════════════════════════════════ */

function PricingBusinessCaseInner() {
  const searchParams = useSearchParams();

  /* ── URL params ── */
  const urlPlan = (searchParams.get("plan") || "Premium") as PlanName;
  const urlSize = searchParams.get("size") ? Number(searchParams.get("size")) : 200;
  const urlAnnual = searchParams.get("annual") !== "false";

  /* ── Global controls ── */
  const [annual, setAnnual] = useState(urlAnnual);
  const [currency, setCurrency] = useState<Currency>("USD");

  /* ── Company size ── */
  const [companySize, setCompanySize] = useState(Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, urlSize)));
  const sliderValue = logToLinear(companySize);

  /* ── Tab ── */
  const [estimateTab, setEstimateTab] = useState<EstimateTab>("templates");

  /* ── Template toggles ── */
  const [enabledJourneys, setEnabledJourneys] = useState<Record<string, boolean>>(
    defaultJourneysForSize(urlSize)
  );

  /* ── Track manual edits to stop auto-population ── */
  const hasManuallyEdited = useRef(false);

  /* ── Auto-populate journeys when company size changes ── */
  useEffect(() => {
    if (hasManuallyEdited.current) return;
    setEnabledJourneys(defaultJourneysForSize(companySize));
  }, [companySize]);

  /* ── AI usage ── */
  const [aiUsage, setAiUsage] = useState<AiUsage>("none");

  /* ── Custom journeys ── */
  const [customJourneys, setCustomJourneys] = useState<CustomJourney[]>([
    { id: 1, name: "", actions: 15, people: 50 },
  ]);
  const nextCustomId = useRef(2);

  /* ── Viewing plan (for tier tables + estimate) ── */
  const validPlans: PlanName[] = ["Business", "Premium", "Enterprise"];
  const [viewingPlan, setViewingPlan] = useState<PlanName>(
    validPlans.includes(urlPlan) ? urlPlan : "Premium"
  );

  /* ── Seasonal spikes ── */
  const [seasonalSpikes, setSeasonalSpikes] = useState<SeasonalSpike[]>([]);
  const [showSeasonal, setShowSeasonal] = useState(false);

  /* ── ROI inputs ── */
  const [hrRate, setHrRate] = useState(35);

  /* ── Clipboard state ── */
  const [copied, setCopied] = useState(false);

  /* ── Calculations ── */
  const aiMultiplier = aiUsage === "none" ? 1 : aiUsage === "light" ? 1.1 : 1.25;

  const templateCredits = useMemo(() => {
    return journeyTemplates.reduce((sum, t) => {
      if (!enabledJourneys[t.id]) return sum;
      return sum + t.peopleFn(companySize) * t.actions;
    }, 0);
  }, [enabledJourneys, companySize]);

  const customCredits = useMemo(() => {
    return customJourneys.reduce((sum, j) => sum + j.people * j.actions, 0);
  }, [customJourneys]);

  const rawBaseCredits = estimateTab === "templates" ? templateCredits : customCredits;
  const baseCredits = Math.round(rawBaseCredits * aiMultiplier);

  /* ── Monthly profile with seasonal spikes ── */
  const monthlyProfile = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const spike = seasonalSpikes.find((s) => s.month === i);
      return Math.round(baseCredits * (spike ? spike.multiplier : 1));
    });
  }, [baseCredits, seasonalSpikes]);

  const peakCredits = Math.max(...monthlyProfile);
  const avgCredits = Math.round(monthlyProfile.reduce((a, b) => a + b, 0) / 12);
  const annualTotalCredits = monthlyProfile.reduce((a, b) => a + b, 0);
  const peakMonthIndex = monthlyProfile.indexOf(peakCredits);

  /* ── The effective credits for recommendation depends on seasonal ── */
  const estimatedCredits = showSeasonal && seasonalSpikes.length > 0 ? peakCredits : baseCredits;

  const recommendedPlan = recommendPlan(estimatedCredits);
  const recommendedTiers = allTiers[recommendedPlan];
  const recommendedTier = findBestTier(estimatedCredits, recommendedTiers);
  const recommendedPrice = annual ? recommendedTier.annual : recommendedTier.monthly;

  /* ── Baseline tier (when seasonal active, the lower tier for non-peak) ── */
  const baselinePlan = recommendPlan(baseCredits);
  const baselineTier = findBestTier(baseCredits, allTiers[baselinePlan]);
  const baselinePrice = annual ? baselineTier.annual : baselineTier.monthly;

  /* ── Business plan overflow warning ── */
  const businessMaxCredits = allTiers.Business[allTiers.Business.length - 1].credits;
  const showBusinessWarning = viewingPlan === "Business" && estimatedCredits > businessMaxCredits;

  /* ── ROI calculations ── */
  const roiData = useMemo(() => {
    const enabledTemplates = journeyTemplates.filter((t) => enabledJourneys[t.id]);
    const totalHoursSaved = enabledTemplates.reduce((sum, t) => {
      return sum + t.peopleFn(companySize) * t.hoursSaved;
    }, 0);

    const priceForRoi =
      showSeasonal && seasonalSpikes.length > 0 ? recommendedPrice : recommendedPrice;

    const manualHoursPerMonth = totalHoursSaved / 0.8;
    const monthlyCostManual = manualHoursPerMonth * hrRate;
    const remainingManualHours = manualHoursPerMonth * 0.2;
    const monthlyCostWith50skills = priceForRoi + remainingManualHours * hrRate;
    const monthlySavings = monthlyCostManual - monthlyCostWith50skills;
    const roi = monthlyCostManual > 0 ? Math.round((monthlySavings / monthlyCostWith50skills) * 100) : 0;
    const paybackMonths = monthlySavings > 0 ? Math.max(1, Math.round(priceForRoi / monthlySavings)) : 0;

    return {
      totalHoursSaved: Math.round(totalHoursSaved),
      manualHoursPerMonth: Math.round(manualHoursPerMonth),
      monthlyCostManual: Math.round(monthlyCostManual),
      remainingManualHours: Math.round(remainingManualHours),
      monthlyCostWith50skills: Math.round(monthlyCostWith50skills),
      monthlySavings: Math.round(monthlySavings),
      roi,
      paybackMonths,
    };
  }, [enabledJourneys, companySize, hrRate, recommendedPrice, showSeasonal, seasonalSpikes]);

  /* ── Seasonal cost scenarios ── */
  const seasonalCostScenarios = useMemo(() => {
    if (!showSeasonal || seasonalSpikes.length === 0) return null;
    const peakTierPrice = annual ? recommendedTier.annual : recommendedTier.monthly;
    const stayOnPeak = peakTierPrice;

    // Calculate blended cost: baseline tier for non-spike months, peak tier for spike months
    const spikeMonthSet = new Set(seasonalSpikes.map((s) => s.month));
    const spikeMonthCount = spikeMonthSet.size;
    const nonSpikeMonths = 12 - spikeMonthCount;
    const blendedAnnual = baselinePrice * nonSpikeMonths + peakTierPrice * spikeMonthCount;
    const blendedMonthlyAvg = Math.round(blendedAnnual / 12);

    return { stayOnPeak, blendedMonthlyAvg };
  }, [showSeasonal, seasonalSpikes, recommendedTier, annual, baselinePrice]);

  /* ── Handlers ── */
  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanySize(linearToLog(Number(e.target.value)));
  }, []);

  const handleSizeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, Number(e.target.value) || SLIDER_MIN));
    setCompanySize(val);
  }, []);

  const toggleJourney = useCallback((id: string) => {
    hasManuallyEdited.current = true;
    setEnabledJourneys((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addCustomJourney = () => {
    if (customJourneys.length >= 8) return;
    setCustomJourneys([...customJourneys, { id: nextCustomId.current++, name: "", actions: 10, people: 20 }]);
  };

  const removeCustomJourney = (id: number) => {
    setCustomJourneys(customJourneys.filter((j) => j.id !== id));
  };

  const updateCustomJourney = (updated: CustomJourney) => {
    setCustomJourneys(customJourneys.map((j) => (j.id === updated.id ? updated : j)));
  };

  const addSpike = () => {
    if (seasonalSpikes.length >= 6) return;
    // Find a month not already used
    const usedMonths = new Set(seasonalSpikes.map((s) => s.month));
    const freeMonth = Array.from({ length: 12 }, (_, i) => i).find((m) => !usedMonths.has(m)) ?? 0;
    setSeasonalSpikes([...seasonalSpikes, { month: freeMonth, multiplier: 2, label: "" }]);
  };

  const removeSpike = (index: number) => {
    setSeasonalSpikes(seasonalSpikes.filter((_, i) => i !== index));
  };

  const updateSpike = (index: number, updated: SeasonalSpike) => {
    setSeasonalSpikes(seasonalSpikes.map((s, i) => (i === index ? updated : s)));
  };

  const applyPreset = (preset: SeasonalSpike[]) => {
    // Merge: replace months that overlap, add new ones
    const existing = new Map(seasonalSpikes.map((s) => [s.month, s]));
    preset.forEach((p) => existing.set(p.month, p));
    const merged = Array.from(existing.values()).slice(0, 6);
    setSeasonalSpikes(merged);
  };

  const copyToClipboard = () => {
    const plan = recommendedPlan;
    const price = formatPrice(recommendedPrice, currency);
    const hasSeasonal = showSeasonal && seasonalSpikes.length > 0;

    const lines = [
      `Business Case Summary — 50skills Journeys`,
      ``,
      `Company size: ${fmt(companySize)} employees`,
    ];

    if (hasSeasonal) {
      lines.push(`Baseline monthly usage: ${fmt(baseCredits)} credits`);
      lines.push(`Peak month (${MONTH_NAMES[peakMonthIndex]}): ${fmt(peakCredits)} credits`);
      lines.push(`Annual total: ${fmt(annualTotalCredits)} credits`);
      lines.push(`Average monthly: ${fmt(avgCredits)} credits`);
    } else {
      lines.push(`Estimated monthly usage: ${fmt(baseCredits)} credits`);
    }

    lines.push(``);
    lines.push(`Recommended plan: ${plan} — ${fmt(recommendedTier.credits)} credits/mo`);
    lines.push(`Price: ${price}/mo (${annual ? "yearly" : "monthly"} billing)`);

    if (hasSeasonal && seasonalCostScenarios) {
      lines.push(``);
      lines.push(`Stay on peak tier year-round: ${formatPrice(seasonalCostScenarios.stayOnPeak, currency)}/mo`);
      lines.push(`Flex between tiers: ~${formatPrice(seasonalCostScenarios.blendedMonthlyAvg, currency)}/mo average`);
    }

    lines.push(``);
    lines.push(`Time saved: ~${fmt(roiData.totalHoursSaved)} hours/month (${fmt(roiData.totalHoursSaved * 12)} hours/year)`);
    lines.push(`Cost without 50skills: ${formatPrice(roiData.monthlyCostManual, currency)}/mo`);
    lines.push(`Cost with 50skills: ${formatPrice(roiData.monthlyCostWith50skills, currency)}/mo`);
    lines.push(`Monthly savings: ${formatPrice(roiData.monthlySavings, currency)}/mo`);
    lines.push(`ROI: ${roiData.roi}%`);
    lines.push(``);
    lines.push(`Generated at 50skills.com/pricing/calculator`);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Slider tick position ── */
  const tickPosition = (val: number) => (logToLinear(val) / 1000) * 100;

  /* ── Tier table plan state ── */
  const [tierTablePlan, setTierTablePlan] = useState<PlanName>(viewingPlan);
  const tierTableTiers = allTiers[tierTablePlan];
  const tierTableBestIndex = findTierIndex(estimatedCredits, tierTableTiers);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 md:pt-32 md:pb-10 print:pt-8 print:pb-4">
        <div className="max-w-[960px] mx-auto px-6 md:px-10 text-center">
          <a
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-blue-hl hover:text-blue-hl-hover font-medium transition-colors mb-8 print:hidden"
          >
            <ChevronLeft />
            Back to pricing
          </a>

          <h1 className="font-[family-name:var(--font-display)] font-bold text-[36px] md:text-[40px] leading-[1.0] tracking-[-0.03em] text-indigo-400 mb-3">
            Business Case Builder
          </h1>
          <p className="text-lg text-gray-500 max-w-[540px] mx-auto mb-8">
            See what Journeys costs for your team and how much time it saves.
          </p>

          {/* Billing + Currency toggles */}
          <div className="flex items-center justify-center gap-3 flex-wrap print:hidden">
            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  !annual ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  annual ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
                }`}
              >
                Yearly
                <span className="text-[11px] font-semibold text-green bg-green/10 px-1.5 py-0.5 rounded-full">
                  ~17%
                </span>
              </button>
            </div>

            <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    currency === c ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
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
          2. COMPANY SIZE SLIDER
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12 print:pb-4">
        <div className="max-w-[960px] mx-auto px-6 md:px-10 text-center">
          <label className="text-[15px] font-medium text-indigo-400 mb-6 block">
            How many employees in your company?
          </label>

          <div className="max-w-[600px] mx-auto print:hidden">
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min={0}
                max={1000}
                value={sliderValue}
                onChange={handleSlider}
                className={sliderClass}
                style={{
                  background: `linear-gradient(to right, var(--color-indigo-200) 0%, var(--color-indigo-200) ${sliderValue / 10}%, var(--color-gray-100) ${sliderValue / 10}%, var(--color-gray-100) 100%)`,
                }}
              />
              <input
                type="number"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={companySize}
                onChange={handleSizeInput}
                className="w-[90px] border border-gray-100 bg-white rounded-lg px-3 py-2 text-sm text-indigo-400 text-center font-medium focus:outline-none focus:border-indigo-200 transition-colors"
              />
            </div>

            {/* Tick marks */}
            <div className="relative h-5 mx-2.5">
              {SLIDER_TICKS.map((tick) => (
                <span
                  key={tick}
                  className="absolute text-[10px] text-gray-500 -translate-x-1/2"
                  style={{ left: `${tickPosition(tick)}%` }}
                >
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </span>
              ))}
            </div>
          </div>

          {/* Print only */}
          <p className="hidden print:block text-2xl font-bold text-indigo-400">
            {fmt(companySize)} employees
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. JOURNEY TEMPLATES
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12 print:pb-6">
        <div className="max-w-[960px] mx-auto px-6 md:px-10">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-1 bg-gray-50 rounded-xl p-1 max-w-[320px] mx-auto mb-8 print:hidden">
            <button
              onClick={() => setEstimateTab("templates")}
              className={`flex-1 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors cursor-pointer ${
                estimateTab === "templates" ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
              }`}
            >
              Common workflows
            </button>
            <button
              onClick={() => setEstimateTab("custom")}
              className={`flex-1 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors cursor-pointer ${
                estimateTab === "custom" ? "bg-white text-indigo-400 shadow-sm" : "text-gray-500 hover:text-indigo-400"
              }`}
            >
              Custom estimate
            </button>
          </div>

          {/* ── Tab 1: Common Workflows ── */}
          {estimateTab === "templates" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {journeyTemplates.map((t) => (
                  <JourneyCard
                    key={t.id}
                    template={t}
                    enabled={enabledJourneys[t.id]}
                    companySize={companySize}
                    onToggle={() => toggleJourney(t.id)}
                  />
                ))}
              </div>

              {/* AI usage toggle */}
              <div className="text-center print:hidden">
                <p className="text-sm text-gray-500 mb-3">
                  AI-powered actions may use additional credits. Select your expected AI usage level.
                </p>
                <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full p-1">
                  {(
                    [
                      { label: "None", value: "none" as const },
                      { label: "Light (+10%)", value: "light" as const },
                      { label: "Heavy (+25%)", value: "heavy" as const },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAiUsage(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        aiUsage === opt.value
                          ? "bg-white text-indigo-400 shadow-sm"
                          : "text-gray-500 hover:text-indigo-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Tab 2: Custom Estimate ── */}
          {estimateTab === "custom" && (
            <div className="max-w-[700px] mx-auto">
              {customJourneys.map((j) => (
                <CustomJourneyRow
                  key={j.id}
                  journey={j}
                  onChange={updateCustomJourney}
                  onRemove={() => removeCustomJourney(j.id)}
                  canRemove={customJourneys.length > 1}
                />
              ))}

              {customJourneys.length < 8 && (
                <button
                  onClick={addCustomJourney}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-hl hover:text-blue-hl-hover transition-colors mb-6 cursor-pointer"
                >
                  <PlusIcon />
                  Add another Journey
                </button>
              )}

              {/* AI usage for custom tab */}
              <div className="mb-4">
                <label className="text-sm font-medium text-indigo-400 mb-3 block">AI usage level</label>
                <div className="flex gap-2">
                  {(
                    [
                      { label: "None", value: "none" as const },
                      { label: "Light (+10%)", value: "light" as const },
                      { label: "Heavy (+25%)", value: "heavy" as const },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAiUsage(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        aiUsage === opt.value
                          ? "bg-indigo-300 text-white"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. SEASONAL SPIKES (collapsed by default)
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12 print:pb-6">
        <div className="max-w-[960px] mx-auto px-6 md:px-10">
          <div className="max-w-[700px] mx-auto">
            {/* Toggle header */}
            <button
              onClick={() => setShowSeasonal(!showSeasonal)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer print:hidden"
            >
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-medium text-indigo-400">Add seasonal variation</span>
                {seasonalSpikes.length > 0 && (
                  <span className="text-xs font-medium text-orange bg-orange/10 px-2 py-0.5 rounded-full">
                    {seasonalSpikes.length} spike{seasonalSpikes.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <ChevronDown open={showSeasonal} />
            </button>

            {/* Expanded content */}
            <div
              className={`overflow-hidden transition-all duration-400 ${
                showSeasonal ? "max-h-[800px] opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              {/* Bar chart */}
              <MonthlyBarChart monthlyProfile={monthlyProfile} seasonalSpikes={seasonalSpikes} />

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mt-4 mb-4">
                {seasonalPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.spikes)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 hover:bg-indigo-5 hover:text-indigo-400 transition-colors cursor-pointer border border-gray-100"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Custom spike rows */}
              {seasonalSpikes.map((spike, i) => (
                <SpikeRow
                  key={`${spike.month}-${i}`}
                  spike={spike}
                  onChange={(s) => updateSpike(i, s)}
                  onRemove={() => removeSpike(i)}
                />
              ))}

              {/* Add spike button */}
              {seasonalSpikes.length < 6 && (
                <button
                  onClick={addSpike}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-hl hover:text-blue-hl-hover transition-colors mt-3 cursor-pointer"
                >
                  <PlusIcon />
                  Add spike
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. YOUR ESTIMATE
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12">
        <div className="max-w-[960px] mx-auto px-6 md:px-10">
          <div className="bg-indigo-5 rounded-2xl p-8 text-center">
            {/* ── When seasonal is active, show richer data ── */}
            {showSeasonal && seasonalSpikes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Baseline</p>
                    <p className="font-[family-name:var(--font-display)] font-bold text-[28px] leading-none text-indigo-400">
                      {fmt(baseCredits)}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">credits/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange mb-1 font-medium">
                      Peak month ({MONTH_NAMES[peakMonthIndex]})
                    </p>
                    <p className="font-[family-name:var(--font-display)] font-bold text-[28px] leading-none text-orange">
                      {fmt(peakCredits)}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">credits</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Annual total</p>
                    <p className="font-[family-name:var(--font-display)] font-bold text-[28px] leading-none text-indigo-400">
                      {fmt(annualTotalCredits)}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">credits</p>
                  </div>
                </div>

                {/* Peak vs baseline recommendation */}
                <div className="bg-white rounded-xl p-4 max-w-[600px] mx-auto mb-6 text-left">
                  <p className="text-sm text-indigo-400 font-medium mb-2">
                    Your peak month needs the{" "}
                    <span className="font-semibold">{recommendedPlan} {fmt(recommendedTier.credits)}</span> tier.
                    {baselinePlan !== recommendedPlan || baselineTier.credits !== recommendedTier.credits ? (
                      <>
                        {" "}Your baseline fits in{" "}
                        <span className="font-semibold">{baselinePlan} {fmt(baselineTier.credits)}</span>.
                      </>
                    ) : null}
                  </p>

                  {seasonalCostScenarios && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Stay on peak tier year-round</p>
                        <p className="text-lg font-bold text-indigo-400">
                          {formatPrice(seasonalCostScenarios.stayOnPeak, currency)}
                          <span className="text-sm font-normal text-gray-500">/mo</span>
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Flex between tiers</p>
                        <p className="text-lg font-bold text-indigo-400">
                          ~{formatPrice(seasonalCostScenarios.blendedMonthlyAvg, currency)}
                          <span className="text-sm font-normal text-gray-500">/mo avg</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">Estimated monthly usage</p>
                <p className="font-[family-name:var(--font-display)] font-bold text-[40px] leading-none text-indigo-400 mb-1">
                  {fmt(baseCredits)}
                  <span className="text-lg font-medium text-gray-500 ml-2">credits</span>
                </p>
              </>
            )}

            <div className="mt-6 mb-6">
              <p className="text-sm text-gray-500 mb-1">Recommended plan</p>
              <p className="text-xl font-semibold text-indigo-400">
                {recommendedPlan}
                <span className="text-gray-500 font-normal"> — </span>
                {fmt(recommendedTier.credits)} credits/month
              </p>
              <p className="text-2xl font-bold text-blue-hl mt-1">
                {formatPrice(recommendedPrice, currency)}
                <span className="text-sm font-normal text-gray-500">/mo</span>
                {annual && <span className="text-sm font-normal text-gray-500 ml-1">(yearly billing)</span>}
              </p>
            </div>

            <a
              href="#"
              className="inline-flex items-center bg-blue-hl hover:bg-blue-hl-hover text-white text-[15px] font-medium rounded-lg px-6 h-11 transition-colors print:hidden"
            >
              Get started with {recommendedPlan} &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. PLAN TIER TABLES
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12 print:hidden">
        <div className="max-w-[960px] mx-auto px-6 md:px-10">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[28px] leading-[1] tracking-[-0.02em] text-indigo-400 text-center mb-6">
            Credit tiers by plan
          </h2>

          {/* Plan tabs */}
          <div className="max-w-[400px] mx-auto mb-6">
            <PlanTabs active={tierTablePlan} onChange={setTierTablePlan} />
          </div>

          {/* Business plan overflow warning */}
          {tierTablePlan === "Business" && estimatedCredits > businessMaxCredits && (
            <div className="max-w-[600px] mx-auto mb-4 bg-orange/5 border border-orange/20 rounded-xl px-4 py-3 text-center">
              <p className="text-sm text-orange font-medium">
                Your usage exceeds Business limits. Consider Premium.
              </p>
            </div>
          )}

          {/* Tier table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-w-[600px] mx-auto">
            <div className="grid grid-cols-3 px-5 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100">
              <span>Credits/mo</span>
              <span className="text-right">Monthly</span>
              <span className="text-right">Yearly</span>
            </div>

            {tierTableTiers.map((tier, i) => {
              const isBestFit = i === tierTableBestIndex;
              return (
                <div
                  key={tier.credits}
                  className={`grid grid-cols-3 px-5 py-3.5 text-sm border-b border-gray-100 last:border-b-0 ${
                    isBestFit ? "bg-indigo-5" : ""
                  }`}
                >
                  <span className="font-medium text-indigo-400">
                    {fmt(tier.credits)}
                    {isBestFit && (
                      <span className="ml-1.5 text-[10px] font-semibold text-blue-hl bg-blue-hl/10 px-1.5 py-0.5 rounded-full">
                        Best fit
                      </span>
                    )}
                  </span>
                  <span className={`text-right ${!annual ? "font-semibold text-indigo-400" : "text-gray-500"}`}>
                    {formatPrice(tier.monthly, currency)}
                  </span>
                  <span className={`text-right ${annual ? "font-semibold text-indigo-400" : "text-gray-500"}`}>
                    {formatPrice(tier.annual, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. ROI SECTION
      ═══════════════════════════════════════════════════ */}
      {estimateTab === "templates" && (
        <section className="pb-16">
          <div className="max-w-[960px] mx-auto px-6 md:px-10">
            <h2 className="font-[family-name:var(--font-display)] font-bold text-[28px] leading-[1] tracking-[-0.02em] text-indigo-400 text-center mb-10">
              What this saves your team
            </h2>

            {/* ── Time Savings ── */}
            <div className="text-center mb-12">
              <p className="font-[family-name:var(--font-display)] font-bold text-[48px] leading-none text-indigo-400 mb-2">
                ~{fmt(roiData.totalHoursSaved)}
              </p>
              <p className="text-lg text-gray-500">hours saved per month</p>
              <p className="text-sm text-gray-500 mt-1">
                ({fmt(roiData.totalHoursSaved * 12)} hours per year)
              </p>

              {/* Breakdown */}
              <div className="mt-6 max-w-[500px] mx-auto">
                {journeyTemplates
                  .filter((t) => enabledJourneys[t.id])
                  .map((t) => {
                    const people = t.peopleFn(companySize);
                    const saved = Math.round(people * t.hoursSaved);
                    return (
                      <div key={t.id} className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-gray-500">{t.name}</span>
                        <span className="text-indigo-400 font-medium">~{fmt(saved)} hrs/mo</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ── HR Rate Slider ── */}
            <div className="max-w-[400px] mx-auto mb-10 text-center print:hidden">
              <label className="text-sm font-medium text-indigo-400 mb-3 block">
                Average HR salary
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={20}
                  max={80}
                  value={hrRate}
                  onChange={(e) => setHrRate(Number(e.target.value))}
                  className={sliderClass}
                  style={{
                    background: `linear-gradient(to right, var(--color-indigo-200) 0%, var(--color-indigo-200) ${((hrRate - 20) / 60) * 100}%, var(--color-gray-100) ${((hrRate - 20) / 60) * 100}%, var(--color-gray-100) 100%)`,
                  }}
                />
                <span className="text-lg font-semibold text-indigo-400 w-[60px] text-right">
                  ${hrRate}/hr
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-0.5">
                <span>$20/hr</span>
                <span>$80/hr</span>
              </div>
            </div>

            {/* Print only: show HR rate */}
            <p className="hidden print:block text-center text-sm text-gray-500 mb-6">
              Based on ${hrRate}/hr average HR salary
            </p>

            {/* ── Cost Comparison ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {/* Without 50skills */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Without 50skills</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Manual hours/mo</span>
                    <span className="font-medium text-indigo-400">{fmt(roiData.manualHoursPerMonth)} hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">At ${hrRate}/hr</span>
                    <span className="font-medium text-indigo-400">{formatPrice(roiData.monthlyCostManual, currency)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Monthly cost</span>
                      <span className="text-lg font-bold text-indigo-400">{formatPrice(roiData.monthlyCostManual, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* With 50skills */}
              <div className="bg-indigo-5 rounded-2xl p-6 border border-indigo-50">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-4">With 50skills</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subscription</span>
                    <span className="font-medium text-indigo-400">{formatPrice(recommendedPrice, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining manual</span>
                    <span className="font-medium text-indigo-400">{fmt(roiData.remainingManualHours)} hrs (~20%)</span>
                  </div>
                  <div className="border-t border-indigo-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Monthly cost</span>
                      <span className="text-lg font-bold text-indigo-400">{formatPrice(roiData.monthlyCostWith50skills, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings */}
              <div className="bg-indigo-400 rounded-2xl p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-4">Your savings</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-100">Time saved</span>
                    <span className="font-medium text-white">{fmt(roiData.totalHoursSaved)} hrs/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-100">Cost saved</span>
                    <span className="font-medium text-white">{formatPrice(roiData.monthlySavings, currency)}/mo</span>
                  </div>
                  <div className="border-t border-indigo-300/30 pt-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-indigo-100">ROI</span>
                      <span className="text-2xl font-bold text-green">{roiData.roi}%</span>
                    </div>
                    {roiData.paybackMonths > 0 && (
                      <p className="text-xs text-indigo-100 mt-2">
                        50skills pays for itself in ~{roiData.paybackMonths} {roiData.paybackMonths === 1 ? "month" : "months"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Implementation Reality ── */}
            <div className="max-w-[700px] mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="text-green mt-1" />
                  <div>
                    <p className="text-[15px] font-medium text-indigo-400">Getting started</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Premium includes up to 20 hours of expert implementation at no extra cost. Our team helps design and build your first workflows.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="text-green mt-1" />
                  <div>
                    <p className="text-[15px] font-medium text-indigo-400">Time to value</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Most teams have their first automated workflow live within 2 weeks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="text-green mt-1" />
                  <div>
                    <p className="text-[15px] font-medium text-indigo-400">What you still do</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      You review and approve workflows, handle exceptions, and make strategic decisions. Automation handles the repetitive execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          8. SHARE (print + clipboard)
      ═══════════════════════════════════════════════════ */}
      <section className="pb-12 print:hidden">
        <div className="max-w-[960px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[15px] font-medium text-indigo-400 mb-4">Share this business case</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-100 text-sm font-medium text-indigo-400 hover:border-indigo-200 transition-colors cursor-pointer"
            >
              <PrinterIcon />
              Print or save as PDF
            </button>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-100 text-sm font-medium text-indigo-400 hover:border-indigo-200 transition-colors cursor-pointer"
            >
              <ClipboardIcon />
              {copied ? "Copied!" : "Copy summary to clipboard"}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. CTA
      ═══════════════════════════════════════════════════ */}
      <section className="bg-indigo-5 py-20 print:hidden">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[32px] leading-[1.1] tracking-[-0.02em] text-indigo-400 mb-6">
            Ready to get started?
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

      {/* ═══════════════════════════════════════════════════
          PRINT STYLES
      ═══════════════════════════════════════════════════ */}
      <style>{`
        @media print {
          nav, footer, header { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          section { break-inside: avoid; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORTED WRAPPER (Suspense for useSearchParams)
   ═══════════════════════════════════════════════════════════ */

export function PricingBusinessCase() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-500">Loading...</div>}>
      <PricingBusinessCaseInner />
    </Suspense>
  );
}
