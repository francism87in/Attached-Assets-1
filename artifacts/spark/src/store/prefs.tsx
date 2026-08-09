import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { liveCities } from "@/data/content";

const KEY = "spark.prefs.v1";

type Prefs = { city: string; address: string };

const fallback: Prefs = { city: liveCities[0].slug, address: "" };

function load(): Prefs {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Prefs>) } : fallback;
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

  return (
    <PrefsContext.Provider
      value={{ prefs, setPrefs: (patch) => setState((p) => ({ ...p, ...patch })) }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
