"use client";

import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import Reveal from "@/components/ui/Reveal";
import { openQuickView } from "@/components/DestinationQuickViewModal";
import { getCategoryTheme, getClimateBadge } from "@/lib/uiColors";

export default function PopularDestinations() {
  const featuredDestination = destinations[0];
  const otherDestinations = destinations.slice(1, 5);

  const featuredTheme = getCategoryTheme(featuredDestination.category);
  const featuredClimate = getClimateBadge(featuredDestination.temperature);

  return (
    <section className="relative border-t border-white/10 bg-black px-6 py-24 text-white md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/[0.05] blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-sky-500/[0.04] blur-3xl animate-aurora delay-300" />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                Popular destinations
              </p>

              <h2 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
                Places worth going.
              </h2>
            </div>

            <Link
              href="/explore"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black"
            >
              <span>Explore all destinations</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Destination layout */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Featured destination */}
          <Reveal delay={100}>
            <Link
              href={`/explore/${featuredDestination.slug}`}
              className="group relative block min-h-[560px] h-full overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
            >
              <Image
                src={featuredDestination.image}
                alt={featuredDestination.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              {/* Badge & Quick View */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3.5 py-1 text-xs uppercase tracking-wider backdrop-blur-md font-medium ${featuredTheme.badge}`}>
                    {featuredTheme.icon} {featuredDestination.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs backdrop-blur-md ${featuredClimate.badge}`}>
                    <span>{featuredClimate.icon}</span> <span>{featuredDestination.temperature}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-amber-400/30 bg-black/60 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md shadow-sm">
                    ★ {featuredDestination.rating}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView(featuredDestination.slug);
                    }}
                    className="rounded-full border border-white/25 bg-black/60 px-3.5 py-1 text-xs text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                  >
                    ✦ Quick View
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10 transition-transform duration-500 group-hover:-translate-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                  {featuredDestination.country}
                </p>

                <h3 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                  {featuredDestination.name}
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
                  {featuredDestination.tagline}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/50 transition duration-300 group-hover:text-white">
                  <span>Explore destination</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Grid of other destinations */}
          <div className="grid gap-6 sm:grid-cols-2">
            {otherDestinations.map((destination, index) => {
              const theme = getCategoryTheme(destination.category);
              const climate = getClimateBadge(destination.temperature);

              return (
                <Reveal key={destination.slug} delay={150 + index * 80}>
                  <Link
                    href={`/explore/${destination.slug}`}
                    className="group relative block h-[280px] overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                  >
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-md font-medium ${theme.badge}`}>
                        {theme.icon} {destination.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full border border-amber-400/30 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
                          ★ {destination.rating}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openQuickView(destination.slug);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] text-white backdrop-blur-md hover:border-white hover:bg-white hover:text-black active:scale-95"
                        >
                          ✦
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform duration-500 group-hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                          {destination.country}
                        </p>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] ${climate.badge}`}>
                          <span>{climate.icon}</span> {destination.temperature}
                        </span>
                      </div>

                      <h4 className="mt-1 text-2xl font-light tracking-tight">
                        {destination.name}
                      </h4>

                      <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                        <span className={`font-medium ${theme.text}`}>{destination.category}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}