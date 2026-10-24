"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { isSaved, toggleSaved, subscribeSaved, getSavedSnapshot, getSavedServerSnapshot } from "@/lib/savedStorage";
import { showToast } from "@/components/ui/Toast";
import TripBudgetCalculator from "@/components/TripBudgetCalculator";

type Destination = (typeof destinations)[number];

export const QUICKVIEW_EVENT = "triply-open-quickview";

export function openQuickView(slug: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(QUICKVIEW_EVENT, { detail: { slug } }));
  }
}

export default function DestinationQuickViewModal() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBudgetTab, setShowBudgetTab] = useState(false);

  // Listen for open events
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug: string }>;
      if (customEvent.detail?.slug) {
        setActiveSlug(customEvent.detail.slug);
        setSelectedImageIndex(0);
        setShowBudgetTab(false);
      }
    };

    window.addEventListener(QUICKVIEW_EVENT, handleOpen);
    return () => window.removeEventListener(QUICKVIEW_EVENT, handleOpen);
  }, []);

  // Keyboard close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveSlug(null);
      }
    };
    if (activeSlug) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlug]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSlug]);

  if (!activeSlug) return null;

  const destination = destinations.find((d) => d.slug === activeSlug);
  if (!destination) return null;

  const allImages = [
    { url: destination.image, label: `${destination.name} Panorama` },
    ...destination.places.map((p) => ({ url: p.image, label: p.name })),
  ];

  const currentImage = allImages[selectedImageIndex] || allImages[0];
  const saved = isSaved(destination.slug);

  const handleToggleSave = () => {
    const next = toggleSaved(destination.slug);
    showToast({
      title: next ? "Saved to your favorites!" : "Removed from saved",
      description: `${destination.name} ${next ? "can now be accessed from your saved dock." : "removed."}`,
      type: next ? "success" : "neutral",
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-destination-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={() => setActiveSlug(null)}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] border border-white/20 bg-neutral-950/95 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveSlug(null)}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/70 backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black active:scale-95"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header Media Spotlight */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <Image
            src={currentImage.url}
            alt={currentImage.label}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-black/50" />

          {/* Quick Details Floating in Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                  {destination.category}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                  {destination.country}
                </span>
              </div>
              <h2 id="modal-destination-title" className="mt-2 text-4xl sm:text-5xl font-light tracking-tight text-white">
                {destination.name}
              </h2>
            </div>

            {/* Rating & Weather */}
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl border border-white/15 bg-black/60 px-4 py-2 backdrop-blur-md text-center">
                <span className="text-xs text-amber-300">★ {destination.rating}</span>
                <p className="text-[9px] uppercase tracking-wider text-white/50">Rating</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/60 px-4 py-2 backdrop-blur-md text-center">
                <span className="text-xs text-sky-300 font-mono">{destination.temperature}</span>
                <p className="text-[9px] uppercase tracking-wider text-white/50">Temp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Carousel */}
        <div className="border-b border-white/10 bg-neutral-900/40 px-6 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
            Explore Visuals ({allImages.length} shots)
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                  selectedImageIndex === idx
                    ? "border-emerald-400 ring-2 ring-emerald-400/50 scale-105"
                    : "border-white/15 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={img.label} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* Tagline & Description */}
          <p className="text-lg font-light text-white/90 leading-relaxed italic">
            &ldquo;{destination.tagline}&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/60 font-light leading-relaxed">
            {destination.description}
          </p>

          {/* Interactive Mode Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setShowBudgetTab(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                !showBudgetTab
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Attractions & Places
            </button>
            <button
              type="button"
              onClick={() => setShowBudgetTab(true)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                showBudgetTab
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Estimated Budget & Cost
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {!showBudgetTab ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {destination.places.map((place) => (
                  <div
                    key={place.name}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05]"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-white">{place.name}</h3>
                    <p className="mt-1 text-xs text-white/50 leading-relaxed line-clamp-2 font-light">
                      {place.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <TripBudgetCalculator
                  initialDestinationSlug={destination.slug}
                  initialDays={5}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Actions Bottom Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-300 active:scale-95 ${
                saved
                  ? "border-rose-400/50 bg-rose-500/20 text-rose-300"
                  : "border-white/15 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <span>{saved ? "❤️ Saved in Favorites" : "🤍 Save to Favorites"}</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                href={`/explore/${destination.slug}`}
                onClick={() => setActiveSlug(null)}
                className="rounded-full border border-white/15 px-5 py-2.5 text-xs text-white/80 transition hover:border-white/40 hover:bg-white/10"
              >
                View Full Guide
              </Link>
              <Link
                href={`/plan/${destination.slug}`}
                onClick={() => setActiveSlug(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition hover:bg-neutral-200 active:scale-95"
              >
                <span>Plan Trip Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
