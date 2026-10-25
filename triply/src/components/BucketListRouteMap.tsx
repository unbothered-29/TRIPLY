"use client";

import { useState } from "react";
import Image from "next/image";
import { destinations as allDestinations } from "@/data/destinations";
import { SavedTripItem } from "@/lib/savedStorage";

type Destination = (typeof allDestinations)[number];

interface BucketListRouteMapProps {
  savedTrips: SavedTripItem[];
  onSelectDestination?: (slug: string) => void;
  selectedSlug?: string | null;
}

export default function BucketListRouteMap({
  savedTrips,
  onSelectDestination,
  selectedSlug,
}: BucketListRouteMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Map saved items to their destination info
  const mappedPoints = savedTrips
    .map((item) => {
      const dest = allDestinations.find((d) => d.slug === item.slug);
      if (!dest) return null;
      return {
        ...item,
        dest,
        x: dest.mapPosition.x,
        y: dest.mapPosition.y,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  // Calculate approximate journey distance & stats
  let totalApproxKm = 0;
  for (let i = 0; i < mappedPoints.length - 1; i++) {
    const p1 = mappedPoints[i];
    const p2 = mappedPoints[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distUnits = Math.sqrt(dx * dx + dy * dy);
    // Rough world map scale: 100 units ≈ 20,000 km
    totalApproxKm += Math.round(distUnits * 240);
  }

  const approxFlightHours = Math.round(totalApproxKm / 800) || 0;
  const uniqueCountries = Array.from(new Set(mappedPoints.map((p) => p.dest.country)));

  // SVG dimensions (standard 1000x500 coordinates matching map percentages)
  const svgWidth = 1000;
  const svgHeight = 500;

  // Generate curved SVG quadratic paths connecting points sequentially
  const paths: { d: string; from: Destination; to: Destination }[] = [];
  for (let i = 0; i < mappedPoints.length - 1; i++) {
    const start = mappedPoints[i];
    const end = mappedPoints[i + 1];

    const sx = (start.x / 100) * svgWidth;
    const sy = (start.y / 100) * svgHeight;
    const ex = (end.x / 100) * svgWidth;
    const ey = (end.y / 100) * svgHeight;

    // Arched control point (curve upwards)
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2 - Math.min(Math.abs(ex - sx) * 0.35 + 40, 90);

    paths.push({
      d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`,
      from: start.dest,
      to: end.dest,
    });
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/80 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
      {/* Ambient background aura */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-sky-500/[0.05] blur-3xl" />

      {/* Header and Route Stats */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
              ✈
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Journey Route Visualizer
            </p>
          </div>
          <h3 className="mt-1.5 text-xl sm:text-2xl font-light text-white">
            {mappedPoints.length === 0
              ? "Your Flight Path & Route"
              : mappedPoints.length === 1
              ? `Single Destination (${mappedPoints[0].dest.name})`
              : `${mappedPoints.length}-Stop Global Odyssey`}
          </h3>
        </div>

        {/* Quick Route Stats Badges */}
        {mappedPoints.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block">Stops</span>
              <span className="font-medium text-white">{mappedPoints.length} Destinations</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block">Countries</span>
              <span className="font-medium text-white">{uniqueCountries.length} Countries</span>
            </div>

            {mappedPoints.length > 1 && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 block">
                  Est. Air Distance
                </span>
                <span className="font-medium text-emerald-300">
                  ~{totalApproxKm.toLocaleString()} km
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative mt-6 aspect-[2/1] min-h-[300px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        {/* World map background */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/world-map.png"
            alt="World Map"
            fill
            sizes="100vw"
            className="object-contain object-center opacity-30 select-none"
            priority
          />
        </div>

        {/* Radial spotlight effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

        {/* SVG Route Paths Layer */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="absolute inset-0 h-full w-full pointer-events-none"
        >
          <defs>
            <linearGradient id="flightPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background guide glow lines */}
          {paths.map((p, idx) => (
            <path
              key={`bg-${idx}`}
              d={p.d}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeOpacity="0.15"
              filter="url(#glow)"
            />
          ))}

          {/* Animated dashed flight paths */}
          {paths.map((p, idx) => (
            <path
              key={`line-${idx}`}
              d={p.d}
              fill="none"
              stroke="url(#flightPathGradient)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className="animate-shimmer"
              style={{
                strokeDashoffset: 100,
                animation: "routeDash 20s linear infinite",
              }}
            />
          ))}
        </svg>

        {/* CSS for path animation */}
        <style jsx>{`
          @keyframes routeDash {
            to {
              stroke-dashoffset: -400;
            }
          }
        `}</style>

        {/* Interactive Waypoint Pins */}
        {mappedPoints.map((point, index) => {
          const isSelected = selectedSlug === point.slug;
          const isHovered = hoveredSlug === point.slug;
          const isHighlight = isSelected || isHovered;

          return (
            <div
              key={point.slug}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onMouseEnter={() => setHoveredSlug(point.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={() => onSelectDestination?.(point.slug)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            >
              {/* Radar pulse ripple on active */}
              {isHighlight && (
                <div className="absolute -inset-2.5 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
              )}

              {/* Pin indicator */}
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                  isHighlight
                    ? "scale-125 border-emerald-400 bg-white text-black shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                    : "border-white/40 bg-neutral-900/90 text-white hover:scale-110 hover:border-white shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                }`}
              >
                <span className="text-[10px] font-bold">
                  {index + 1}
                </span>

                {/* Pulse dot inside */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              {/* Waypoint Tooltip Label */}
              <div
                className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-neutral-950/95 px-3 py-1.5 text-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 ${
                  isHighlight
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
                }`}
              >
                <p className="text-xs font-semibold text-white">
                  {point.dest.name}
                </p>
                <p className="text-[10px] text-emerald-400">
                  Stop #{index + 1} • {point.dest.country}
                </p>
                {point.targetDate && (
                  <p className="text-[9px] text-white/50">📅 {point.targetDate}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state overlay on map if no destinations saved */}
        {mappedPoints.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/40 backdrop-blur-xs">
            <span className="text-3xl mb-2">🗺️</span>
            <p className="text-sm font-medium text-white">Your Map Is Awaiting Adventures</p>
            <p className="mt-1 text-xs text-white/50 max-w-sm">
              Add destinations to your Bucket List to see your custom flight paths and route connect across the globe.
            </p>
          </div>
        )}
      </div>

      {/* Route Order Strip */}
      {mappedPoints.length > 1 && (
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-white/40 shrink-0">
            Journey Sequence:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {mappedPoints.map((p, idx) => (
              <div key={p.slug} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDestination?.(p.slug)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
                    selectedSlug === p.slug
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/40">#{idx + 1}</span>
                  <span>{p.dest.name}</span>
                </button>
                {idx < mappedPoints.length - 1 && (
                  <span className="text-xs text-white/30">➔</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
