/**
 * Shared color & theme utilities for Triply's "Nature & Aurora" palette.
 * Provides harmonious color coding for categories, climates, and ratings.
 */

export interface CategoryColorTheme {
  badge: string; // Tailwind classes for rounded pills
  text: string;  // Text color class
  glow: string;  // Hex/rgba string for box-shadows or radial gradients
  dot: string;   // Background color class for indicators
  icon: string;  // Matching unicode icon
}

export function getCategoryTheme(category?: string): CategoryColorTheme {
  const norm = (category || "").toLowerCase();

  if (norm.includes("nature")) {
    return {
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      text: "text-emerald-400",
      glow: "rgba(16, 185, 129, 0.5)",
      dot: "bg-emerald-400",
      icon: "🌿",
    };
  }
  if (norm.includes("mountain")) {
    return {
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      text: "text-cyan-400",
      glow: "rgba(6, 182, 212, 0.5)",
      dot: "bg-cyan-400",
      icon: "🏔️",
    };
  }
  if (norm.includes("culture") || norm.includes("historic")) {
    return {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      text: "text-amber-400",
      glow: "rgba(245, 158, 11, 0.5)",
      dot: "bg-amber-400",
      icon: "🏛️",
    };
  }
  if (norm.includes("coastal") || norm.includes("beach") || norm.includes("island")) {
    return {
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      text: "text-sky-400",
      glow: "rgba(14, 165, 233, 0.5)",
      dot: "bg-sky-400",
      icon: "🌊",
    };
  }
  if (norm.includes("adventure")) {
    return {
      badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      text: "text-orange-400",
      glow: "rgba(249, 115, 22, 0.5)",
      dot: "bg-orange-400",
      icon: "🧗",
    };
  }
  if (norm.includes("cit") || norm.includes("urban")) {
    return {
      badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      text: "text-violet-400",
      glow: "rgba(139, 92, 246, 0.5)",
      dot: "bg-violet-400",
      icon: "🌆",
    };
  }

  // Fallback
  return {
    badge: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    text: "text-teal-400",
    glow: "rgba(20, 184, 166, 0.5)",
    dot: "bg-teal-400",
    icon: "✦",
  };
}

export interface ClimateBadgeInfo {
  badge: string;
  icon: string;
  label: string;
}

export function getClimateBadge(temperatureStr: string): ClimateBadgeInfo {
  const parsed = parseInt(temperatureStr, 10);
  const temp = Number.isNaN(parsed) ? 15 : parsed;

  if (temp <= 10) {
    return {
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
      icon: "❄️",
      label: temperatureStr,
    };
  }
  if (temp >= 20) {
    return {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
      icon: "☀️",
      label: temperatureStr,
    };
  }
  return {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    icon: "⛅",
    label: temperatureStr,
  };
}

