"use client";

import { useState, useId } from "react";
import {
  calculateTripBudget,
  SUPPORTED_CURRENCIES,
  STYLE_MULTIPLIERS,
  TravelStyle,
} from "@/lib/budgetData";
import { destinations } from "@/data/destinations";
import { showToast } from "@/components/ui/Toast";

interface TripBudgetCalculatorProps {
  initialDestinationSlug?: string;
  initialDays?: number;
  initialTravelers?: number;
  compact?: boolean;
}

export default function TripBudgetCalculator({
  initialDestinationSlug = "norway",
  initialDays = 5,
  initialTravelers = 2,
  compact = false,
}: TripBudgetCalculatorProps) {
  const [destinationSlug, setDestinationSlug] = useState(initialDestinationSlug);
  const [days, setDays] = useState(initialDays);
  const [travelers, setTravelers] = useState(initialTravelers);
  const [style, setStyle] = useState<TravelStyle>("comfort");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [copied, setCopied] = useState(false);

  const durationInputId = useId();
  const travelersInputId = useId();

  const selectedDest = destinations.find((d) => d.slug === destinationSlug) || destinations[0];

  const budget = calculateTripBudget({
    destinationSlug: selectedDest.slug,
    days,
    travelers,
    style,
    currencyCode,
  });

  const handleCopySummary = async () => {
    try {
      const summaryText = `✈️ TRIPLY Budget Estimate for ${selectedDest.name}, ${selectedDest.country}
Duration: ${days} days • Travelers: ${travelers} • Style: ${STYLE_MULTIPLIERS[style].label}
Total Estimated Cost: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()} ${budget.currency.code} (~${budget.currency.symbol}${budget.perPersonDailyConverted.toLocaleString()}/person/day)
Breakdown:
${budget.breakdown
  .map(
    (b) => `• ${b.category}: ${budget.currency.symbol}${b.amount.toLocaleString()} (${b.percent}%)`
  )
  .join("\n")}
Calculated with Triply Travel Planner`;

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      showToast({
        title: "Budget breakdown copied!",
        description: `Full estimate for ${selectedDest.name} copied to your clipboard.`,
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const categoryPillColors: Record<number, string> = {
    0: "from-blue-500/80 to-indigo-500/80",
    1: "from-amber-500/80 to-orange-500/80",
    2: "from-emerald-500/80 to-teal-500/80",
    3: "from-purple-500/80 to-pink-500/80",
    4: "from-neutral-500/80 to-zinc-400/80",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/80 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-500 ${
        compact ? "p-5 sm:p-7" : ""
      }`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />

      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
              ✦
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Trip Cost Estimator & Currency Converter
            </p>
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-light tracking-tight text-white">
            Estimate your journey in{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent font-normal">
              {selectedDest.name}
            </span>
          </h3>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Currency:</span>
          <div className="relative inline-flex rounded-full border border-white/15 bg-white/[0.05] p-1 backdrop-blur-md">
            {SUPPORTED_CURRENCIES.slice(0, 5).map((curr) => {
              const active = curr.code === currencyCode;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrencyCode(curr.code)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                    active
                      ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {curr.symbol} {curr.code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: Interactive Controls */}
        <div className="space-y-6">
          {/* Destination Selector (if multi-dest or user wants to switch) */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Destination
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {destinations.map((dest) => {
                const isSelected = dest.slug === selectedDest.slug;
                return (
                  <button
                    key={dest.slug}
                    type="button"
                    onClick={() => setDestinationSlug(dest.slug)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 active:scale-95 ${
                      isSelected
                        ? "border-emerald-400/80 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] font-medium"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {dest.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Style Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              Travel Style & Comfort
            </label>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
              {(Object.keys(STYLE_MULTIPLIERS) as TravelStyle[]).map((key) => {
                const item = STYLE_MULTIPLIERS[key];
                const active = style === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStyle(key)}
                    className={`relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                      active
                        ? "border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/30"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-mono">
                          {item.tag}
                        </span>
                        {active && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">{item.label.split("/")[0]}</p>
                    </div>
                    <p className="mt-2 text-[10px] text-white/50 leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Slider & Quick Presets */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label htmlFor={durationInputId} className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                Duration (Days)
              </label>
              <span className="text-base font-medium text-white font-mono">
                {days} {days === 1 ? "Day" : "Days"}
              </span>
            </div>

            <input
              id={durationInputId}
              type="range"
              min={1}
              max={21}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-white/15"
            />

            <div className="mt-3 flex items-center justify-between gap-2">
              {[
                { label: "Weekend (3d)", count: 3 },
                { label: "Classic (7d)", count: 7 },
                { label: "Grand (14d)", count: 14 },
              ].map((preset) => (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => setDays(preset.count)}
                  className={`rounded-full px-2.5 py-1 text-[11px] transition-all duration-300 ${
                    days === preset.count
                      ? "border border-white/30 bg-white/15 text-white"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Travelers Counter */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor={travelersInputId} className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Travelers
                </label>
                <p className="text-xs text-white/50 mt-0.5">
                  {travelers === 1
                    ? "Solo Explorer"
                    : travelers === 2
                    ? "Couple / 2 Travelers"
                    : `${travelers} Travelers (Shared Stays)`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.max(prev - 1, 1))}
                  disabled={travelers <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:bg-white/10 disabled:opacity-30 active:scale-95"
                >
                  −
                </button>
                <input
                  id={travelersInputId}
                  type="number"
                  aria-label="Number of travelers"
                  value={travelers}
                  onChange={(e) =>
                    setTravelers(Math.max(1, Math.min(12, Number(e.target.value) || 1)))
                  }
                  className="w-10 text-center font-mono text-base font-semibold text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.min(prev + 1, 12))}
                  disabled={travelers >= 12}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:bg-white/10 disabled:opacity-30 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Dynamic Cost Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-300">
                Live Calculation
              </span>
              <span className="text-[11px] text-white/40">
                1 USD ≈ {budget.currency.rateToUSD} {budget.currency.code}
              </span>
            </div>

            {/* Total Big Display */}
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Total Estimated Cost
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-light tracking-tight text-white">
                  {budget.currency.symbol}
                  {budget.totalConverted.toLocaleString()}
                </span>
                <span className="text-sm font-mono text-white/50">
                  {budget.currency.code}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/50">
                Approximately{" "}
                <span className="text-white/80 font-medium font-mono">
                  {budget.currency.symbol}
                  {budget.perPersonDailyConverted.toLocaleString()}
                </span>{" "}
                per traveler / day
              </p>
            </div>

            {/* Dynamic Visual Ratio Bar */}
            <div className="mt-6">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/10 gap-0.5">
                {budget.breakdown.map((item, idx) => (
                  <div
                    key={item.category}
                    style={{ width: `${item.percent}%` }}
                    className={`h-full bg-gradient-to-r ${categoryPillColors[idx]} transition-all duration-500`}
                    title={`${item.category}: ${item.percent}%`}
                  />
                ))}
              </div>
            </div>

            {/* Itemized Category Breakdown */}
            <div className="mt-6 space-y-3">
              {budget.breakdown.map((item) => (
                <div
                  key={item.category}
                  className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-white/90">{item.category}</p>
                      <p className="text-[10px] text-white/40 hidden sm:block">{item.tip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-medium text-white">
                      {budget.currency.symbol}
                      {item.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/40 font-mono">{item.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white px-5 py-3 text-xs font-medium text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-neutral-200 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375-9-9" />
              </svg>
              <span>{copied ? "Copied to Clipboard!" : "Copy Full Breakdown"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
