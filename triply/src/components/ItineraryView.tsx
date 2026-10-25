"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GeneratedItinerary, ActivitySlot, DaySchedule } from "@/lib/itineraryGenerator";
import Reveal from "@/components/ui/Reveal";
import TripBudgetCalculator from "@/components/TripBudgetCalculator";
import SmartPackingChecklist from "@/components/SmartPackingChecklist";
import { showToast } from "@/components/ui/Toast";

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  const { destination, days: initialDays, durationDays, dateRangeText, interests, travelTips } = itinerary;

  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState<DaySchedule[]>(initialDays);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "packing" | "budget" | "tips">("itinerary");

  // State for Add Activity inline modal / form
  const [addingDayNumber, setAddingDayNumber] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPeriod, setNewPeriod] = useState<"Morning" | "Afternoon" | "Evening">("Morning");
  const [newTime, setNewTime] = useState("09:30 - 11:30");
  const [newCategory, setNewCategory] = useState<ActivitySlot["category"]>("Sightseeing");
  const [newLocation, setNewLocation] = useState("");

  const customItineraryKey = `triply_custom_itinerary_${destination.slug}`;
  const completedStorageKey = `triply_completed_acts_${destination.slug}`;

  // Hydration-safe initial loading from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const savedCustom = localStorage.getItem(customItineraryKey);
      if (savedCustom) {
        setDays(JSON.parse(savedCustom));
      }
      const savedCompleted = localStorage.getItem(completedStorageKey);
      if (savedCompleted) {
        setCompletedActivities(JSON.parse(savedCompleted));
      }
    } catch {
      // ignore
    }
  }, [customItineraryKey, completedStorageKey]);

  const toggleActivity = (key: string) => {
    setCompletedActivities((prev) => {
      const next = !prev[key];
      const updated = { ...prev, [key]: next };
      try {
        localStorage.setItem(completedStorageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (next) {
        showToast({
          title: "Activity Checked Off!",
          description: "Itinerary progress updated.",
          type: "success",
        });
      }
      return updated;
    });
  };

  const handleAddActivity = (dayNumber: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSlot: ActivitySlot = {
      period: newPeriod,
      time: newTime || "Flexible",
      title: newTitle.trim(),
      description: newDesc.trim() || "Custom planned activity.",
      category: newCategory,
      location: newLocation.trim() || undefined,
    };

    const updatedDays = days.map((d) => {
      if (d.day === dayNumber) {
        return {
          ...d,
          slots: [...d.slots, newSlot],
        };
      }
      return d;
    });

    setDays(updatedDays);
    setAddingDayNumber(null);
    setNewTitle("");
    setNewDesc("");
    setNewLocation("");

    try {
      localStorage.setItem(customItineraryKey, JSON.stringify(updatedDays));
      showToast({
        title: "Activity Added!",
        description: `Added "${newSlot.title}" to Day ${dayNumber}.`,
        type: "success",
      });
    } catch {
      // ignore
    }
  };

  const handleRemoveActivity = (dayNumber: number, slotIndex: number, title: string) => {
    const updatedDays = days.map((d) => {
      if (d.day === dayNumber) {
        return {
          ...d,
          slots: d.slots.filter((_, idx) => idx !== slotIndex),
        };
      }
      return d;
    });

    setDays(updatedDays);
    try {
      localStorage.setItem(customItineraryKey, JSON.stringify(updatedDays));
      showToast({
        title: "Activity Removed",
        description: `Removed "${title}" from Day ${dayNumber}.`,
        type: "neutral",
      });
    } catch {
      // ignore
    }
  };

  const handleResetItinerary = () => {
    if (confirm("Reset itinerary back to the original generated plan?")) {
      setDays(initialDays);
      try {
        localStorage.removeItem(customItineraryKey);
      } catch {
        // ignore
      }
      showToast({
        title: "Itinerary Reset",
        description: "Restored default day-by-day plan.",
        type: "neutral",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        showToast({
          title: "Trip Link Copied!",
          description: "Share this link with your travel partners.",
          type: "success",
        });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const visibleDays = selectedDay === "all" ? days : days.filter((d) => d.day === selectedDay);

  const totalSlotsCount = days.reduce((acc, d) => acc + d.slots.length, 0);
  const completedCount = mounted ? Object.values(completedActivities).filter(Boolean).length : 0;
  const progressPercent = totalSlotsCount > 0 ? Math.round((completedCount / totalCountSafe(totalSlotsCount)) * 100) : 0;

  function totalCountSafe(n: number) {
    return n > 0 ? n : 1;
  }

  return (
    <div className="relative min-h-screen bg-black text-white pb-32">
      {/* ================================================= */}
      {/* PRINT-ONLY CLEAN TRAVEL BOOKLET HEADER */}
      {/* ================================================= */}
      <div className="hidden print:block p-8 border-b border-gray-400 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              {destination.name}, {destination.country}
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Custom Travel Guide & Day-by-Day Route • {durationDays} Days ({dateRangeText})
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-gray-500 font-mono">Triply Journey Plan</span>
            <p className="text-sm font-semibold text-gray-800">{destination.temperature} Climate</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
          Interests: {interests.join(", ")} • Prepared for travel adventure
        </p>
      </div>

      {/* Screen Hero Section */}
      <section className="print:hidden px-4 pb-12 pt-28 md:px-8 md:pt-32 lg:px-16 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href={`/explore/${destination.slug}`}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>Back to {destination.name} Guide</span>
            </Link>

            {/* Actions Cluster */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black active:scale-95"
              >
                <span>🔗</span>
                <span>{copied ? "Link Copied!" : "Share Trip"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-neutral-200 active:scale-95"
              >
                <span>🖨️</span>
                <span>Export / Print Booklet</span>
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="mt-6 grid overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)] lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: Destination Imagery */}
            <div className="relative min-h-[380px] lg:min-h-[520px]">
              <Image
                src={destination.image}
                alt={`${destination.name}, ${destination.country}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 hidden lg:block" />

              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-[11px] uppercase tracking-wider text-white backdrop-blur-md">
                  <span>✦ Tailored Itinerary & Route</span>
                </div>
                <h1 className="mt-3 text-5xl font-light tracking-tight text-white md:text-7xl">
                  {destination.name}
                </h1>
                <p className="mt-2 text-sm text-white/70">
                  {destination.tagline}
                </p>
              </div>
            </div>

            {/* Right: Trip Overview Specs */}
            <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                    Trip Overview
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                    {durationDays} Days Planned
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-white/40">Travel Window</span>
                    <span className="text-sm font-medium text-white">{dateRangeText}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-white/40">Expected Climate</span>
                    <span className="text-sm font-medium text-white/90">
                      🌡️ {destination.temperature} • {destination.category}
                    </span>
                  </div>

                  <div className="border-b border-white/10 pb-3">
                    <span className="text-xs text-white/40 block mb-2">Selected Interests</span>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Checklist Tracker */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/40">Itinerary Progress</span>
                      <span className="text-white/80">
                        {completedCount} of {totalSlotsCount} completed ({progressPercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset & Modify Link */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={handleResetItinerary}
                  className="text-white/40 hover:text-white transition"
                >
                  ↺ Reset Customizations
                </button>

                <Link
                  href={`/explore/${destination.slug}`}
                  className="group flex items-center gap-2 font-medium text-white transition hover:text-white/80"
                >
                  <span>Explore Destination Guide</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-4 md:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {/* Navigation Tabs */}
          <div className="print:hidden mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "itinerary"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                🗺️ Day-by-Day Route
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("packing")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "packing"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                🎒 Smart Packing Checklist
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("budget")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "budget"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                💰 Trip Budget & Cost
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tips")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "tips"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                💡 Local Guide & Tips
              </button>
            </div>

            {/* Day Filter Pills (only when itinerary tab is active) */}
            {activeTab === "itinerary" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDay("all")}
                  className={`rounded-full px-3 py-1.5 text-xs transition duration-200 ${
                    selectedDay === "all"
                      ? "border border-white/30 bg-white/15 text-white font-medium"
                      : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  All Days
                </button>
                {days.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setSelectedDay(d.day)}
                    className={`rounded-full px-3 py-1.5 text-xs transition duration-200 ${
                      selectedDay === d.day
                        ? "border border-white/30 bg-white/15 text-white font-medium"
                        : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    Day {d.day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* TAB 1: ITINERARY WITH CUSTOM ACTIVITY BUILDER */}
          {/* ================================================= */}
          {activeTab === "itinerary" && (
            <div className="space-y-12">
              {visibleDays.map((daySchedule) => (
                <Reveal key={daySchedule.day} delay={daySchedule.day * 80}>
                  <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 print:border-gray-300 print:bg-white print:text-black">
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-3 print:border-gray-300">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-light text-white print:border-gray-400 print:text-black">
                          {String(daySchedule.day).padStart(2, "0")}
                        </span>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-light text-white print:text-black">
                            {daySchedule.title}
                          </h2>
                          <p className="text-xs text-white/40 print:text-gray-500">
                            {daySchedule.dateLabel} • {daySchedule.theme}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddingDayNumber(daySchedule.day)}
                          className="print:hidden rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white transition hover:border-white hover:bg-white hover:text-black active:scale-95"
                        >
                          + Add Activity
                        </button>
                        <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] text-white/60 print:border-gray-300 print:text-gray-700">
                          {daySchedule.slots.length} Activities
                        </span>
                      </div>
                    </div>

                    {/* Inline Form to Add Custom Activity to this Day */}
                    {addingDayNumber === daySchedule.day && (
                      <form
                        onSubmit={(e) => handleAddActivity(daySchedule.day, e)}
                        className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-950/20 p-5 animate-fade-in print:hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-semibold text-emerald-400">
                            Add Custom Activity to Day {daySchedule.day}
                          </p>
                          <button
                            type="button"
                            onClick={() => setAddingDayNumber(null)}
                            className="text-xs text-white/40 hover:text-white"
                          >
                            ✕ Cancel
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] uppercase text-white/40 block mb-1">
                              Activity Title
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sunset Boat Cruise or Dinner at Le Bistro..."
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-white/40 block mb-1">
                              Time / Slot
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 18:30 - 20:30"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-white/40 block mb-1">
                              Period
                            </label>
                            <select
                              value={newPeriod}
                              onChange={(e) => setNewPeriod(e.target.value as any)}
                              className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-xs text-white outline-none"
                            >
                              <option value="Morning">Morning</option>
                              <option value="Afternoon">Afternoon</option>
                              <option value="Evening">Evening</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-white/40 block mb-1">
                              Category
                            </label>
                            <select
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value as any)}
                              className="w-full rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-xs text-white outline-none"
                            >
                              <option value="Sightseeing">Sightseeing</option>
                              <option value="Food">Food & Dining</option>
                              <option value="Nature">Nature & Outdoors</option>
                              <option value="Culture">Culture & History</option>
                              <option value="Adventure">Adventure</option>
                              <option value="Leisure">Leisure & Relaxation</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-white/40 block mb-1">
                              Location (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Marina Pier 4"
                              value={newLocation}
                              onChange={(e) => setNewLocation(e.target.value)}
                              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="text-[10px] uppercase text-white/40 block mb-1">
                            Description / Notes
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Add details, reservation booking confirmation, or tips..."
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="w-full resize-none rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setAddingDayNumber(null)}
                            className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-xl bg-emerald-400 px-5 py-2 text-xs font-semibold text-black transition hover:bg-emerald-300"
                          >
                            Save Activity
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Day Slots List */}
                    <div className="mt-6 space-y-5">
                      {daySchedule.slots.map((slot, sIdx) => {
                        const activityId = `day-${daySchedule.day}-slot-${sIdx}-${slot.title.slice(0, 10)}`;
                        const isDone = mounted && Boolean(completedActivities[activityId]);

                        return (
                          <div
                            key={sIdx}
                            className={`group relative flex flex-col md:flex-row gap-5 rounded-2xl border p-5 transition-all duration-300 ${
                              isDone
                                ? "border-emerald-500/30 bg-emerald-950/10 opacity-75 print:border-gray-300"
                                : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] print:border-gray-200"
                            }`}
                          >
                            {/* Checkbox Button */}
                            <button
                              type="button"
                              onClick={() => toggleActivity(activityId)}
                              className={`print:hidden self-start flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                isDone
                                  ? "border-emerald-400 bg-emerald-500 text-black shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                                  : "border-white/20 text-transparent hover:border-white/50"
                              }`}
                              title={isDone ? "Mark as uncompleted" : "Mark as completed"}
                            >
                              ✓
                            </button>

                            {/* Print-only checkbox square */}
                            <div className="hidden print:block h-4 w-4 border border-black rounded-xs self-start" />

                            {/* Activity Image Thumbnail */}
                            {slot.image && (
                              <div className="relative h-32 md:h-28 w-full md:w-44 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 print:hidden">
                                <Image
                                  src={slot.image}
                                  alt={slot.title}
                                  fill
                                  sizes="176px"
                                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                              </div>
                            )}

                            {/* Activity Info */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider text-white/80 print:text-black print:border print:border-gray-300">
                                    {slot.period} ({slot.time})
                                  </span>
                                  <span className="text-xs text-white/30 print:hidden">•</span>
                                  <span className="text-xs text-emerald-400 font-medium print:text-gray-700">
                                    {slot.category}
                                  </span>
                                  {slot.location && (
                                    <>
                                      <span className="text-xs text-white/30 print:hidden">•</span>
                                      <span className="text-xs text-white/50 print:text-gray-600">
                                        📍 {slot.location}
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Delete activity button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveActivity(daySchedule.day, sIdx, slot.title)}
                                  className="print:hidden opacity-0 group-hover:opacity-100 transition text-xs text-white/30 hover:text-red-400"
                                  title="Remove activity"
                                >
                                  ✕ Remove
                                </button>
                              </div>

                              <h3
                                className={`text-base sm:text-lg font-light transition-all ${
                                  isDone
                                    ? "line-through text-white/50 print:text-gray-400"
                                    : "text-white group-hover:text-white/95 print:text-black font-normal"
                                }`}
                              >
                                {slot.title}
                              </h3>

                              <p className="mt-1.5 text-xs sm:text-sm font-light leading-relaxed text-white/50 print:text-gray-600">
                                {slot.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 2: SMART PACKING CHECKLIST */}
          {/* ================================================= */}
          {activeTab === "packing" && (
            <div className="animate-fade-in">
              <SmartPackingChecklist
                destinationSlug={destination.slug}
                destinationName={destination.name}
                temperature={destination.temperature}
              />
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 3: TRIP BUDGET ESTIMATOR */}
          {/* ================================================= */}
          {activeTab === "budget" && (
            <div className="animate-fade-in">
              <TripBudgetCalculator
                initialDestinationSlug={destination.slug}
                initialDays={durationDays}
                initialTravelers={2}
              />
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 4: TIPS & LOCAL TRANSIT */}
          {/* ================================================= */}
          {activeTab === "tips" && (
            <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
              {/* Transit & Getting Around */}
              <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-7 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="text-xl">🚇</span>
                  <div>
                    <h3 className="text-lg font-medium text-white">Local Transportation</h3>
                    <p className="text-xs text-white/40">Getting around {destination.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/70">
                  {travelTips.transport}
                </p>
              </div>

              {/* Cultural Etiquette */}
              <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-7 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="text-xl">🤝</span>
                  <div>
                    <h3 className="text-lg font-medium text-white">Cultural Etiquette</h3>
                    <p className="text-xs text-white/40">Travel respectfully</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/70">
                  {travelTips.localEtiquette}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Print-only Packing Checklist Footer */}
      <div className="hidden print:block mt-12 p-8 border-t border-gray-400 text-black">
        <h3 className="text-xl font-bold mb-4">Packing Checklist Summary for {destination.name}</h3>
        <p className="text-xs text-gray-600 mb-4">
          Essential items to pack: Passport, travel insurance, universal adapter, climate layers for {destination.temperature}, portable power bank, prescription meds.
        </p>
        <p className="text-[11px] text-gray-500 text-right mt-6">
          Created with TRIPLY • Travel begins with curiosity.
        </p>
      </div>
    </div>
  );
}
