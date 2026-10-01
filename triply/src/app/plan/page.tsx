"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";

export default function PlanPage() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

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

    params.set("startDate", startDate);
    params.set("endDate", endDate);

    if (interests.length > 0) {
      params.set("interests", interests.join(","));
    }

    router.push(`/plan/${destination}?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-32 text-white md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />

            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
              Trip planner
            </p>
          </div>

          <h1 className="mt-8 text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Plan your
            <br />
            <span className="text-white/30">
              next journey.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/40 md:text-base">
            Tell us where you're going, when you're traveling,
            and what you want to experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="text-[10px] uppercase tracking-[0.3em] text-white/30"
            >
              01 / Destination
            </label>

            <select
              id="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="mt-4 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 text-base text-white outline-none transition focus:border-white/30"
              required
            >
              <option
                value=""
                disabled
                className="bg-black"
              >
                Choose a destination
              </option>

              {destinations.map((item) => (
                <option
                  key={item.slug}
                  value={item.slug}
                  className="bg-black"
                >
                  {item.name}, {item.country}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              02 / When
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Start date */}
              <div>
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-xs text-white/30"
                >
                  Start date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 text-sm text-white outline-none transition focus:border-white/30"
                  required
                />
              </div>

              {/* End date */}
              <div>
                <label
                  htmlFor="end-date"
                  className="mb-2 block text-xs text-white/30"
                >
                  End date
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 text-sm text-white outline-none transition focus:border-white/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              03 / Interests
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full border px-6 py-3 text-sm transition duration-300 ${
                      selected
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-white/10 pt-8">
            <button
              type="submit"
              className="group flex items-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition duration-300 hover:bg-white/80"
            >
              <span>Generate i</span>

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}