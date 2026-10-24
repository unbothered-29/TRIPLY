"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";
import TripBudgetCalculator from "@/components/TripBudgetCalculator";

function PlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDest = searchParams.get("destination") || "";

  const [destination, setDestination] = useState(preselectedDest);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [showBudgetEstimator, setShowBudgetEstimator] = useState(false);

  const interestOptions = [
    "Nature",
    "Food",
    "Culture",
    "Adventure",
  ];

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (interests.length > 0) {
      params.set("interests", interests.join(","));
    }

    router.push(`/plan/${destination}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Destination */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
        <label
          htmlFor="destination"
          className="text-[10px] uppercase tracking-[0.3em] text-white/40"
        >
          01 / Destination
        </label>

        <select
          id="destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          className="mt-4 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 hover:border-white/25 focus:border-white/50 focus:bg-white/[0.08] focus:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
          required
        >
          <option value="" disabled className="bg-neutral-900 text-white/60">
            Choose a destination
          </option>

          {destinations.map((item) => (
            <option
              key={item.slug}
              value={item.slug}
              className="bg-neutral-900 text-white"
            >
              {item.name}, {item.country}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            02 / When
          </label>
          <span className="text-[10px] text-white/30">Optional for custom day count</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Start date */}
          <div>
            <label
              htmlFor="start-date"
              className="mb-2 block text-xs text-white/40"
            >
              Start date
            </label>

            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none transition-all duration-300 hover:border-white/25 focus:border-white/50 focus:bg-white/[0.08] focus:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* End date */}
          <div>
            <label
              htmlFor="end-date"
              className="mb-2 block text-xs text-white/40"
            >
              End date
            </label>

            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white outline-none transition-all duration-300 hover:border-white/25 focus:border-white/50 focus:bg-white/[0.08] focus:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            03 / Interests
          </label>
          <span className="text-[10px] text-white/30">Tailors daily morning & afternoon spots</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {interestOptions.map((interest) => {
            const selected = interests.includes(interest);

            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full border px-6 py-3 text-sm transition-all duration-300 active:scale-95 ${
                  selected
                    ? "border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] font-medium"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Budget & Cost Estimator Preview */}
      {destination && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                04 / Budget Preview (Optional)
              </p>
              <p className="text-xs text-white/60 mt-1">
                Estimate lodging, dining, and daily costs for{" "}
                <span className="text-white font-medium">
                  {destinations.find((d) => d.slug === destination)?.name}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBudgetEstimator((prev) => !prev)}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/80 transition-all hover:bg-white hover:text-black hover:border-white active:scale-95"
            >
              {showBudgetEstimator ? "Hide Estimator ▴" : "💰 Calculate Budget ▾"}
            </button>
          </div>

          {showBudgetEstimator && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
              <TripBudgetCalculator
                initialDestinationSlug={destination}
                initialDays={5}
                compact={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="border-t border-white/10 pt-8">
        <button
          type="submit"
          className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-medium text-black shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] active:scale-95"
        >
          <span>Generate tailored itinerary</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </button>
      </div>
    </form>
  );
}

export default function PlanPage() {
  return (
    <main className="relative min-h-screen bg-black px-6 pb-24 pt-32 text-white md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/[0.03] blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute bottom-20 -left-20 h-80 w-80 rounded-full bg-sky-500/[0.02] blur-3xl animate-aurora delay-300" />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <Reveal>
          <div className="mb-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
                Itinerary Planner
              </p>
            </div>

            <h1 className="mt-8 text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Plan your
              <br />
              <span className="bg-gradient-to-r from-white via-white/80 to-white/35 bg-clip-text text-transparent">
                next journey.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/50 md:text-base">
              Tell us where you&apos;re going, when you&apos;re traveling,
              and what you want to experience.
            </p>
          </div>
        </Reveal>

        {/* Form wrapped in Suspense for useSearchParams */}
        <Reveal delay={150}>
          <Suspense fallback={<div className="text-white/40 py-12 text-center">Loading planner...</div>}>
            <PlanForm />
          </Suspense>
        </Reveal>
      </div>
    </main>
  );
}