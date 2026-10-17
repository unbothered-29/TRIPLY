"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { destinations } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredDestinations = destinations.filter((destination) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.country.toLowerCase().includes(searchTerm) ||
      destination.tagline.toLowerCase().includes(searchTerm) ||
      destination.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "All" || destination.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ================================================= */}
      {/* EXPLORE HEADER */}
      {/* ================================================= */}
      <section className="relative overflow-hidden px-6 pb-14 pt-32 md:px-12 md:pb-16 md:pt-36 lg:px-24">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-[130px] animate-aurora" />
          <div className="absolute bottom-0 left-[-150px] h-[350px] w-[350px] rounded-full bg-sky-500/[0.02] blur-[100px] animate-aurora delay-200" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-white/[0.02]" />
          <div className="absolute left-2/4 top-0 h-full w-px bg-white/[0.02]" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-white/[0.02]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Top label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
                Explore
              </p>
            </div>

            <p className="hidden text-[9px] uppercase tracking-[0.3em] text-white/20 md:block">
              Triply / Destinations
            </p>
          </div>

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_240px] lg:items-end">
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-white/25">
                Find somewhere new
              </p>

              <h1 className="max-w-5xl text-4xl font-light leading-[0.95] tracking-[-0.045em] md:text-6xl lg:text-[6rem]">
                Discover your
                <br />
                <span className="bg-gradient-to-r from-white via-white/80 to-white/35 bg-clip-text text-transparent">
                  next destination.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-white/40 md:text-base">
                Explore beautiful places, find inspiration, and
                discover somewhere worth going next.
              </p>
            </div>

            {/* Destination count */}
            <div className="hidden border-l border-white/10 pl-6 lg:block">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                Destinations
              </p>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-light tracking-tight text-white/80">
                  {destinations.length}
                </span>

                <span className="mb-1 text-[9px] uppercase tracking-[0.2em] text-white/25">
                  places
                </span>
              </div>

              <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-white/25">
                Places worth discovering and remembering.
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}
          <div className="mt-10 max-w-xl">
            <input
              type="text"
              placeholder="Search destinations by name, country, or vibe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-light text-white outline-none transition-all duration-300 placeholder:text-white/25 hover:border-white/20 focus:border-white/40 focus:bg-white/[0.08] focus:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* ================================================= */}
          {/* FILTERS */}
          {/* ================================================= */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {[
              "All",
              "Nature",
              "Mountains",
              "Cities",
              "Coastal",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setCategory(filter)}
                className={`rounded-full border px-5 py-2.5 text-xs transition-all duration-300 active:scale-95 ${
                  category === filter
                    ? "border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] font-medium"
                    : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/30 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="mt-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              {filteredDestinations.length}{" "}
              {filteredDestinations.length === 1
                ? "destination"
                : "destinations"}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* DESTINATION GRID */}
      {/* ================================================= */}
      <section className="px-6 pb-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {filteredDestinations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDestinations.map((destination, index) => (
                <Reveal key={destination.slug} delay={(index % 6) * 80}>
                  <Link
                    href={`/explore/${destination.slug}`}
                    className="group block"
                  >
                    <article className="relative h-[450px] overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                      {/* Image */}
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/55" />

                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Top Badge */}
                      <div className="absolute top-5 right-5">
                        <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-md">
                          {destination.category}
                        </span>
                      </div>

                      {/* Card content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-7 text-white md:p-8">
                        <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                            {destination.country}
                          </p>

                          <h2 className="mt-3 text-4xl font-light tracking-tight">
                            {destination.name}
                          </h2>

                          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                            {destination.tagline}
                          </p>

                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                              {destination.temperature}
                            </span>

                            <span className="text-sm text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                              Explore →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover border glow */}
                      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/0 transition-colors duration-500 group-hover:border-white/20" />
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */
            <div className="flex min-h-[300px] flex-col items-center justify-center border-t border-white/10 text-center animate-fade-in">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                No destinations found
              </p>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/30">
                Try searching for another destination or choose a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-7 rounded-full border border-white/15 px-6 py-3 text-xs text-white/50 transition duration-300 hover:border-white hover:bg-white hover:text-black active:scale-95"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}