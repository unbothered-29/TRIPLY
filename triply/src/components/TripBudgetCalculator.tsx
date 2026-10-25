"use client";

import { useState, useId } from "react";
import {
  calculateTripBudget,
  getTierComparison,
  SUPPORTED_CURRENCIES,
  STYLE_MULTIPLIERS,
  FLIGHT_ORIGINS,
  FLIGHT_CLASS_MULTIPLIERS,
  TravelStyle,
  FlightOriginRegion,
  FlightClass,
} from "@/lib/budgetData";
import { destinations } from "@/data/destinations";
import { showToast } from "@/components/ui/Toast";
import { saveTripItem } from "@/lib/savedStorage";

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
  const [includeFlights, setIncludeFlights] = useState(false);
  const [flightOrigin, setFlightOrigin] = useState<FlightOriginRegion>("north-america");
  const [flightClass, setFlightClass] = useState<FlightClass>("economy");
  const [showTierComparison, setShowTierComparison] = useState(false);
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
    includeFlights,
    flightOrigin,
    flightClass,
  });

  const tierComparisons = showTierComparison
    ? getTierComparison({
        destinationSlug: selectedDest.slug,
        days,
        travelers,
        currencyCode,
        includeFlights,
        flightOrigin,
      })
    : [];

  const handleCopySummary = async () => {
    try {
      const flightInfo = includeFlights
        ? `\nFlights: Included (${FLIGHT_CLASS_MULTIPLIERS[flightClass].label} from ${FLIGHT_ORIGINS.find((o) => o.id === flightOrigin)?.label})`
        : "";

      const summaryText = `✈️ TRIPLY Budget Estimate for ${selectedDest.name}, ${selectedDest.country}
Duration: ${days} days • Travelers: ${travelers} • Style: ${STYLE_MULTIPLIERS[style].label}${flightInfo}
Total Estimated Cost: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()} ${budget.currency.code} (~${budget.currency.symbol}${budget.perPersonDailyConverted.toLocaleString()}/person/day)

Breakdown:
${budget.breakdown
  .map(
    (b) => `• ${b.category}: ${budget.currency.symbol}${b.amount.toLocaleString()} (${b.percent}%)`
  )
  .join("\n")}

Plan your dream journey on TRIPLY`;

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      showToast({
        title: "Budget estimate copied!",
        description: `Full breakdown for ${selectedDest.name} copied to clipboard.`,
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSaveToMyTrips = () => {
    saveTripItem(selectedDest.slug, {
      plannedDays: days,
      travelers,
      style,
      notes: `Estimated budget: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()} ${budget.currency.code} (${STYLE_MULTIPLIERS[style].tag})`,
    });
    showToast({
      title: "Saved to My Trips!",
      description: `${selectedDest.name} added to your bucket list with your budget preferences.`,
      type: "success",
    });
  };

  const categoryPillColors: Record<number, string> = {
    0: "from-blue-500/80 to-indigo-500/80",
    1: "from-amber-500/80 to-orange-500/80",
    2: "from-emerald-500/80 to-teal-500/80",
    3: "from-purple-500/80 to-pink-500/80",
    4: "from-sky-500/80 to-cyan-500/80",
    5: "from-neutral-500/80 to-zinc-400/80",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/80 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-500 ${
        compact ? "p-5 sm:p-7" : ""
      }`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-3xl" />

      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
              ✦
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Trip Cost Estimator & Currency Engine
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40">Currency:</span>
          <div className="flex flex-wrap gap-1 rounded-2xl border border-white/15 bg-white/[0.04] p-1 backdrop-blur-md">
            {SUPPORTED_CURRENCIES.map((curr) => {
              const active = curr.code === currencyCode;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrencyCode(curr.code)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ${
                    active
                      ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "text-white/60 hover:text-white"
                  }`}
                  title={`${curr.name} (${curr.symbol})`}
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
          {/* Destination Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
              01 / Destination
            </label>
            <div className="relative mt-2">
              <select
                value={destinationSlug}
                onChange={(e) => setDestinationSlug(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 pr-10 text-sm font-medium text-white outline-none transition-all duration-300 hover:border-white/25 focus:border-white/50 focus:bg-white/[0.08]"
              >
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug} className="bg-neutral-900 text-white">
                    {d.name}, {d.country} ({d.category})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40">
                ▼
              </span>
            </div>
          </div>

          {/* Steppers: Duration & Travelers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Days Stepper */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={durationInputId}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  Duration
                </label>
                <span className="text-xs text-white/50">{days} nights</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                  aria-label="Decrease duration"
                >
                  −
                </button>
                <span className="text-xl font-light text-white">
                  {days} <span className="text-xs text-white/40">days</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDays((d) => Math.min(30, d + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                  aria-label="Increase duration"
                >
                  +
                </button>
              </div>
            </div>

            {/* Travelers Stepper */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={travelersInputId}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  Travelers
                </label>
                <span className="text-xs text-white/50">{Math.ceil(travelers / 2)} room(s)</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                  aria-label="Decrease travelers"
                >
                  −
                </button>
                <span className="text-xl font-light text-white">
                  {travelers} <span className="text-xs text-white/40">guests</span>
                </span>
                <button
                  type="button"
                  onClick={() => setTravelers((t) => Math.min(10, t + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                  aria-label="Increase travelers"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Travel Style Tiers */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                02 / Spending Tier
              </label>
              <button
                type="button"
                onClick={() => setShowTierComparison((prev) => !prev)}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {showTierComparison ? "Hide Tier Comparison ▲" : "Compare All 3 Tiers ▼"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {(["budget", "comfort", "luxury"] as TravelStyle[]).map((s) => {
                const active = style === s;
                const info = STYLE_MULTIPLIERS[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`relative rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                      active
                        ? "border-emerald-400/80 bg-emerald-500/[0.12] shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                        {info.tag}
                      </span>
                      {active && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-white">
                      {s === "budget" ? "Backpacker" : s === "comfort" ? "Comfort" : "Luxury"}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-2.5 text-xs text-white/50 leading-relaxed">
              {STYLE_MULTIPLIERS[style].desc}
            </p>

            {/* Highlights bullet tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STYLE_MULTIPLIERS[style].highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/70"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>

          {/* Flights Add-on Toggle */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">✈️</span>
                <div>
                  <p className="text-xs font-medium text-white">Include Round-Trip Flights</p>
                  <p className="text-[11px] text-white/40">
                    Estimate international airfare based on your origin region
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIncludeFlights((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeFlights ? "bg-emerald-500" : "bg-white/20"
                }`}
                role="switch"
                aria-checked={includeFlights}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    includeFlights ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {includeFlights && (
              <div className="mt-4 grid gap-3 pt-3 border-t border-white/10 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/40">
                    Departing From
                  </label>
                  <select
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value as FlightOriginRegion)}
                    className="mt-1 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white outline-none hover:border-white/25"
                  >
                    {FLIGHT_ORIGINS.map((o) => (
                      <option key={o.id} value={o.id} className="bg-neutral-900 text-white">
                        {o.flag} {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/40">
                    Flight Class
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    {(["economy", "premium", "business"] as FlightClass[]).map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setFlightClass(cls)}
                        className={`rounded-lg py-1.5 text-[10px] font-medium transition-all ${
                          flightClass === cls
                            ? "bg-white text-black font-semibold"
                            : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cls === "economy" ? "Econ" : cls === "premium" ? "Prem" : "Biz"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-time Budget Result & Itemized Breakdown */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <div>
            {/* Total Display */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-400">
                Total Estimated Cost
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                {STYLE_MULTIPLIERS[style].tag}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-light tracking-tight text-white">
                {budget.currency.symbol}
                {budget.totalConverted.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-white/50">{budget.currency.code}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
              <span>
                ≈ {budget.currency.symbol}
                {budget.perPersonDailyConverted.toLocaleString()}{" "}
                <span className="text-white/35">/ person / day</span>
              </span>
              <span>•</span>
              <span>{travelers} traveler{travelers > 1 ? "s" : ""}</span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="mt-6">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 flex">
                {budget.breakdown.map((item, idx) => (
                  <div
                    key={item.category}
                    style={{ width: `${Math.max(item.percent, 3)}%` }}
                    className={`h-full bg-gradient-to-r ${
                      categoryPillColors[idx] || "from-neutral-400 to-zinc-500"
                    } transition-all duration-500`}
                    title={`${item.category}: ${budget.currency.symbol}${item.amount.toLocaleString()} (${item.percent}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Itemized Categories List */}
            <div className="mt-6 space-y-3.5">
              {budget.breakdown.map((item, idx) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-xs transition-colors hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    <div>
                      <p className="font-medium text-white/90">{item.category}</p>
                      <p className="text-[10px] text-white/40">{item.tip}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-white">
                      {budget.currency.symbol}
                      {item.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/40">{item.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveToMyTrips}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 text-xs font-medium text-white transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
            >
              <span>📌</span>
              <span>Save to My Trips</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-black transition-all duration-300 hover:bg-white/90 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
            >
              <span>{copied ? "✓ Copied" : "📋 Copy Estimate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Tier Comparison Drawer / Modal */}
      {showTierComparison && (
        <div className="mt-8 border-t border-white/10 pt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-light text-white">
              Side-by-Side Tier Comparison for {selectedDest.name} ({days} days, {travelers}{" "}
              traveler{travelers > 1 ? "s" : ""})
            </h4>
            <span className="text-xs text-white/40">In {budget.currency.code}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {tierComparisons.map((tc) => (
              <div
                key={tc.style}
                className={`rounded-2xl border p-5 transition-all ${
                  tc.style === style
                    ? "border-emerald-400 bg-emerald-500/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/50">
                    {tc.info.tag}
                  </span>
                  <span className="text-xs font-semibold text-white">{tc.info.label}</span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-light text-white">
                    {tc.result.currency.symbol}
                    {tc.result.totalConverted.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1">
                    ≈ {tc.result.currency.symbol}
                    {tc.result.perPersonDailyConverted.toLocaleString()} / person / day
                  </p>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                  {tc.info.highlights.map((hl) => (
                    <p key={hl} className="text-[11px] text-white/60">
                      • {hl}
                    </p>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStyle(tc.style)}
                  className={`mt-5 w-full rounded-xl py-2 text-xs font-medium transition-all ${
                    tc.style === style
                      ? "bg-emerald-400 text-black font-semibold"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {tc.style === style ? "✓ Current Selection" : `Select ${tc.info.tag}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
