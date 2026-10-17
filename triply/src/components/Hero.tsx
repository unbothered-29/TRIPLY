"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { destinations } from "@/data/destinations";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [isHovering, setIsHovering] = useState(false);
  const [activeDestination, setActiveDestination] = useState<string | null>(null);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black text-white"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });

        const closestDestination = destinations.find((destination) => {
          const distance = Math.sqrt(
            Math.pow(x - destination.mapPosition.x, 2) +
              Math.pow(y - destination.mapPosition.y, 2)
          );

          return distance < 6;
        });

        setActiveDestination(closestDestination?.slug ?? null);
        setIsHovering(true);
      }}
      onPointerLeave={() => {
        setIsHovering(false);
        setActiveDestination(null);
      }}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[140px] animate-aurora" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-sky-500/[0.035] blur-[140px] animate-aurora delay-300" />

      {/* Background world map */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out">
        <Image
          src="/images/world-map.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-center opacity-[0.14] md:object-right transition-transform duration-1000 ease-out hover:scale-102"
        />
      </div>

      {/* Clear map spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovering ? 1 : 0,
          maskImage: `radial-gradient(
            circle 220px at ${mousePosition.x}px ${mousePosition.y}px,
            black 0%,
            transparent 100%
          )`,
          WebkitMaskImage: `radial-gradient(
            circle 220px at ${mousePosition.x}px ${mousePosition.y}px,
            black 0%,
            transparent 100%
          )`,
        }}
      >
        <Image
          src="/images/world-map.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-center opacity-85 md:object-right"
        />
      </div>

      {/* Destination points on the interactive map */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {destinations.map((destination) => {
          const isActive = activeDestination === destination.slug;

          return (
            <div
              key={destination.slug}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isActive ? "pointer-events-auto z-30 scale-110" : "pointer-events-auto opacity-70 hover:opacity-100"
              }`}
              style={{
                left: `${destination.mapPosition.x}%`,
                top: `${destination.mapPosition.y}%`,
              }}
              onMouseEnter={() => setActiveDestination(destination.slug)}
            >
              {/* Destination dot pin */}
              <Link
                href={`/explore/${destination.slug}`}
                className="relative block h-4 w-4 group/pin"
                aria-label={`Explore ${destination.name}`}
              >
                <span className={`absolute -inset-2 rounded-full bg-white/20 blur-sm transition-all duration-300 ${isActive ? "scale-125 bg-sky-400/30" : "animate-pulse"}`} />
                <span className={`relative block h-3 w-3 rounded-full border border-white transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-[0_0_25px_rgba(255,255,255,1)] scale-110"
                    : "bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)] group-hover/pin:scale-125"
                }`} />
              </Link>

              {/* Destination preview card when active */}
              {isActive && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 animate-fade-in">
                  <div className="w-64 overflow-hidden rounded-2xl border border-white/20 bg-neutral-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300">
                    <div className="relative h-28 w-full overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        sizes="256px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                      <span className="absolute top-2.5 right-2.5 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/80 backdrop-blur-md">
                        {destination.category}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {destination.country}
                      </p>
                      <h3 className="mt-0.5 text-base font-light text-white">
                        {destination.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                        {destination.tagline}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                        <span className="text-[10px] text-white/40">
                          {destination.temperature}
                        </span>
                        <Link
                          href={`/explore/${destination.slug}`}
                          className="flex items-center gap-1 text-xs text-white/80 transition-colors hover:text-white"
                        >
                          <span>Explore</span>
                          <span className="transition-transform duration-200 hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dark gradient edge */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black via-black/85 to-black/25" />

      {/* Hero content */}
      <div className="relative z-30 flex min-h-screen flex-col justify-center px-8 pb-16 pt-28 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                Your adventure starts here
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className="mt-6 text-5xl font-light leading-[1.02] tracking-tight md:text-7xl lg:text-8xl animate-fade-up opacity-0"
            style={{ animationDelay: "250ms" }}
          >
            Explore the world.
            <br />
            <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              Plan your adventure.
            </span>
          </h1>

          {/* Description */}
          <p
            className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/60 md:text-lg animate-fade-up opacity-0"
            style={{ animationDelay: "400ms" }}
          >
            Discover curated destinations, save your favorite places, and build your unforgettable trip with ease.
          </p>

          {/* CTA Group */}
          <div
            className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up opacity-0"
            style={{ animationDelay: "550ms" }}
          >
            <Link
              href="/explore"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm md:text-base font-light text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
            >
              <span>Explore destinations</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>

            <Link
              href="/plan"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-7 py-4 text-sm md:text-base font-light text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
            >
              <span>Start Planning</span>
            </Link>
          </div>
        </div>

        {/* Cursor hint */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3 text-xs md:text-sm text-white/40 md:left-16 lg:left-24 animate-fade-in delay-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/60" />
          <span>Hover pins across the map to discover places</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs md:text-sm text-white/40 md:flex animate-fade-in delay-600">
          <span>Scroll to explore</span>
          <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/30 p-1">
            <span className="h-1.5 w-1 animate-bounce rounded-full bg-white/80" />
          </span>
        </div>
      </div>
    </section>
  );
}