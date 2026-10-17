"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GeneratedItinerary } from "@/lib/itineraryGenerator";
import Reveal from "@/components/ui/Reveal";

interface ItineraryViewProps {
  itinerary: GeneratedItinerary;
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  const { destination, days, durationDays, dateRangeText, interests, travelTips } = itinerary;

  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "tips">("itinerary");

  const toggleActivity = (key: string) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore clipboard error
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const visibleDays = selectedDay === "all" ? days : days.filter((d) => d.day === selectedDay);

  const totalSlotsCount = days.reduce((acc, d) => acc + d.slots.length, 0);
  const completedCount = Object.values(completedActivities).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (totalSlotsCount || 1)) * 100);

  return (
    <div className="relative min-h-screen bg-black text-white pb-32">
      {/* Print-only Header (visible when printing) */}
      <div className="hidden print:block p-8 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-black">{destination.name}, {destination.country}</h1>
        <p className="text-sm text-gray-600 mt-1">{dateRangeText} • {durationDays} Days</p>
        <p className="text-xs text-gray-500 mt-2">Interests: {interests.join(", ")}</p>
      </div>

      {/* Screen Hero Section */}
      <section className="print:hidden px-4 pb-12 pt-28 md:px-8 md:pt-32 lg:px-16 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Navigation link */}
          <div className="flex items-center justify-between">
            <Link
              href={`/explore/${destination.slug}`}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>Back to {destination.name}</span>
            </Link>

            {/* Actions Bar */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black active:scale-95"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                <span>{copied ? "Link Copied!" : "Share Trip"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-xs font-medium text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-neutral-200 active:scale-95"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.076-.672-2.126-1.27-3.086m0 0a13.998 13.998 0 0 1-1.096-2.18 1.5 1.5 0 0 1 1.022-1.996l3.72-1.125a1.5 1.5 0 0 1 1.764.796l1.246 2.493m-6.656 2.012a14.05 14.05 0 0 1 2.378-.87m4.278.858 2.067-.624a1.5 1.5 0 0 1 1.764.796l1.246 2.493m-5.077-2.665c-.24-1.076-.672-2.126-1.27-3.086m0 0a14.05 14.05 0 0 0-2.378-.87m0 0 2.378.87m0 0c.24 1.076.672 2.126 1.27 3.086" />
                </svg>
                <span>Export / Print</span>
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
                  <span>✦ Tailored Itinerary</span>
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
                    <span className="text-xs text-white/40">Expected Weather</span>
                    <span className="text-sm font-medium text-white/90">
                      {destination.temperature} • {destination.category}
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
                      <span className="text-white/80">{completedCount} of {totalSlotsCount} scheduled ({progressPercent}%)</span>
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

              {/* Modify Plan Link */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <Link
                  href="/plan"
                  className="text-xs text-white/50 transition hover:text-white"
                >
                  ✎ Modify Dates or Interests
                </Link>

                <Link
                  href={`/explore/${destination.slug}`}
                  className="group flex items-center gap-2 text-xs font-medium text-white transition hover:text-white/80"
                >
                  <span>Explore Place Guide</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Itinerary Content Section */}
      <section className="px-4 md:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {/* Section Navigation Tabs */}
          <div className="print:hidden mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "itinerary"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Day-by-Day Route
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tips")}
                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                  activeTab === "tips"
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Travel Tips & Packing
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

          {/* ITINERARY TAB */}
          {activeTab === "itinerary" && (
            <div className="space-y-12">
              {visibleDays.map((daySchedule) => (
                <Reveal key={daySchedule.day} delay={daySchedule.day * 80}>
                  <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 print:border-gray-300 print:bg-white print:text-black">
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-3 print:border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-light text-white print:border-gray-300 print:text-black">
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

                      <span className="self-start sm:self-auto rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 text-[11px] text-white/60 print:border-gray-300 print:text-gray-700">
                        {daySchedule.slots.length} Activities
                      </span>
                    </div>

                    {/* Day Slots */}
                    <div className="mt-6 space-y-6">
                      {daySchedule.slots.map((slot, sIdx) => {
                        const activityId = `day-${daySchedule.day}-slot-${sIdx}`;
                        const isDone = Boolean(completedActivities[activityId]);

                        return (
                          <div
                            key={sIdx}
                            className={`group relative flex flex-col md:flex-row gap-5 rounded-2xl border p-5 transition-all duration-300 ${
                              isDone
                                ? "border-emerald-500/30 bg-emerald-950/10 opacity-75"
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

                            {/* Activity Image Thumbnail (if present) */}
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
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider text-white/80 print:text-black">
                                  {slot.period} ({slot.time})
                                </span>
                                <span className="text-xs text-white/30">•</span>
                                <span className="text-xs text-emerald-400/90 font-medium">
                                  {slot.category}
                                </span>
                                {slot.location && (
                                  <>
                                    <span className="text-xs text-white/30">•</span>
                                    <span className="text-xs text-white/40 print:text-gray-500">
                                      📍 {slot.location}
                                    </span>
                                  </>
                                )}
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

          {/* TIPS & PACKING TAB */}
          {activeTab === "tips" && (
            <div className="grid gap-8 md:grid-cols-2 animate-fade-in">
              {/* Packing Advice */}
              <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-7 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="text-xl">🎒</span>
                  <div>
                    <h3 className="text-lg font-medium text-white">Packing Essentials</h3>
                    <p className="text-xs text-white/40">Tailored for {destination.temperature} weather</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {travelTips.packing.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-light text-white/70">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transit & Cultural Etiquette */}
              <div className="space-y-6">
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
