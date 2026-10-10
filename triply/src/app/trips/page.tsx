"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import {
  getSavedTrips,
  getSavedTripsSnapshot,
  getSavedTripsServerSnapshot,
  subscribeSaved,
  updateTripItem,
  removeSaved,
  saveTripItem,
  clearAllSavedTrips,
  SavedTripItem,
  TripPriority,
} from "@/lib/savedStorage";
import {
  calculateTripBudget,
  SUPPORTED_CURRENCIES,
  STYLE_MULTIPLIERS,
  TravelStyle,
} from "@/lib/budgetData";
import BucketListRouteMap from "@/components/BucketListRouteMap";
import Reveal from "@/components/ui/Reveal";
import { showToast } from "@/components/ui/Toast";

// Curated starter journeys for inspiration
const CURATED_JOURNEYS = [
  {
    title: "Nordic & Alpine Odyssey",
    slugs: ["norway", "switzerland"],
    tagline: "Fjords, Northern lights & pristine mountain peaks",
    icon: "❄️",
  },
  {
    title: "Zen & Mountain Trail",
    slugs: ["mount-fuji", "chiang-mai", "ladakh"],
    tagline: "Sacred temples, Himalayas & vibrant night markets",
    icon: "⛩️",
  },
  {
    title: "Mediterranean Coastal Dream",
    slugs: ["amalfi-coast", "greece", "paris"],
    tagline: "Cliffside villages, Aegean sunsets & Parisian charm",
    icon: "🌊",
  },
  {
    title: "The Iconic World Tour",
    slugs: ["new-york", "paris", "sydney", "cappadocia"],
    tagline: "Skyline views, balloon rides & world-famous harbors",
    icon: "✨",
  },
];

export default function TripsPage() {
  const [mounted, setMounted] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [globalStyle, setGlobalStyle] = useState<TravelStyle>("comfort");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<"all" | TripPriority>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawSavedTrips = useSyncExternalStore(
    subscribeSaved,
    getSavedTripsSnapshot,
    getSavedTripsServerSnapshot
  );

  const savedTrips = mounted ? rawSavedTrips : [];

  const activeCurrency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];

  // Map trips with full destination details
  const populatedTrips = savedTrips
    .map((trip) => {
      const dest = destinations.find((d) => d.slug === trip.slug);
      if (!dest) return null;

      const destStyle = trip.style || globalStyle;
      const days = trip.plannedDays || 5;
      const travelers = trip.travelers || 2;

      const singleBudget = calculateTripBudget({
        destinationSlug: dest.slug,
        days,
        travelers,
        style: destStyle,
        currencyCode: activeCurrency.code,
      });

      return {
        ...trip,
        dest,
        singleBudget,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const filteredTrips =
    filterPriority === "all"
      ? populatedTrips
      : populatedTrips.filter((t) => (t.priority || "dream") === filterPriority);

  // Aggregate stats across all saved trips
  const totalDays = populatedTrips.reduce((acc, t) => acc + (t.plannedDays || 5), 0);
  const aggregateCost = populatedTrips.reduce(
    (acc, t) => acc + t.singleBudget.totalConverted,
    0
  );

  const aggregateLodging = populatedTrips.reduce(
    (acc, t) =>
      acc +
      (t.singleBudget.breakdown.find((b) => b.category.includes("Lodging"))?.amount || 0),
    0
  );

  const aggregateDining = populatedTrips.reduce(
    (acc, t) =>
      acc +
      (t.singleBudget.breakdown.find((b) => b.category.includes("Dining"))?.amount || 0),
    0
  );

  const aggregateActivities = populatedTrips.reduce(
    (acc, t) =>
      acc +
      (t.singleBudget.breakdown.find((b) => b.category.includes("Activities"))?.amount || 0),
    0
  );

  const aggregateTransport = populatedTrips.reduce(
    (acc, t) =>
      acc +
      (t.singleBudget.breakdown.find((b) => b.category.includes("Transport"))?.amount || 0),
    0
  );

  const handlePriorityChange = (slug: string, priority: TripPriority) => {
    updateTripItem(slug, { priority });
    showToast({
      title: "Priority updated",
      description: `Marked as ${priority.toUpperCase()}`,
      type: "info",
    });
  };

  const handleDaysChange = (slug: string, delta: number, currentDays: number) => {
    const newDays = Math.max(1, Math.min(30, currentDays + delta));
    updateTripItem(slug, { plannedDays: newDays });
  };

  const handleTravelersChange = (slug: string, delta: number, currentTravelers: number) => {
    const newCount = Math.max(1, Math.min(10, currentTravelers + delta));
    updateTripItem(slug, { travelers: newCount });
  };

  const handleNotesChange = (slug: string, notes: string) => {
    updateTripItem(slug, { notes });
  };

  const handleTargetDateChange = (slug: string, targetDate: string) => {
    updateTripItem(slug, { targetDate });
  };

  const handleAddCuratedJourney = (slugs: string[], title: string) => {
    slugs.forEach((slug, idx) => {
      saveTripItem(slug, {
        priority: idx === 0 ? "must-visit" : "dream",
        plannedDays: 5,
        travelers: 2,
        notes: `Part of ${title}`,
      });
    });
    showToast({
      title: `${title} Added!`,
      description: `Added ${slugs.length} destinations to your travel hub.`,
      type: "success",
    });
  };

  const handleShareSummary = async () => {
    if (populatedTrips.length === 0) return;
    const text = `🌍 My TRIPLY Bucket List & Travel Hub
Destinations: ${populatedTrips.map((t) => `${t.dest.name} (${t.dest.country})`).join(" ➔ ")}
Total Duration: ${totalDays} Days
Combined Estimated Budget: ${activeCurrency.symbol}${aggregateCost.toLocaleString()} ${activeCurrency.code}

Stops Breakdown:
${populatedTrips
  .map(
    (t, idx) =>
      `${idx + 1}. ${t.dest.name} (${t.dest.country}) - ${t.plannedDays} days [${
        t.priority?.toUpperCase() || "DREAM"
      }] • Est: ${activeCurrency.symbol}${t.singleBudget.totalConverted.toLocaleString()}`
  )
  .join("\n")}

Planned on Triply (Travel Begins with Curiosity)`;

    try {
      await navigator.clipboard.writeText(text);
      showToast({
        title: "Journey Summary Copied!",
        description: "Ready to share with friends or travel partners.",
        type: "success",
      });
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 pb-24 pt-32 sm:px-6 md:px-12 md:pb-32 md:pt-36 lg:px-20 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.035] blur-[150px] animate-aurora" />
        <div className="absolute -right-40 top-1/2 h-[600px] w-[600px] rounded-full bg-sky-500/[0.03] blur-[150px] animate-aurora delay-300" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/40" />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/50">
                Personal Travel Hub
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
              My Trips &{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent font-normal">
                Bucket List
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/50 md:text-base">
              Organize your dream destinations, map flight paths across continents, track custom
              notes, and calculate aggregate multi-tier travel budgets in real time.
            </p>
          </div>

          {/* Action CTAs: Export / Share / Print */}
          {populatedTrips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleShareSummary}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black active:scale-95"
              >
                <span>📋</span>
                <span>Copy Summary</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black active:scale-95"
              >
                <span>🖨️</span>
                <span>Print Journey</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to clear your saved trips?")) {
                    clearAllSavedTrips();
                  }
                }}
                className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 transition-all hover:bg-red-500/20 active:scale-95"
              >
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* ROUTE VISUALIZER MAP */}
        {/* ================================================= */}
        <section className="mt-10">
          <BucketListRouteMap
            savedTrips={savedTrips}
            selectedSlug={selectedSlug}
            onSelectDestination={(slug) => {
              setSelectedSlug(slug);
              const el = document.getElementById(`trip-card-${slug}`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </section>

        {/* ================================================= */}
        {/* AGGREGATE BUDGET & COST TRACKER BANNER */}
        {/* ================================================= */}
        {populatedTrips.length > 0 && (
          <section className="mt-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/80 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/[0.07] blur-3xl" />

              <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                      💰
                    </span>
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                      Aggregate Journey Budget Tracker
                    </p>
                  </div>

                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
                      {activeCurrency.symbol}
                      {aggregateCost.toLocaleString()}
                    </span>
                    <span className="text-lg font-medium text-white/50">{activeCurrency.code}</span>
                  </div>

                  <p className="mt-2 text-xs text-white/50">
                    Combined estimate covering{" "}
                    <span className="text-white font-medium">{populatedTrips.length} destinations</span>,{" "}
                    <span className="text-white font-medium">{totalDays} planned travel nights</span> across all saved trips.
                  </p>
                </div>

                {/* Controls: Currency + Tier Multiplier */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Currency Picker */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">
                      Display Currency
                    </label>
                    <select
                      value={currencyCode}
                      onChange={(e) => setCurrencyCode(e.target.value)}
                      className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs text-white outline-none hover:border-white/30"
                    >
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code} className="bg-neutral-900 text-white">
                          {curr.symbol} {curr.code} — {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Spending Tier Quick Switcher */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">
                      Spending Tier
                    </label>
                    <div className="flex rounded-2xl border border-white/15 bg-white/[0.04] p-1">
                      {(["budget", "comfort", "luxury"] as TravelStyle[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setGlobalStyle(s)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                            globalStyle === s
                              ? "bg-white text-black shadow-md font-semibold"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          {STYLE_MULTIPLIERS[s].tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aggregated Cost Breakdown Items */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>🏨</span>
                    <span>Total Stays</span>
                  </div>
                  <p className="mt-2 text-lg sm:text-xl font-light text-white">
                    {activeCurrency.symbol}
                    {aggregateLodging.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/35 mt-1">{totalDays} Nights total</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>🍽️</span>
                    <span>Dining & Food</span>
                  </div>
                  <p className="mt-2 text-lg sm:text-xl font-light text-white">
                    {activeCurrency.symbol}
                    {aggregateDining.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/35 mt-1">Meals & culinary</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>🎟️</span>
                    <span>Activities</span>
                  </div>
                  <p className="mt-2 text-lg sm:text-xl font-light text-white">
                    {activeCurrency.symbol}
                    {aggregateActivities.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/35 mt-1">Sights & excursions</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>🚆</span>
                    <span>Local Transit</span>
                  </div>
                  <p className="mt-2 text-lg sm:text-xl font-light text-white">
                    {activeCurrency.symbol}
                    {aggregateTransport.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/35 mt-1">Trains, metro & ferries</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================= */}
        {/* DESTINATION CARDS & BUCKET LIST MANAGEMENT */}
        {/* ================================================= */}
        <section className="mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Saved Places</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-light text-white">
                Bucket List Itinerary ({populatedTrips.length})
              </h2>
            </div>

            {/* Filter Tabs */}
            {populatedTrips.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
                {(
                  [
                    { id: "all", label: "All Places" },
                    { id: "must-visit", label: "🔥 Must-Visit" },
                    { id: "planned", label: "🎒 Planned" },
                    { id: "dream", label: "✨ Dream" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterPriority(tab.id)}
                    className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                      filterPriority === tab.id
                        ? "bg-white text-black font-semibold shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {populatedTrips.length === 0 ? (
            <div className="mt-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 sm:p-14 text-center backdrop-blur-xl">
              <span className="text-5xl">🎒</span>
              <h3 className="mt-4 text-2xl font-light text-white">Your Bucket List Is Empty</h3>
              <p className="mt-2 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                You haven&apos;t saved any destinations yet. Explore our curated destinations or
                pick one of the popular journeys below to kickstart your travel plan!
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/explore"
                  className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  Explore Destinations →
                </Link>
              </div>

              {/* Starter Journeys Inspiration Grid */}
              <div className="mt-14 border-t border-white/10 pt-10 text-left">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40 mb-6 text-center">
                  Or Start With A Curated Travel Journey
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {CURATED_JOURNEYS.map((cj) => (
                    <div
                      key={cj.title}
                      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cj.icon}</span>
                          <h4 className="text-lg font-medium text-white">{cj.title}</h4>
                        </div>
                        <p className="mt-2 text-xs text-white/50">{cj.tagline}</p>
                        <p className="mt-3 text-[11px] text-emerald-400">
                          Includes: {cj.slugs.join(", ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddCuratedJourney(cj.slugs, cj.title)}
                        className="mt-5 w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black active:scale-95"
                      >
                        + Add To My Bucket List
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {filteredTrips.map((item, index) => {
                const isSelected = selectedSlug === item.slug;

                return (
                  <div
                    key={item.slug}
                    id={`trip-card-${item.slug}`}
                    className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 backdrop-blur-xl ${
                      isSelected
                        ? "border-emerald-400/80 bg-neutral-900/95 shadow-[0_0_35px_rgba(52,211,153,0.25)]"
                        : "border-white/10 bg-neutral-950/70 hover:border-white/25"
                    }`}
                  >
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[300px_1fr]">
                      {/* Left: Thumbnail & Badges */}
                      <div className="relative h-56 sm:h-64 lg:h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={item.dest.image}
                          alt={item.dest.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 300px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Order & Priority Badge */}
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-white/20 text-xs font-bold text-white backdrop-blur-md">
                            #{index + 1}
                          </span>
                          <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-md">
                            {item.dest.category}
                          </span>
                        </div>

                        {/* Rating & Weather */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
                            <span className="text-amber-400">★</span> {item.dest.rating}
                          </span>
                          <span className="rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md text-sky-300">
                            🌡️ {item.dest.temperature}
                          </span>
                        </div>
                      </div>

                      {/* Right: Info, Trip Controls, Notes, Budget Preview */}
                      <div className="flex flex-col justify-between space-y-6">
                        <div>
                          {/* Title & Priority Selector */}
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
                                {item.dest.country}
                              </p>
                              <h3 className="text-2xl sm:text-3xl font-light text-white">
                                {item.dest.name}
                              </h3>
                              <p className="text-xs text-white/50 mt-1">{item.dest.tagline}</p>
                            </div>

                            {/* Priority Selector Pills */}
                            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                              {(
                                [
                                  { id: "must-visit", label: "🔥 Must" },
                                  { id: "planned", label: "🎒 Booked" },
                                  { id: "dream", label: "✨ Dream" },
                                ] as const
                              ).map((p) => {
                                const active = (item.priority || "dream") === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handlePriorityChange(item.slug, p.id)}
                                    className={`rounded-xl px-2.5 py-1 text-[11px] transition-all ${
                                      active
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "text-white/50 hover:text-white"
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Steppers & Target Date */}
                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Days Stepper */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                              <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                                Duration
                              </span>
                              <div className="mt-1 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => handleDaysChange(item.slug, -1, item.plannedDays || 5)}
                                  className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/20 active:scale-95"
                                >
                                  −
                                </button>
                                <span className="text-sm font-medium text-white">
                                  {item.plannedDays || 5} days
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDaysChange(item.slug, 1, item.plannedDays || 5)}
                                  className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/20 active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Travelers Stepper */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                              <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                                Travelers
                              </span>
                              <div className="mt-1 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTravelersChange(item.slug, -1, item.travelers || 2)
                                  }
                                  className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/20 active:scale-95"
                                >
                                  −
                                </button>
                                <span className="text-sm font-medium text-white">
                                  {item.travelers || 2} guests
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTravelersChange(item.slug, 1, item.travelers || 2)
                                  }
                                  className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/20 active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Target Date */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                              <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                                Target Date
                              </span>
                              <input
                                type="text"
                                placeholder="e.g. Oct 2026"
                                defaultValue={item.targetDate || ""}
                                onBlur={(e) => handleTargetDateChange(item.slug, e.target.value)}
                                className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-2.5 py-1 text-xs text-white outline-none placeholder:text-white/30 focus:border-white/30"
                              />
                            </div>
                          </div>

                          {/* Personal Trip Notes */}
                          <div className="mt-4">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                              Travel Notes & Ideas
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Write reminders, favorite restaurants to try, or travel buddy ideas..."
                              defaultValue={item.notes || ""}
                              onBlur={(e) => handleNotesChange(item.slug, e.target.value)}
                              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white outline-none placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.04]"
                            />
                          </div>
                        </div>

                        {/* Bottom: Cost Estimate & Actions */}
                        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                          {/* Cost Preview */}
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-white/40">
                              Estimated Trip Budget
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl sm:text-2xl font-light text-white">
                                {activeCurrency.symbol}
                                {item.singleBudget.totalConverted.toLocaleString()}
                              </span>
                              <span className="text-xs text-white/40">{activeCurrency.code}</span>
                              <span className="text-[11px] text-white/35">
                                (~{activeCurrency.symbol}
                                {item.singleBudget.perPersonDailyConverted.toLocaleString()}/person/day)
                              </span>
                            </div>
                          </div>

                          {/* Direct Actions */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/plan/${item.slug}`}
                              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-white/90 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            >
                              Build Itinerary →
                            </Link>

                            <Link
                              href={`/explore/${item.slug}`}
                              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white transition-all hover:bg-white/10 active:scale-95"
                            >
                              Explore Guide
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeSaved(item.slug)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-white/40 transition-all hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
                              title="Remove from Bucket List"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
