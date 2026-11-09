import { GeneratedItinerary, DaySchedule, ActivitySlot } from "./itineraryGenerator";

/**
 * Escapes characters for RFC 5545 iCalendar (ICS) format
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Formats a date & time as an ICS floating datetime: YYYYMMDDTHHMMSS
 */
function formatIcsDateTime(date: Date, hours: number, minutes: number = 0): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}00`;
}

/**
 * Resolves standard start and end times for period slots
 */
function getSlotHours(slot: ActivitySlot): { startH: number; startM: number; endH: number; endM: number } {
  // Check if slot has a recognizable hour in slot.time
  const match = slot.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return { startH: h, startM: m, endH: (h + 3) % 24, endM: m };
  }

  switch (slot.period) {
    case "Morning":
      return { startH: 9, startM: 0, endH: 12, endM: 30 };
    case "Afternoon":
      return { startH: 14, startM: 0, endH: 17, endM: 30 };
    case "Evening":
    default:
      return { startH: 19, startM: 0, endH: 21, endM: 30 };
  }
}

/**
 * Attempts to parse an initial start date from dateRangeText or defaults to tomorrow
 */
function resolveStartDate(dateRangeText: string): Date {
  const now = new Date();
  if (dateRangeText && !dateRangeText.includes("Flexible Dates")) {
    const parts = dateRangeText.split("–").map((p) => p.trim());
    const candidate = new Date(parts[0]);
    if (!isNaN(candidate.getTime())) {
      return candidate;
    }
  }
  // Default to 14 days from now if flexible, giving realistic future travel dates
  const defaultDate = new Date(now);
  defaultDate.setDate(defaultDate.getDate() + 14);
  return defaultDate;
}

/**
 * Generates RFC 5545 valid iCalendar (.ics) string for the itinerary
 */
export function generateIcsContent(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): string {
  const baseDate = resolveStartDate(itinerary.dateRangeText);
  const nowUtc = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const destination = itinerary.destination;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Triply//Travel Itinerary Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Triply - ${destination.name} Itinerary`,
    `X-WR-CALDESC:Custom day-by-day itinerary for ${destination.name}, ${destination.country}`,
  ];

  daysList.forEach((daySchedule, dayIndex) => {
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + dayIndex);

    daySchedule.slots.forEach((slot, slotIndex) => {
      const times = getSlotHours(slot);
      const dtStart = formatIcsDateTime(dayDate, times.startH, times.startM);
      const dtEnd = formatIcsDateTime(dayDate, times.endH, times.endM);
      const uid = `triply-${destination.slug}-d${daySchedule.day}-s${slotIndex}-${dayDate.getTime()}@triply.app`;

      const summary = `[${slot.period}] ${slot.title} • ${destination.name}`;
      const description = `${slot.description}\\n\\nCategory: ${slot.category}\\nScheduled: ${slot.time}\\nTheme: Day ${daySchedule.day} - ${daySchedule.theme}\\n\\nPlanned with Triply`;
      const location = slot.location ? `${slot.location}, ${destination.name}, ${destination.country}` : `${destination.name}, ${destination.country}`;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowUtc}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${escapeIcsText(summary)}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${escapeIcsText(location)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Downloads a generated file in the browser
 */
function triggerBrowserDownload(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Triggers download of the .ics calendar file
 */
export function downloadIcsFile(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): void {
  const ics = generateIcsContent(itinerary, daysList);
  const slug = itinerary.destination.slug || "trip";
  triggerBrowserDownload(`triply-${slug}-itinerary.ics`, ics, "text/calendar;charset=utf-8");
}

/**
 * Generates formatted Markdown string for the itinerary
 */
export function generateMarkdownContent(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): string {
  const { destination, durationDays, dateRangeText, interests, travelTips } = itinerary;

  const md: string[] = [
    `# ✈️ ${destination.name}, ${destination.country} — Travel Itinerary`,
    ``,
    `> **"${destination.tagline}"**`,
    ``,
    `### 📋 Journey Overview`,
    `- **Duration**: ${durationDays} Days`,
    `- **Travel Dates**: ${dateRangeText}`,
    `- **Expected Climate**: ${destination.temperature}`,
    `- **Travel Style / Interests**: ${interests.join(", ")}`,
    `- **Destination Rating**: ⭐ ${destination.rating} / 5.0`,
    ``,
    `---`,
    ``,
    `## 🗓️ Day-by-Day Schedule`,
    ``,
  ];

  daysList.forEach((daySchedule) => {
    md.push(`### Day ${daySchedule.day} (${daySchedule.dateLabel}): ${daySchedule.title}`);
    md.push(`*Theme: ${daySchedule.theme}*`);
    md.push(``);

    daySchedule.slots.forEach((slot) => {
      const icon =
        slot.period === "Morning" ? "🌅" : slot.period === "Afternoon" ? "☀️" : "🌙";
      md.push(`- **${icon} ${slot.period} (${slot.time})**: **${slot.title}**`);
      md.push(`  - *Category*: ${slot.category}`);
      if (slot.location) {
        md.push(`  - *Location*: 📍 ${slot.location}`);
      }
      md.push(`  - ${slot.description}`);
      md.push(``);
    });

    md.push(`---`);
    md.push(``);
  });

  if (travelTips) {
    md.push(`## 💡 Essential Travel Advice`);
    md.push(`- **Local Transport**: ${travelTips.transport}`);
    md.push(`- **Local Etiquette**: ${travelTips.localEtiquette}`);
    if (travelTips.packing && travelTips.packing.length > 0) {
      md.push(`- **Recommended Packing Highlights**:`);
      travelTips.packing.forEach((item) => {
        md.push(`  - [ ] ${item}`);
      });
    }
    md.push(``);
  }

  md.push(`*Generated with Triply — Discover. Plan. Explore.*`);
  return md.join("\n");
}

/**
 * Triggers download of the Markdown file
 */
export function downloadMarkdownFile(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): void {
  const md = generateMarkdownContent(itinerary, daysList);
  const slug = itinerary.destination.slug || "trip";
  triggerBrowserDownload(`triply-${slug}-itinerary.md`, md, "text/markdown;charset=utf-8");
}

/**
 * Generates formatted plain text for quick clipboard copying & chat sharing
 */
export function generatePlainTextSummary(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): string {
  const { destination, durationDays, dateRangeText } = itinerary;

  const lines: string[] = [
    `TRIPLY ITINERARY: ${destination.name.toUpperCase()}, ${destination.country.toUpperCase()}`,
    `Duration: ${durationDays} Days | Dates: ${dateRangeText} | Climate: ${destination.temperature}`,
    `"${destination.tagline}"`,
    `========================================`,
    ``,
  ];

  daysList.forEach((d) => {
    lines.push(`[DAY ${d.day}: ${d.title.toUpperCase()} (${d.dateLabel})]`);
    lines.push(`Theme: ${d.theme}`);
    d.slots.forEach((s) => {
      lines.push(`• ${s.period} (${s.time}): ${s.title}`);
      if (s.location) lines.push(`  Location: ${s.location}`);
      lines.push(`  ${s.description}`);
    });
    lines.push(``);
  });

  lines.push(`========================================`);
  lines.push(`Planned with Triply • Have a wonderful journey!`);
  return lines.join("\n");
}

/**
 * Triggers download of full JSON backup
 */
export function downloadJsonBackup(
  itinerary: GeneratedItinerary,
  daysList: DaySchedule[] = itinerary.days
): void {
  const data = {
    ...itinerary,
    days: daysList,
    exportedAt: new Date().toISOString(),
    generator: "Triply Itinerary Planner",
  };
  const json = JSON.stringify(data, null, 2);
  const slug = itinerary.destination.slug || "trip";
  triggerBrowserDownload(`triply-${slug}-backup.json`, json, "application/json;charset=utf-8");
}

/**
 * Native share or clipboard copy helper
 */
export async function shareItinerary(
  itinerary: GeneratedItinerary
): Promise<{ shared: boolean; method: "native" | "clipboard" }> {
  if (typeof window === "undefined") return { shared: false, method: "clipboard" };

  const shareData = {
    title: `${itinerary.destination.name} Trip Plan | Triply`,
    text: `Check out my ${itinerary.durationDays}-day travel itinerary for ${itinerary.destination.name}, ${itinerary.destination.country}!`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { shared: true, method: "native" };
    } catch {
      // User cancelled share sheet or error
    }
  }

  // Fallback to clipboard
  await navigator.clipboard.writeText(window.location.href);
  return { shared: true, method: "clipboard" };
}

