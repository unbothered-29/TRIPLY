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

  const [activeDestination, setActiveDestination] = useState<
    string | null
  >(null);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black text-white"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) / rect.width) * 100;

        const y =
          ((event.clientY - rect.top) / rect.height) * 100;

        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });

        const closestDestination = destinations.find(
          (destination) => {
            const distance = Math.sqrt(
              Math.pow(x - destination.mapPosition.x, 2) +
                Math.pow(y - destination.mapPosition.y, 2)
            );

            return distance < 5;
          }
        );

        setActiveDestination(
          closestDestination?.slug ?? null
        );

        setIsHovering(true);
      }}
      onPointerLeave={() => {
        setIsHovering(false);
        setActiveDestination(null);
      }}
    >
      {/* Background world map */}

      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/world-map.png"
          alt=""
          fill
          priority
          className="object-contain object-center opacity-[0.10] md:object-right"
        />
      </div>

      {/* Clear map spotlight */}

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,

          maskImage: `radial-gradient(
            circle 190px at ${mousePosition.x}px ${mousePosition.y}px,
            black 0%,
            transparent 100%
          )`,

          WebkitMaskImage: `radial-gradient(
            circle 190px at ${mousePosition.x}px ${mousePosition.y}px,
            black 0%,
            transparent 100%
          )`,
        }}
      >
        <Image
          src="/images/world-map.png"
          alt=""
          fill
          className="object-contain object-center opacity-70 md:object-right"
        />
      </div>

      {/* Destination points */}

      <div className="pointer-events-none absolute inset-0 z-20">
        {destinations.map((destination) => {
          const isActive =
            activeDestination === destination.slug;

          if (!isActive) {
            return null;
          }

          return (
            <div
              key={destination.slug}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${destination.mapPosition.x}%`,
                top: `${destination.mapPosition.y}%`,
              }}
              onMouseEnter={() =>
                setActiveDestination(destination.slug)
              }
            >
              {/* Destination dot */}

              <Link
                href={`/explore/${destination.slug}`}
                className="relative block h-3 w-3"
              >
                <span className="absolute -inset-3 animate-pulse rounded-full bg-white/30 blur-md" />

                <span className="relative block h-3 w-3 rounded-full border border-white bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
              </Link>

              {/* Destination name + card */}

              <div className="group absolute left-5 top-1/2 -translate-y-1/2">
                {/* Destination name */}

                <Link
                  href={`/explore/${destination.slug}`}
                  className="block whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-md transition duration-200 hover:bg-white hover:text-black"
                >
                  {destination.name}
                </Link>

                {/* Preview card */}

                <div
                  className="
                    invisible
                    absolute
                    left-0
                    top-full
                    mt-3
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/95
                    opacity-0
                    shadow-2xl
                    backdrop-blur-xl
                    transition-all
                    duration-200
                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  {/* Image */}

                  <div className="relative h-32 w-full">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  {/* Card content */}

                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {destination.country}
                    </p>

                    <h3 className="mt-1 text-lg font-light text-white">
                      {destination.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-white/50">
                      {destination.tagline}
                    </p>

                    <Link
                      href={`/explore/${destination.slug}`}
                      className="mt-4 block text-xs text-white/50 transition hover:text-white"
                    >
                      Explore destination →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dark gradient */}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black via-black/85 to-black/30" />

      {/* Hero content */}

      <div className="relative z-30 flex min-h-screen flex-col justify-center px-8 pb-16 pt-24 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* Eyebrow */}

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/50">
            Your adventure starts here
          </p>

          {/* Heading */}

          <h1 className="mt-5 text-5xl font-light leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
            Explore the world.
            <br />

            <span className="text-white/40">
              Plan your adventure.
            </span>
          </h1>

          {/* Description */}

          <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/60 md:text-lg">
            Discover amazing destinations, save your favorite
            places, and build your perfect trip.
          </p>

          {/* CTA */}

          <div className="mt-8">
            <Link
              href="/explore"
              className="inline-block rounded-full border border-white/30 px-7 py-3.5 text-base font-light text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Explore destinations →
            </Link>
          </div>
        </div>

        {/* Cursor hint */}

        <div className="absolute bottom-8 left-8 flex items-center gap-3 text-sm text-white/40 md:left-16 lg:left-24">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />

          <span>Move your cursor across the map</span>
        </div>

        {/* Scroll indicator */}

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-sm text-white/40 md:flex">
          <span>Scroll to explore</span>

          <span className="flex h-9 w-6 items-start justify-center rounded-full border border-white/30 p-1">
            <span className="h-1.5 w-1 animate-bounce rounded-full bg-white/60" />
          </span>
        </div>
      </div>
    </section>
  );
}