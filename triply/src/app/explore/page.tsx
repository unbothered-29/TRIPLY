"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { destinations } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";
import ExploreMap from "@/components/ExploreMap";
import { openQuickView } from "@/components/DestinationQuickViewModal";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

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
      <section className="relative overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-14 md:pt-36 lg:px-24">
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
          {/* CONTROLS BAR: FILTERS + VIEW TOGGLE */}
          {/* ================================================= */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
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
                  className={`rounded-full border px-4 py-2 text-xs transition-all duration-300 active:scale-95 ${
                    category === filter
                      ? "border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] font-medium"
                      : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/30 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* View Mode Switcher (Grid vs Interactive Map) */}
            <div className="flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span>Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  viewMode === "map"
                    ? "bg-white text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.284a1.125 1.125 0 0 0-1.006 0L3.622 5.72A1.125 1.125 0 0 0 3 6.726v11.93c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
                <span>World Map</span>
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 flex items-center gap-2">
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
      {/* DESTINATION CONTENT: GRID OR MAP VIEW */}
      {/* ================================================= */}
      <section className="px-6 pb-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {filteredDestinations.length > 0 ? (
            viewMode === "grid" ? (
              /* GRID VIEW */
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

                        {/* Top Badges & Quick View */}
                        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openQuickView(destination.slug);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] text-white backdrop-blur-md hover:bg-white hover:text-black hover:border-white active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                          >
                            ✦ Quick View
                          </button>

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
              /* MAP VIEW */
              <ExploreMap destinations={filteredDestinations} />
            )
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