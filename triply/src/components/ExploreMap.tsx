"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { destinations as allDestinations } from "@/data/destinations";
import { CONTINENTS, STATES_AND_REGIONS, ContinentData, StateRegionData } from "@/data/mapHierarchy";

type Destination = (typeof allDestinations)[number];
type Place = Destination["places"][number];

interface ExploreMapProps {
  destinations: Destination[];
}

const PLACE_OFFSETS = [
  { dx: -2.8, dy: -2.2 },
  { dx: 3.2, dy: -1.0 },
  { dx: 0.8, dy: 3.0 },
  { dx: -2.5, dy: 2.2 },
];

export default function ExploreMap({ destinations }: ExploreMapProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    destinations.length > 0 ? destinations[0].slug : null
  );
  const [selectedPlace, setSelectedPlace] = useState<{
    destination: Destination;
    place: Place;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<StateRegionData | null>(null);

  // Zoom & Pan state (Range: 1.0x to 4.5x)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; panX: number; panY: number }>({
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const selectedDestination =
    destinations.find((d) => d.slug === selectedSlug) || destinations[0] || null;

  const categoryColors: Record<string, { bg: string; text: string; glow: string; border: string }> = {
    Nature: { bg: "bg-emerald-500", text: "text-emerald-400", glow: "rgba(16, 185, 129, 0.7)", border: "border-emerald-400" },
    Mountains: { bg: "bg-cyan-500", text: "text-cyan-400", glow: "rgba(6, 182, 212, 0.7)", border: "border-cyan-400" },
    Cities: { bg: "bg-amber-500", text: "text-amber-400", glow: "rgba(245, 158, 11, 0.7)", border: "border-amber-400" },
    Coastal: { bg: "bg-sky-500", text: "text-sky-400", glow: "rgba(14, 165, 233, 0.7)", border: "border-sky-400" },
  };

  // Zoom buttons
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedPlace(null);
    setSelectedState(null);
  };

  // Set specific hierarchy level
  const setHierarchyLevel = (level: "continents" | "countries" | "states" | "cities") => {
    setSelectedPlace(null);
    setSelectedState(null);
    switch (level) {
      case "continents":
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
        break;
      case "countries":
        setZoom(1.8);
        setPan({ x: 0, y: 0 });
        break;
      case "states":
        setZoom(2.8);
        break;
      case "cities":
        setZoom(3.8);
        break;
    }
  };

  // Focus a continent
  const focusContinent = (continent: ContinentData) => {
    setZoom(continent.zoomTarget.zoom);
    setPan({ x: continent.zoomTarget.panX, y: continent.zoomTarget.panY });
    setSelectedPlace(null);
    setSelectedState(null);
  };

  // Focus a destination
  const focusDestination = useCallback((dest: Destination) => {
    setSelectedSlug(dest.slug);
    setSelectedPlace(null);
    setSelectedState(null);
    setZoom(3.2);
    const targetX = (50 - dest.mapPosition.x) * 5.5;
    const targetY = (50 - dest.mapPosition.y) * 5.5;
    setPan({
      x: Math.max(-320, Math.min(320, targetX)),
      y: Math.max(-220, Math.min(220, targetY)),
    });
  }, []);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const maxPan = (zoom - 1) * 260;
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panX + dx)),
      y: Math.max(-maxPan * 0.75, Math.min(maxPan * 0.75, dragStartRef.current.panY + dy)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.3, 4.5));
    } else {
      setZoom((prev) => {
        const next = Math.max(prev - 0.3, 1);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Progressive Opacity Calculations (Multi-tier semantic zoom)
  // 1. Continents: 1.0x to 1.6x
  const continentOpacity = Math.max(0, Math.min(1, (1.6 - zoom) / 0.45));
  const showContinents = continentOpacity > 0.05;

  // 2. Countries: 1.2x to 3.6x
  const countryOpacity =
    zoom < 1.3
      ? Math.max(0.3, (zoom - 0.8) / 0.5)
      : zoom > 3.4
      ? Math.max(0.35, 1 - (zoom - 3.4) * 0.5)
      : 1;

  // 3. States & Provinces: 1.9x to 4.5x
  const stateOpacity = Math.max(0, Math.min(1, (zoom - 1.8) / 0.65));
  const showStates = stateOpacity > 0.05;

  // 4. Cities & Places: 2.7x to 4.5x
  const cityOpacity = Math.max(0, Math.min(1, (zoom - 2.6) / 0.8));
  const showCities = cityOpacity > 0.05;

  const currentLevelLabel =
    zoom < 1.4
      ? "Level 1: Continents"
      : zoom < 2.3
      ? "Level 2: Countries"
      : zoom < 3.2
      ? "Level 3: States & Provinces"
      : "Level 4: Cities & Attractions";

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-neutral-950 shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-fade-in">
      {/* Top Header: Hierarchy Breadcrumb & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl gap-3">
        {/* Tier Breadcrumb Navigator */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1 hidden lg:inline">
            Zoom Level:
          </span>

          <button
            type="button"
            onClick={() => setHierarchyLevel("continents")}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all duration-200 ${
              zoom < 1.4
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            1. Continents
          </button>
          <span className="text-white/20 text-xs">›</span>

          <button
            type="button"
            onClick={() => setHierarchyLevel("countries")}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all duration-200 ${
              zoom >= 1.4 && zoom < 2.3
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            2. Countries
          </button>
          <span className="text-white/20 text-xs">›</span>

          <button
            type="button"
            onClick={() => setHierarchyLevel("states")}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all duration-200 ${
              zoom >= 2.3 && zoom < 3.2
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            3. States / Regions
          </button>
          <span className="text-white/20 text-xs">›</span>

          <button
            type="button"
            onClick={() => setHierarchyLevel("cities")}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all duration-200 ${
              zoom >= 3.2
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            4. Cities & Places
          </button>
        </div>

        {/* Zoom Controls Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full hidden sm:inline">
            {currentLevelLabel}
          </span>

          <div className="flex items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5 backdrop-blur-md">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="px-2 text-xs font-mono text-white/70 min-w-10 text-center">
              {zoom.toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 4.5}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white transition"
            title="Reset to 1x view"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Map Canvas Stage */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative h-[580px] sm:h-[640px] lg:h-[720px] w-full overflow-hidden bg-black select-none ${
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
      >
        {/* Subtle coordinate grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-0 h-full w-px border-l border-dashed border-white/20" />
          <div className="absolute left-2/4 top-0 h-full w-px border-l border-dashed border-white/30" />
          <div className="absolute left-3/4 top-0 h-full w-px border-l border-dashed border-white/20" />
          <div className="absolute top-1/3 left-0 w-full h-px border-t border-dashed border-white/20" />
          <div className="absolute top-2/3 left-0 w-full h-px border-t border-dashed border-white/20" />
        </div>

        {/* Ambient atmospheric lighting */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-[120px] animate-aurora" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-sky-500/[0.035] blur-[120px] animate-aurora delay-300" />

        {/* Zoom & Pan Animated World Layer */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "50% 50%",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* World Map Vector Base */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div className="relative h-full w-full">
              <Image
                src="/images/world-map.png"
                alt="World Map"
                fill
                priority
                sizes="100vw"
                className="object-contain object-center opacity-30 brightness-110"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* TIER 1: CONTINENT LABELS (Visible at Zoom 1.0x - 1.5x)    */}
          {/* ======================================================== */}
          {showContinents && (
            <div
              className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
              style={{ opacity: continentOpacity }}
            >
              {CONTINENTS.map((continent) => (
                <div
                  key={continent.id}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${continent.x}%`,
                    top: `${continent.y}%`,
                  }}
                  onClick={() => focusContinent(continent)}
                >
                  <div className="flex flex-col items-center">
                    <span className="rounded-full border border-white/25 bg-black/70 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-white/60 group-hover:bg-white group-hover:text-black">
                      {continent.name}
                    </span>
                    <span className="mt-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80">
                      {continent.destinationsCount} Destinations ›
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIER 2: COUNTRIES / DESTINATIONS (Zoom 1.2x - 4.5x)      */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: countryOpacity }}
          >
            {destinations.map((dest) => {
              const isSelected = selectedSlug === dest.slug;
              const colors = categoryColors[dest.category] || categoryColors.Nature;

              return (
                <div
                  key={dest.slug}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                  style={{
                    left: `${dest.mapPosition.x}%`,
                    top: `${dest.mapPosition.y}%`,
                    zIndex: isSelected ? 30 : 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusDestination(dest);
                  }}
                >
                  <div className="group relative flex flex-col items-center">
                    {/* Selected Radar Ping */}
                    {isSelected && (
                      <span
                        className="absolute -inset-3.5 rounded-full animate-ping opacity-60 pointer-events-none"
                        style={{ backgroundColor: colors.glow }}
                      />
                    )}

                    {/* Country Pin Dot */}
                    <div
                      className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isSelected
                          ? "h-7 w-7 border-white bg-white text-black shadow-[0_0_25px_rgba(255,255,255,1)] scale-110"
                          : "h-5 w-5 border-white/60 bg-neutral-900/95 hover:scale-125 hover:border-white hover:bg-white hover:text-black shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                      }`}
                      style={{
                        transform: `scale(${1 / Math.sqrt(zoom)})`,
                      }}
                    >
                      <span className="text-[10px] font-bold">
                        {isSelected ? "✦" : "•"}
                      </span>
                    </div>

                    {/* Country Name Tag */}
                    <span
                      className={`mt-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-md transition-all duration-200 ${
                        isSelected
                          ? "border border-white/40 bg-white text-black shadow-lg font-semibold"
                          : "border border-white/10 bg-black/85 text-white/80 group-hover:border-white/30 group-hover:text-white"
                      }`}
                      style={{
                        transform: `scale(${1 / Math.sqrt(zoom)})`,
                      }}
                    >
                      {dest.name} ({dest.country})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* TIER 3: STATES, PROVINCES & REGIONS (Zoom 1.9x - 4.5x)    */}
          {/* ======================================================== */}
          {showStates && (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: stateOpacity,
                pointerEvents: stateOpacity > 0.3 ? "auto" : "none",
              }}
            >
              {STATES_AND_REGIONS.map((stateRegion) => {
                const parentDest = destinations.find(
                  (d) => d.slug === stateRegion.destinationSlug
                );
                if (!parentDest) return null;

                const isStateActive = selectedState?.id === stateRegion.id;

                return (
                  <div
                    key={stateRegion.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-15"
                    style={{
                      left: `${stateRegion.x}%`,
                      top: `${stateRegion.y}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlug(parentDest.slug);
                      setSelectedState(stateRegion);
                      setSelectedPlace(null);
                      setZoom(3.5);
                    }}
                  >
                    <div className="group/state relative flex items-center gap-1.5">
                      {/* Region Dot Marker */}
                      <span
                        className={`h-2.5 w-2.5 rounded-full border transition-all duration-200 ${
                          isStateActive
                            ? "border-amber-300 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-125"
                            : "border-white/40 bg-amber-400/30 group-hover/state:scale-125 group-hover/state:bg-amber-400"
                        }`}
                        style={{
                          transform: `scale(${1 / Math.sqrt(zoom)})`,
                        }}
                      />

                      {/* State / Province Label Badge */}
                      <span
                        className={`whitespace-nowrap rounded-lg px-2 py-0.5 text-[9px] font-mono tracking-wider transition-all duration-200 ${
                          isStateActive
                            ? "border border-amber-400/50 bg-amber-950/90 text-amber-200 font-bold shadow-md"
                            : "border border-white/10 bg-black/85 text-amber-100/70 group-hover/state:border-amber-400/40 group-hover/state:text-white"
                        }`}
                        style={{
                          transform: `scale(${1 / Math.sqrt(zoom)})`,
                        }}
                      >
                        {stateRegion.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* TIER 4: CITIES, ATTRACTIONS & PLACES (Zoom 2.7x - 4.5x)   */}
          {/* ======================================================== */}
          {showCities && (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: cityOpacity,
                pointerEvents: cityOpacity > 0.3 ? "auto" : "none",
              }}
            >
              {destinations.map((dest) =>
                dest.places.map((place, pIdx) => {
                  const offset = PLACE_OFFSETS[pIdx % PLACE_OFFSETS.length];
                  const placeX = dest.mapPosition.x + offset.dx;
                  const placeY = dest.mapPosition.y + offset.dy;
                  const isPlaceSelected = selectedPlace?.place.name === place.name;

                  return (
                    <div
                      key={place.name}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-25"
                      style={{
                        left: `${placeX}%`,
                        top: `${placeY}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlug(dest.slug);
                        setSelectedPlace({ destination: dest, place });
                        setSelectedState(null);
                      }}
                    >
                      <div className="group/place relative flex items-center gap-1.5">
                        {/* Micro Place Pin Dot */}
                        <span
                          className={`flex h-3 w-3 items-center justify-center rounded-full border transition-all duration-200 ${
                            isPlaceSelected
                              ? "border-emerald-300 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.9)] scale-125"
                              : "border-white/40 bg-white/20 group-hover/place:border-white group-hover/place:bg-white group-hover/place:scale-125"
                          }`}
                          style={{
                            transform: `scale(${1 / Math.sqrt(zoom)})`,
                          }}
                        />

                        {/* City / Landmark Label Badge */}
                        <span
                          className={`whitespace-nowrap rounded-lg px-2 py-0.5 text-[10px] font-light transition-all duration-200 ${
                            isPlaceSelected
                              ? "border border-emerald-400/40 bg-emerald-950/95 text-emerald-200 shadow-md font-medium"
                              : "border border-white/10 bg-black/90 text-white/70 group-hover/place:border-white/30 group-hover/place:text-white"
                          }`}
                          style={{
                            transform: `scale(${1 / Math.sqrt(zoom)})`,
                          }}
                        >
                          📍 {place.name}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Floating Zoom Navigation Hint */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[11px] text-white/50 backdrop-blur-md">
          <span>Scroll wheel / buttons to zoom</span>
          <span>•</span>
          <span>Drag to pan across the world</span>
        </div>

        {/* Selected City / Place Spotlight Card (Tier 4) */}
        {selectedPlace && (
          <div className="absolute top-4 left-4 sm:left-6 z-40 max-w-sm w-full animate-fade-in">
            <div className="overflow-hidden rounded-3xl border border-emerald-400/30 bg-neutral-950/95 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">📍</span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-medium">
                    City / Landmark in {selectedPlace.destination.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="h-6 w-6 rounded-full text-white/40 hover:bg-white/10 hover:text-white text-xs flex items-center justify-center transition"
                  aria-label="Close place card"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 flex gap-3.5">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={selectedPlace.place.image}
                    alt={selectedPlace.place.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-white">
                    {selectedPlace.place.name}
                  </h4>
                  <p className="mt-1 text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {selectedPlace.place.description}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/10">
                <Link
                  href={`/explore/${selectedPlace.destination.slug}`}
                  className="text-xs text-white/70 hover:text-white transition flex items-center gap-1"
                >
                  <span>View Guide</span>
                  <span>→</span>
                </Link>
                <Link
                  href={`/plan/${selectedPlace.destination.slug}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black hover:bg-neutral-200 transition"
                >
                  Plan Trip
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Selected Destination Spotlight Card (Tier 2/3) */}
        {selectedDestination && !selectedPlace && (
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 max-w-sm sm:max-w-md w-full animate-fade-in">
            <div className="group overflow-hidden rounded-3xl border border-white/20 bg-neutral-950/95 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <span className="absolute top-2 left-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white backdrop-blur-md">
                    {selectedDestination.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                        {selectedDestination.country}
                      </p>
                      <span className="text-xs text-amber-300">★ {selectedDestination.rating}</span>
                    </div>

                    <h3 className="mt-1 text-lg sm:text-xl font-light text-white truncate">
                      {selectedDestination.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs font-light text-white/60 leading-relaxed">
                      {selectedDestination.tagline}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs text-white/50 font-mono">
                      {selectedDestination.temperature}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-emerald-400/90 font-medium">
                      {selectedDestination.places.length} places (zoom in to reveal)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Link
                  href={`/explore/${selectedDestination.slug}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-white hover:text-black"
                >
                  Explore Guide →
                </Link>

                <Link
                  href={`/plan/${selectedDestination.slug}`}
                  className="rounded-full bg-white px-3 py-2 text-center text-xs font-medium text-black transition hover:bg-neutral-200"
                >
                  Plan Trip →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Horizontal Quick Continent & Country Jump Dock */}
      <div className="border-t border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-white/30 flex-shrink-0 mr-1 hidden sm:inline">
            Quick Jump:
          </span>

          {/* Continent Jump Buttons */}
          {CONTINENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => focusContinent(c)}
              className="flex-shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-white/70 hover:border-white/30 hover:bg-white hover:text-black transition"
            >
              🌍 {c.name}
            </button>
          ))}

          <span className="text-white/20 mx-1 flex-shrink-0">|</span>

          {/* Country/Destination Jump Buttons */}
          {destinations.map((dest) => {
            const isSelected = selectedSlug === dest.slug;
            return (
              <button
                key={dest.slug}
                type="button"
                onClick={() => focusDestination(dest)}
                className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "border border-white/40 bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "border border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white"
                }`}
              >
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
