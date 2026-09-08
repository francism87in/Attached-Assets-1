import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { liveCities } from "@/data/content";

const KEY = "spark.prefs.v1";

type Prefs = { city: string; area: string; address: string };

const fallback: Prefs = { city: liveCities[0].slug, area: "", address: "" };

/**
 * Storage is user-writable and survives across versions, so every field is
 * checked rather than cast — a malformed value would otherwise surface as a
 * crash the next time something called `.trim()` on it.
 */
function load(): Prefs {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;

    const stored = JSON.parse(raw) as Record<string, unknown>;
    const text = (value: unknown) => (typeof value === "string" ? value : "");
    const city = text(stored.city);

    return {
      city: liveCities.some((c) => c.slug === city) ? city : fallback.city,
      area: text(stored.area),
      address: text(stored.address),
    };
  } catch {
    return fallback;
  }
}

const PrefsContext = createContext<{
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
} | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setState] = useState<Prefs>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  /** Switching city drops the old area and address — they belong to the city they were entered in. */
  const setPrefs = (patch: Partial<Prefs>) =>
    setState((current) => {
      const movedCity = patch.city !== undefined && patch.city !== current.city;
      return {
        ...current,
        ...(movedCity ? { area: "", address: "" } : null),
        ...patch,
      };
    });

  return <PrefsContext.Provider value={{ prefs, setPrefs }}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
