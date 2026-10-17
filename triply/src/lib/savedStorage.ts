// Helper for managing saved destinations in localStorage with reactive updates
export const SAVED_STORAGE_KEY = "triply_saved_destinations";
export const SAVED_CHANGE_EVENT = "triply-saved-change";

export function getSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cachedSlugs: string[] = [];
let cachedRaw: string | null = null;

export function getSavedSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SAVED_STORAGE_KEY) || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw);
      cachedSlugs = Array.isArray(parsed) ? parsed : [];
    } catch {
      cachedSlugs = [];
    }
  }
  return cachedSlugs;
}

const SERVER_SNAPSHOT: string[] = [];
export function getSavedServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
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

export function toggleSaved(slug: string): boolean {
  if (typeof window === "undefined" || !slug) return false;
  const current = getSavedSlugs();
  let updated: string[];
  let newState: boolean;

  if (current.includes(slug)) {
    updated = current.filter((s) => s !== slug);
    newState = false;
  } else {
    updated = [...current, slug];
    newState = true;
  }

  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota error
  }

  window.dispatchEvent(new CustomEvent(SAVED_CHANGE_EVENT, { detail: { slug, saved: newState, all: updated } }));
  return newState;
}

export function removeSaved(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  const current = getSavedSlugs();
  const updated = current.filter((s) => s !== slug);
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(SAVED_CHANGE_EVENT, { detail: { slug, saved: false, all: updated } }));
}
