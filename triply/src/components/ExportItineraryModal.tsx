"use client";

import { useState, useEffect } from "react";
import { GeneratedItinerary, DaySchedule } from "@/lib/itineraryGenerator";
import {
  downloadIcsFile,
  downloadMarkdownFile,
  downloadJsonBackup,
  generatePlainTextSummary,
  generateMarkdownContent,
  shareItinerary,
} from "@/lib/itineraryExporter";
import { showToast } from "@/components/ui/Toast";

interface ExportItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: GeneratedItinerary;
  currentDays: DaySchedule[];
  onTriggerPrint: () => void;
}

export default function ExportItineraryModal({
  isOpen,
  onClose,
  itinerary,
  currentDays,
  onTriggerPrint,
}: ExportItineraryModalProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [activePreview, setActivePreview] = useState<"none" | "markdown" | "text">("none");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const destination = itinerary.destination;

  const handlePrint = () => {
    onClose();
    // Allow modal DOM teardown before triggering print dialog
    setTimeout(() => {
      onTriggerPrint();
    }, 150);
  };

  const handleIcs = () => {
    downloadIcsFile(itinerary, currentDays);
    showToast({
      title: "Calendar File (.ics) Downloaded!",
      description: "Open to import events into Apple Calendar, Google Calendar, or Outlook.",
      type: "success",
    });
  };

  const handleMarkdown = () => {
    downloadMarkdownFile(itinerary, currentDays);
    showToast({
      title: "Markdown (.md) Downloaded!",
      description: "Ready to import into Notion, Obsidian, or your favorite note app.",
      type: "success",
    });
  };

  const handleJson = () => {
    downloadJsonBackup(itinerary, currentDays);
    showToast({
      title: "JSON Backup Downloaded!",
      description: "Structured itinerary data exported.",
      type: "neutral",
    });
  };

  const handleCopyText = async () => {
    const text = generatePlainTextSummary(itinerary, currentDays);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      showToast({
        title: "Plan Copied to Clipboard!",
        description: "Formatted text ready to paste into chat, WhatsApp, or email.",
        type: "success",
      });
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      showToast({
        title: "Copy Failed",
        description: "Please allow clipboard permissions.",
        type: "neutral",
      });
    }
  };

  const handleShare = async () => {
    const res = await shareItinerary(itinerary);
    showToast({
      title: res.method === "native" ? "Shared Successfully!" : "Trip Link Copied!",
      description:
        res.method === "native"
          ? "Itinerary shared via device share sheet."
          : "Link copied to clipboard to send to travel companions.",
      type: "success",
    });
  };

  const previewContent =
    activePreview === "markdown"
      ? generateMarkdownContent(itinerary, currentDays)
      : activePreview === "text"
      ? generatePlainTextSummary(itinerary, currentDays)
      : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in print:hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/20 bg-neutral-950 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                📤
              </span>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                Export & Share Itinerary
              </p>
            </div>
            <h2 id="export-modal-title" className="mt-1.5 text-2xl font-light text-white">
              {destination.name}, {destination.country}
            </h2>
            <p className="mt-1 text-xs text-white/50">
              {itinerary.durationDays} Days • {itinerary.dateRangeText} • Choose your preferred format
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/60 transition hover:border-white/40 hover:bg-white hover:text-black"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {/* Option 1: PDF / Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              🖨️
            </div>
            <div>
              <h3 className="text-sm font-medium text-white flex items-center gap-1.5">
                Print / Save PDF
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                  Popular
                </span>
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Print or save a clean, dark-mode free travel booklet with day checklists.
              </p>
            </div>
          </button>

          {/* Option 2: iCalendar */}
          <button
            type="button"
            onClick={handleIcs}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              📅
            </div>
            <div>
              <h3 className="text-sm font-medium text-white flex items-center gap-1.5">
                Add to Calendar (.ics)
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[9px] font-semibold text-sky-400">
                  Sync
                </span>
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Import scheduled morning, afternoon & evening slots to Apple, Google or Outlook.
              </p>
            </div>
          </button>

          {/* Option 3: Copy Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              {copiedText ? "✓" : "📋"}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                {copiedText ? "Copied to Clipboard!" : "Copy Text Summary"}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Quick plain text summary ready to paste into WhatsApp, Slack, or email.
              </p>
            </div>
          </button>

          {/* Option 4: Markdown */}
          <button
            type="button"
            onClick={handleMarkdown}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              📝
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Markdown (.md)</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Download structured Markdown for Notion, Obsidian, Bear, or notes.
              </p>
            </div>
          </button>

          {/* Option 5: JSON Backup */}
          <button
            type="button"
            onClick={handleJson}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              💾
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">JSON Backup</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Full structured data backup including your customized activity slots.
              </p>
            </div>
          </button>

          {/* Option 6: Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-98"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl group-hover:bg-white group-hover:text-black transition-colors">
              🔗
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Share Trip Link</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                Share directly via native device share sheet or copy instant URL.
              </p>
            </div>
          </button>
        </div>

        {/* Live Preview Toggle */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40">
              Quick In-App Preview
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActivePreview(activePreview === "text" ? "none" : "text")}
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  activePreview === "text"
                    ? "bg-white text-black font-semibold"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() =>
                  setActivePreview(activePreview === "markdown" ? "none" : "markdown")
                }
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  activePreview === "markdown"
                    ? "bg-white text-black font-semibold"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                Markdown
              </button>
            </div>
          </div>

          {activePreview !== "none" && (
            <div className="mt-3 relative">
              <pre className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-white/70 select-all whitespace-pre-wrap">
                {previewContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

