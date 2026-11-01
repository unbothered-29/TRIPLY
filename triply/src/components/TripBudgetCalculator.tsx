"use client";

import { useState, useId } from "react";
import {
  calculateTripBudget,
  getTierComparison,
  SUPPORTED_CURRENCIES,
  STYLE_MULTIPLIERS,
  SEASON_CONFIGS,
  PARTY_CONFIGS,
  FLIGHT_ORIGINS,
  FLIGHT_CLASS_MULTIPLIERS,
  TravelStyle,
  TravelSeason,
  PartyType,
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

type TabType = "breakdown" | "daybyday" | "savings" | "tiers";

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
  const [season, setSeason] = useState<TravelSeason>("shoulder");
  const [partyType, setPartyType] = useState<PartyType>(
    initialTravelers === 1 ? "solo" : "couple"
  );
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [includeFlights, setIncludeFlights] = useState(false);
  const [flightOrigin, setFlightOrigin] = useState<FlightOriginRegion>("north-america");
  const [flightClass, setFlightClass] = useState<FlightClass>("economy");
  const [activeTab, setActiveTab] = useState<TabType>("breakdown");

  // Advanced customization & target budget
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetBudgetInput, setTargetBudgetInput] = useState<string>("");
  const [adjLodging, setAdjLodging] = useState(1.0);
  const [adjDining, setAdjDining] = useState(1.0);
  const [adjActivities, setAdjActivities] = useState(1.0);
  const [adjTransport, setAdjTransport] = useState(1.0);

  const [copied, setCopied] = useState(false);

  const durationInputId = useId();
  const travelersInputId = useId();
  const targetBudgetId = useId();

  const selectedDest =
    destinations.find((d) => d.slug === destinationSlug) || destinations[0];

  const parsedTargetBudget = parseFloat(targetBudgetInput);
  const validTargetBudget =
    !isNaN(parsedTargetBudget) && parsedTargetBudget > 0
      ? parsedTargetBudget
      : undefined;

  const budget = calculateTripBudget({
    destinationSlug: selectedDest.slug,
    days,
    travelers,
    style,
    currencyCode,
    season,
    partyType,
    includeFlights,
    flightOrigin,
    flightClass,
    customCategoryAdjustments: {
      lodging: adjLodging,
      dining: adjDining,
      activities: adjActivities,
      transport: adjTransport,
    },
    targetBudget: validTargetBudget,
  });

  const tierComparisons = getTierComparison({
    destinationSlug: selectedDest.slug,
    days,
    travelers,
    currencyCode,
    season,
    partyType,
    includeFlights,
    flightOrigin,
  });

  // Handle party type change and adjust travelers appropriately
  const handlePartyTypeChange = (newParty: PartyType) => {
    setPartyType(newParty);
    if (newParty === "solo" && travelers > 1) {
      setTravelers(1);
    } else if (newParty === "couple" && travelers !== 2) {
      setTravelers(2);
    } else if (newParty === "family" && travelers < 3) {
      setTravelers(4);
    } else if (newParty === "group" && travelers < 4) {
      setTravelers(4);
    }
  };

  const handleCopySummary = async () => {
    try {
      const flightInfo = includeFlights
        ? `\nFlights: Included (${FLIGHT_CLASS_MULTIPLIERS[flightClass].label} from ${FLIGHT_ORIGINS.find((o) => o.id === flightOrigin)?.label})`
        : "";

      const summaryText = `✈️ TRIPLY Budget Estimate for ${selectedDest.name}, ${selectedDest.country}
════════════════════════════════════════
Duration: ${days} days (${days} nights)
Travelers: ${travelers} (${PARTY_CONFIGS[partyType].label} • ${budget.roomCount} room${budget.roomCount > 1 ? "s" : ""})
Season: ${SEASON_CONFIGS[season].label} (${SEASON_CONFIGS[season].tag})
Travel Style: ${STYLE_MULTIPLIERS[style].label}${flightInfo}

💰 TOTAL ESTIMATED COST:
• Selected Currency: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()} ${budget.currency.code}
• Per Person / Day: ~${budget.currency.symbol}${budget.perPersonDailyConverted.toLocaleString()} / person / day
• Local Currency (${budget.localCurrency.code}): ~${budget.localCurrency.symbol}${budget.localCurrency.totalConverted.toLocaleString()} ${budget.localCurrency.code}

📊 ITEM-BY-ITEM BREAKDOWN:
${budget.breakdown
  .map(
    (b) =>
      `• ${b.category}: ${budget.currency.symbol}${b.amount.toLocaleString()} (${b.percent}%) — ${b.tip}`
  )
  .join("\n")}

💡 TOP SAVING HACK FOR ${selectedDest.name.toUpperCase()}:
${budget.savingsHacks[0]?.title}: ${budget.savingsHacks[0]?.desc} (${budget.savingsHacks[0]?.potentialSavings})

Generated with TRIPLY (https://triply-travel.vercel.app)`;

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      showToast({
        title: "Budget estimate copied!",
        description: `Comprehensive breakdown for ${selectedDest.name} copied to clipboard.`,
        type: "success",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownloadSummary = () => {
    const flightInfo = includeFlights
      ? `\nFlights: Included (${FLIGHT_CLASS_MULTIPLIERS[flightClass].label} from ${FLIGHT_ORIGINS.find((o) => o.id === flightOrigin)?.label})`
      : "";

    const textContent = `TRIPLY JOURNEY BUDGET REPORT
Generated on: ${new Date().toLocaleDateString()}
Destination: ${selectedDest.name}, ${selectedDest.country}
Duration: ${days} days / ${days} nights
Travelers: ${travelers} (${PARTY_CONFIGS[partyType].label})
Accommodations: ${budget.roomCount} room(s)
Travel Season: ${SEASON_CONFIGS[season].label}
Travel Tier: ${STYLE_MULTIPLIERS[style].label}${flightInfo}

ESTIMATED BUDGET:
Total in ${budget.currency.code}: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()}
Daily Cost per Traveler: ${budget.currency.symbol}${budget.perPersonDailyConverted.toLocaleString()}/person/day
Local Currency Equivalent: ${budget.localCurrency.symbol}${budget.localCurrency.totalConverted.toLocaleString()} ${budget.localCurrency.code}

CATEGORY BREAKDOWN:
${budget.breakdown.map((b) => `- ${b.category}: ${budget.currency.symbol}${b.amount.toLocaleString()} (${b.percent}%) | ${b.tip}`).join("\n")}

DAY-BY-DAY ESTIMATED SCHEDULE:
${budget.dayByDayEstimate.map((d) => `Day ${d.day}: ${budget.currency.symbol}${d.dailyTotal.toLocaleString()} (${d.note})`).join("\n")}

DESTINATION SAVINGS HACKS:
${budget.savingsHacks.map((h, i) => `${i + 1}. ${h.title}: ${h.desc} [${h.potentialSavings}]`).join("\n\n")}
`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TRIPLY_Budget_${selectedDest.slug}_${days}days.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      title: "Budget Report Downloaded",
      description: `Saved TRIPLY_Budget_${selectedDest.slug}_${days}days.txt to your device.`,
      type: "success",
    });
  };

  const handleSaveToMyTrips = () => {
    saveTripItem(selectedDest.slug, {
      plannedDays: days,
      travelers,
      style,
      notes: `Estimated: ${budget.currency.symbol}${budget.totalConverted.toLocaleString()} ${budget.currency.code} (~${budget.localCurrency.symbol}${budget.localCurrency.totalConverted.toLocaleString()} ${budget.localCurrency.code}) • ${SEASON_CONFIGS[season].tag} • ${PARTY_CONFIGS[partyType].label}`,
    });
    showToast({
      title: "Saved to My Trips!",
      description: `${selectedDest.name} added to your bucket list with your customized budget.`,
      type: "success",
    });
  };

  const handleResetAdjustments = () => {
    setAdjLodging(1.0);
    setAdjDining(1.0);
    setAdjActivities(1.0);
    setAdjTransport(1.0);
    setTargetBudgetInput("");
    showToast({
      title: "Fine-tuning Reset",
      description: "Category multipliers and target budget set back to default baseline.",
      type: "info",
    });
  };

  const categoryPillColors: Record<number, string> = {
    0: "from-blue-500 to-indigo-500",
    1: "from-amber-500 to-orange-500",
    2: "from-emerald-500 to-teal-500",
    3: "from-purple-500 to-pink-500",
    4: "from-sky-500 to-cyan-500",
    5: "from-neutral-400 to-zinc-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/85 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-500 ${
        compact ? "p-4 sm:p-6" : ""
      }`}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/[0.03] blur-3xl" />

      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs text-emerald-400 border border-emerald-400/20">
              ✦
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Trip Cost Estimator & Currency Engine v2.0
            </p>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] text-white/50">
              Real-Time Dynamic Pricing
            </span>
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-light tracking-tight text-white">
            Estimate your journey in{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent font-normal">
              {selectedDest.name}
            </span>
          </h3>
        </div>

        {/* Currency Switcher & Local Currency Chip */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
            <span className="text-white/40">Local:</span>
            <span className="font-medium text-white">
              {budget.localCurrency.code} ({budget.localCurrency.symbol})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/40">Currency:</span>
            <div className="relative">
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="appearance-none rounded-xl border border-white/15 bg-white/[0.06] py-1.5 pl-3 pr-8 text-xs font-semibold text-white outline-none hover:border-white/30 focus:border-emerald-400"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option
                    key={curr.code}
                    value={curr.code}
                    className="bg-neutral-900 text-white"
                  >
                    {curr.symbol} {curr.code} – {curr.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/50">
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Results Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* ==================================================== */}
        {/* LEFT COLUMN: INTERACTIVE CONTROLS                    */}
        {/* ==================================================== */}
        <div className="space-y-6">
          {/* 01 / Destination Selector */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                01 / Destination
              </label>
              <span className="text-xs text-emerald-400 font-light">
                {selectedDest.country} • {selectedDest.category}
              </span>
            </div>
            <div className="relative mt-2">
              <select
                value={destinationSlug}
                onChange={(e) => setDestinationSlug(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 pr-10 text-sm font-medium text-white outline-none transition-all duration-300 hover:border-white/25 focus:border-emerald-400/60 focus:bg-white/[0.08]"
              >
                {destinations.map((d) => (
                  <option
                    key={d.slug}
                    value={d.slug}
                    className="bg-neutral-900 text-white"
                  >
                    {d.name}, {d.country} ({d.category})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40">
                ▼
              </span>
            </div>
          </div>

          {/* 02 / Travel Season (Seasonality Engine) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                02 / Travel Season & Timing
              </label>
              <span className="text-[11px] text-white/40">
                Best Value:{" "}
                <span className="text-emerald-300 font-medium">
                  {budget.bestValueMonths}
                </span>
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {(["shoulder", "peak", "off-peak"] as TravelSeason[]).map((s) => {
                const active = season === s;
                const conf = SEASON_CONFIGS[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason(s)}
                    className={`rounded-2xl border p-3 text-left transition-all duration-300 ${
                      active
                        ? "border-emerald-400/80 bg-emerald-500/[0.12] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      {conf.tag}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-white">
                      {conf.label}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-white/50 leading-relaxed font-light">
              {SEASON_CONFIGS[season].desc} Peak season: {budget.peakMonths}.
            </p>
          </div>

          {/* 03 / Trip Composition (Days & Travelers & Party Type) */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Days Stepper with Quick Presets */}
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

                {/* Quick Presets */}
                <div className="mt-3 flex items-center justify-between gap-1 border-t border-white/5 pt-2">
                  {[3, 7, 10, 14].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDays(preset)}
                      className={`rounded-lg px-2 py-0.5 text-[10px] transition ${
                        days === preset
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {preset}d
                    </button>
                  ))}
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
                  <span className="text-xs text-white/50">
                    {budget.roomCount} room{budget.roomCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, travelers - 1);
                      setTravelers(next);
                      if (next === 1) setPartyType("solo");
                      else if (next === 2) setPartyType("couple");
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                    aria-label="Decrease travelers"
                  >
                    −
                  </button>
                  <span className="text-xl font-light text-white">
                    {travelers}{" "}
                    <span className="text-xs text-white/40">
                      {travelers === 1 ? "guest" : "guests"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(10, travelers + 1);
                      setTravelers(next);
                      if (next > 2 && partyType === "solo") setPartyType("couple");
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-sm text-white transition-all hover:bg-white/20 active:scale-95"
                    aria-label="Increase travelers"
                  >
                    +
                  </button>
                </div>

                {/* Party Type Pills */}
                <div className="mt-3 flex items-center justify-between gap-1 border-t border-white/5 pt-2">
                  {(["solo", "couple", "family", "group"] as PartyType[]).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => handlePartyTypeChange(pt)}
                      className={`rounded-lg px-1.5 py-0.5 text-[10px] transition ${
                        partyType === pt
                          ? "bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30"
                          : "text-white/40 hover:text-white"
                      }`}
                      title={PARTY_CONFIGS[pt].desc}
                    >
                      {PARTY_CONFIGS[pt].icon} {PARTY_CONFIGS[pt].label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 04 / Travel Spending Tier */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                04 / Spending Tier
              </label>
              <button
                type="button"
                onClick={() => setActiveTab("tiers")}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Compare All 3 Tiers ↗
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
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

            <p className="mt-2.5 text-xs text-white/50 leading-relaxed font-light">
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

          {/* 05 / Flights Add-on Toggle */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">✈️</span>
                <div>
                  <p className="text-xs font-medium text-white">Include Round-Trip Flights</p>
                  <p className="text-[11px] text-white/40">
                    Estimate international airfare based on your departure region
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
                aria-label="Toggle flight estimation"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    includeFlights ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {includeFlights && (
              <div className="mt-4 grid gap-3 pt-3 border-t border-white/10 sm:grid-cols-2 animate-fade-in">
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
                    Cabin Class
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

          {/* 06 / Advanced Tuning & Target Budget (Collapsible) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">🎛️</span>
                <span className="text-xs font-medium text-white">
                  Fine-Tune Categories & Target Budget
                </span>
                {(adjLodging !== 1 || adjDining !== 1 || validTargetBudget) && (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] text-emerald-300">
                    Customized
                  </span>
                )}
              </div>
              <span className="text-xs text-white/40">
                {showAdvanced ? "Hide ▴" : "Customize ▾"}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 pt-4 border-t border-white/10 animate-fade-in">
                {/* Target Budget Input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={targetBudgetId}
                      className="text-[10px] uppercase tracking-wider text-white/40"
                    >
                      Target Budget Goal ({budget.currency.code})
                    </label>
                    <span className="text-[10px] text-white/40">Optional target comparison</span>
                  </div>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      {budget.currency.symbol}
                    </span>
                    <input
                      id={targetBudgetId}
                      type="number"
                      placeholder="e.g. 2500"
                      value={targetBudgetInput}
                      onChange={(e) => setTargetBudgetInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Category Sliders */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Category Spending Adjusters
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>🏨 Lodging Multiplier</span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(adjLodging * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={adjLodging}
                      onChange={(e) => setAdjLodging(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400"
                      aria-label="Lodging multiplier"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>🍽️ Dining & Food Multiplier</span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(adjDining * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={adjDining}
                      onChange={(e) => setAdjDining(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400"
                      aria-label="Dining multiplier"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>🎟️ Activities Multiplier</span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(adjActivities * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={adjActivities}
                      onChange={(e) => setAdjActivities(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400"
                      aria-label="Activities multiplier"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>🚆 Local Transport Multiplier</span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(adjTransport * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={adjTransport}
                      onChange={(e) => setAdjTransport(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400"
                      aria-label="Transport multiplier"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetAdjustments}
                    className="text-[11px] text-white/40 hover:text-white transition"
                  >
                    Reset Adjustments ↺
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: REAL-TIME RESULTS & MULTI-TAB DASHBOARD*/}
        {/* ==================================================== */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <div>
            {/* Top Stat Card: Total Display */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Total Estimated Cost
              </span>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                  {STYLE_MULTIPLIERS[style].tag}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                  {SEASON_CONFIGS[season].tag}
                </span>
              </div>
            </div>

            {/* Total Cost in Selected Currency */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-light tracking-tight text-white">
                {budget.currency.symbol}
                {budget.totalConverted.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-white/50">{budget.currency.code}</span>
            </div>

            {/* Dual Currency Sub-Display (Destination Local Currency) */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
              <div className="flex items-center gap-1 text-emerald-300/90 font-medium">
                <span>≈</span>
                <span>
                  {budget.localCurrency.symbol}
                  {budget.localCurrency.totalConverted.toLocaleString()}{" "}
                  {budget.localCurrency.code}
                </span>
                <span className="text-[10px] text-white/40">
                  (in {selectedDest.name})
                </span>
              </div>
              <span className="text-white/20">•</span>
              <div>
                ≈ {budget.currency.symbol}
                {budget.perPersonDailyConverted.toLocaleString()}{" "}
                <span className="text-white/40">/ person / day</span>
              </div>
            </div>

            {/* Target Budget Health Gauge (if user specified target) */}
            {budget.budgetHealth && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Target: {budget.currency.symbol}{budget.budgetHealth.targetBudget.toLocaleString()}</span>
                  <span
                    className={`font-medium ${
                      budget.budgetHealth.status === "under"
                        ? "text-emerald-400"
                        : budget.budgetHealth.status === "on-track"
                        ? "text-sky-400"
                        : "text-amber-400"
                    }`}
                  >
                    {budget.budgetHealth.status === "under"
                      ? `🎉 Under by ${budget.currency.symbol}${Math.abs(budget.budgetHealth.difference).toLocaleString()}`
                      : budget.budgetHealth.status === "on-track"
                      ? "🎯 Right on Track"
                      : `⚠️ Over by ${budget.currency.symbol}${Math.abs(budget.budgetHealth.difference).toLocaleString()}`}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{
                      width: `${Math.min(budget.budgetHealth.percentage, 100)}%`,
                    }}
                    className={`h-full transition-all duration-500 ${
                      budget.budgetHealth.status === "under"
                        ? "bg-emerald-400"
                        : budget.budgetHealth.status === "on-track"
                        ? "bg-sky-400"
                        : "bg-amber-400"
                    }`}
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/50 leading-relaxed">
                  {budget.budgetHealth.tip}
                </p>
              </div>
            )}

            {/* Multi-Segment Color Bar */}
            <div className="mt-5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 flex">
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

            {/* TAB CONTROLS */}
            <div className="mt-6 flex flex-wrap items-center gap-1 border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("breakdown")}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === "breakdown"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                📊 Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("daybyday")}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === "daybyday"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                📅 Daily Schedule
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("savings")}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === "savings"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                💡 Saving Hacks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tiers")}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === "tiers"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                ⚖️ 3 Tiers
              </button>
            </div>

            {/* TAB 1: ITEM-BY-ITEM BREAKDOWN */}
            {activeTab === "breakdown" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {budget.breakdown.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-sm">
                        {item.icon}
                      </span>
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
            )}

            {/* TAB 2: DAY-BY-DAY COST SCHEDULE */}
            {activeTab === "daybyday" && (
              <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1 animate-fade-in custom-scrollbar">
                <p className="text-[11px] text-white/50 mb-2">
                  Estimated daily expense trajectory for {travelers} guest{travelers > 1 ? "s" : ""} across {days} days:
                </p>
                {budget.dayByDayEstimate.map((d) => (
                  <div
                    key={d.day}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-400">
                        {d.title}
                      </span>
                      <span className="font-mono font-medium text-white">
                        {budget.currency.symbol}
                        {d.dailyTotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/50">{d.note}</p>
                    <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-white/40 border-t border-white/5 pt-1.5">
                      <span>🏨 {budget.currency.symbol}{d.lodging}</span>
                      <span>🍽️ {budget.currency.symbol}{d.dining}</span>
                      <span>🎟️ {budget.currency.symbol}{d.activities}</span>
                      <span>🚆 {budget.currency.symbol}{d.transport}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: INSIDER MONEY-SAVING HACKS */}
            {activeTab === "savings" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <p className="text-[11px] text-white/50">
                  Insider local travel hacks tailored for {selectedDest.name}:
                </p>
                {budget.savingsHacks.map((hack) => (
                  <div
                    key={hack.title}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs transition hover:border-emerald-400/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{hack.icon}</span>
                        <h4 className="font-medium text-white">{hack.title}</h4>
                      </div>
                      <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 border border-emerald-400/20">
                        {hack.potentialSavings}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-white/60 leading-relaxed font-light">
                      {hack.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: 3-TIER COMPARISON */}
            {activeTab === "tiers" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <p className="text-[11px] text-white/50">
                  Side-by-side tier comparison for {selectedDest.name} ({days} days, {travelers} traveler{travelers > 1 ? "s" : ""}):
                </p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {tierComparisons.map((tc) => (
                    <div
                      key={tc.style}
                      className={`rounded-xl border p-3 text-xs transition-all ${
                        tc.style === style
                          ? "border-emerald-400 bg-emerald-500/[0.08]"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-white/40">{tc.info.tag}</span>
                        {tc.style === style && (
                          <span className="text-[9px] text-emerald-400 font-semibold">Active</span>
                        )}
                      </div>
                      <p className="mt-1 font-medium text-white">{tc.info.label.split(" / ")[0]}</p>
                      <p className="mt-2 text-base font-light text-white">
                        {tc.result.currency.symbol}
                        {tc.result.totalConverted.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        ~{tc.result.currency.symbol}
                        {tc.result.perPersonDailyConverted}/day
                      </p>

                      <button
                        type="button"
                        onClick={() => setStyle(tc.style)}
                        className={`mt-3 w-full rounded-lg py-1.5 text-[10px] font-medium transition ${
                          tc.style === style
                            ? "bg-emerald-400 text-black font-semibold"
                            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        {tc.style === style ? "✓ Current" : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 grid grid-cols-3 gap-2 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleSaveToMyTrips}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/[0.08] px-3 py-3 text-xs font-medium text-white transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
              title="Save to My Bucket List"
            >
              <span>📌</span>
              <span className="truncate">Save Trip</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-black transition-all duration-300 hover:bg-white/90 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
              title="Copy formatted summary to clipboard"
            >
              <span>{copied ? "✓ Copied" : "📋 Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSummary}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/[0.04] px-3 py-3 text-xs font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white active:scale-95"
              title="Download text report"
            >
              <span>📥</span>
              <span className="truncate">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
