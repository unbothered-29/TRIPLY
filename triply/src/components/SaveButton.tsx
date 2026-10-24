"use client";

import { useSyncExternalStore } from "react";
import {
  toggleSaved,
  subscribeSaved,
  getSavedSnapshot,
  getSavedServerSnapshot,
} from "@/lib/savedStorage";
import { showToast } from "@/components/ui/Toast";

interface SaveButtonProps {
  slug?: string;
  className?: string;
}

export default function SaveButton({ slug, className }: SaveButtonProps) {
  const savedSlugs = useSyncExternalStore(
    subscribeSaved,
    getSavedSnapshot,
    getSavedServerSnapshot
  );

  const saved = slug ? savedSlugs.includes(slug) : false;

  const handleToggle = () => {
    if (slug) {
      const next = toggleSaved(slug);
      showToast({
        title: next ? "Saved to your favorites!" : "Removed from favorites",
        description: next ? "Accessible anytime from the saved dock in the navigation bar." : undefined,
        type: next ? "success" : "neutral",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={
        className ||
        `group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium backdrop-blur-md transition-all duration-300 ${
          saved
            ? "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
            : "border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white hover:text-black"
        }`
      }
    >
      <span
        className={`text-base transition-transform duration-300 ${
          saved ? "scale-110 text-rose-400" : "group-hover:scale-110"
        }`}
      >
        {saved ? "♥" : "♡"}
      </span>
      <span>{saved ? "Saved" : "Save destination"}</span>
    </button>
  );
}