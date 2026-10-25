// Helper for managing saved destinations and bucket list trips in localStorage
import { TravelStyle } from "./budgetData";

export const SAVED_STORAGE_KEY = "triply_saved_destinations";
export const SAVED_CHANGE_EVENT = "triply-saved-change";

export type TripPriority = "must-visit" | "dream" | "planned";

export interface SavedTripItem {
  slug: string;
  savedAt: string;
  targetDate?: string;
  notes?: string;
  plannedDays?: number;
  travelers?: number;
  style?: TravelStyle;
  priority?: TripPriority;
}

function normalizeRawItem(item: unknown): SavedTripItem | null {
  if (typeof item === "string" && item.trim()) {
    return {
      slug: item.trim(),
      savedAt: new Date().toISOString(),
      priority: "dream",
      plannedDays: 5,
      travelers: 2,
      style: "comfort",
    };
  }
  if (item && typeof item === "object" && "slug" in item && typeof (item as SavedTripItem).slug === "string") {
    const raw = item as SavedTripItem;
    return {
      slug: raw.slug,
      savedAt: raw.savedAt || new Date().toISOString(),
      targetDate: raw.targetDate,
      notes: raw.notes,
      plannedDays: typeof raw.plannedDays === "number" ? raw.plannedDays : 5,
      travelers: typeof raw.travelers === "number" ? raw.travelers : 2,
      style: raw.style || "comfort",
      priority: raw.priority || "dream",
    };
  }
  return null;
}

export function getSavedTrips(): SavedTripItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeRawItem)
      .filter((item): item is SavedTripItem => item !== null);
  } catch {
    return [];
  }
}

export function getSavedSlugs(): string[] {
  return getSavedTrips().map((t) => t.slug);
}

let cachedTrips: SavedTripItem[] = [];
let cachedRaw: string | null = null;

export function getSavedSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SAVED_STORAGE_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedTrips = parsed
          .map(normalizeRawItem)
          .filter((t): t is SavedTripItem => t !== null);
      } else {
        cachedTrips = [];
      }
    } catch {
      cachedTrips = [];
    }
  }
  return cachedTrips.map((t) => t.slug);
}

export function getSavedTripsSnapshot(): SavedTripItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SAVED_STORAGE_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedTrips = parsed
          .map(normalizeRawItem)
          .filter((t): t is SavedTripItem => t !== null);
      } else {
        cachedTrips = [];
      }
    } catch {
      cachedTrips = [];
    }
  }
  return cachedTrips;
}

const SERVER_SNAPSHOT: string[] = [];
const SERVER_TRIPS_SNAPSHOT: SavedTripItem[] = [];

export function getSavedServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

export function getSavedTripsServerSnapshot(): SavedTripItem[] {
  return SERVER_TRIPS_SNAPSHOT;
}

export function subscribeSaved(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SAVED_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SAVED_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function isSaved(slug: string): boolean {
  if (!slug) return false;
  const list = getSavedSlugs();
  return list.includes(slug);
}

export function saveTripItem(
  slug: string,
  data?: Partial<Omit<SavedTripItem, "slug">>
): SavedTripItem {
  if (typeof window === "undefined" || !slug) {
    return { slug, savedAt: new Date().toISOString() };
  }

  const trips = getSavedTrips();
  const existingIndex = trips.findIndex((t) => t.slug === slug);

  let updatedItem: SavedTripItem;
  let updatedList: SavedTripItem[];

  if (existingIndex >= 0) {
    updatedItem = {
      ...trips[existingIndex],
      ...data,
      slug,
    };
    updatedList = [...trips];
    updatedList[existingIndex] = updatedItem;
  } else {
    updatedItem = {
      slug,
      savedAt: new Date().toISOString(),
      priority: data?.priority || "dream",
      plannedDays: data?.plannedDays || 5,
      travelers: data?.travelers || 2,
      style: data?.style || "comfort",
      notes: data?.notes || "",
      targetDate: data?.targetDate || "",
      ...data,
    };
    updatedList = [updatedItem, ...trips];
  }

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // quota error
  }

  window.dispatchEvent(
    new CustomEvent(SAVED_CHANGE_EVENT, {
      detail: { slug, saved: true, item: updatedItem, all: updatedList },
    })
  );
  return updatedItem;
}

export function updateTripItem(
  slug: string,
  updates: Partial<Omit<SavedTripItem, "slug">>
): void {
  if (typeof window === "undefined" || !slug) return;
  const trips = getSavedTrips();
  const idx = trips.findIndex((t) => t.slug === slug);
  if (idx < 0) return;

  const updatedItem = {
    ...trips[idx],
    ...updates,
  };
  const updatedList = [...trips];
  updatedList[idx] = updatedItem;

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // quota error
  }

  window.dispatchEvent(
    new CustomEvent(SAVED_CHANGE_EVENT, {
      detail: { slug, saved: true, item: updatedItem, all: updatedList },
    })
  );
}

export function toggleSaved(slug: string): boolean {
  if (typeof window === "undefined" || !slug) return false;
  const trips = getSavedTrips();
  const exists = trips.some((t) => t.slug === slug);

  if (exists) {
    removeSaved(slug);
    return false;
  } else {
    saveTripItem(slug);
    return true;
  }
}

export function removeSaved(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  const trips = getSavedTrips();
  const updatedList = trips.filter((s) => s.slug !== slug);

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  window.dispatchEvent(
    new CustomEvent(SAVED_CHANGE_EVENT, {
      detail: { slug, saved: false, all: updatedList },
    })
  );
}

export function clearAllSavedTrips(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify([]));
  } catch {
    // ignore
  }
  window.dispatchEvent(
    new CustomEvent(SAVED_CHANGE_EVENT, {
      detail: { slug: null, saved: false, all: [] },
    })
  );
}
