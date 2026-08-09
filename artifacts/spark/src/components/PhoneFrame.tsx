import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A chunky phone bezel used for every "app" surface in the prototype. */
export function PhoneFrame({
  children,
  className,
  statusBarTone = "dark",
}: {
  children: ReactNode;
  className?: string;
  statusBarTone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "relative w-[320px] shrink-0 rounded-[2.75rem] bg-ink-900 p-2.5 shadow-2xl shadow-ink-900/25",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[2.25rem] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-6">
          <span
            className={cn(
              "text-xs font-semibold",
              statusBarTone === "light" ? "text-white" : "text-ink-900",
            )}
          >
            9:41
          </span>
          <span
            className={cn(
              "flex items-center gap-1",
              statusBarTone === "light" ? "text-white" : "text-ink-900",
            )}
            aria-hidden
          >
            <svg viewBox="0 0 20 12" className="h-3 w-5" fill="currentColor">
              <rect x="0" y="7" width="3" height="5" rx="1" />
              <rect x="4.5" y="5" width="3" height="7" rx="1" />
              <rect x="9" y="2.5" width="3" height="9.5" rx="1" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.35" />
            </svg>
            <svg viewBox="0 0 26 12" className="h-3 w-6" fill="none" stroke="currentColor">
              <rect x="0.75" y="0.75" width="20" height="10.5" rx="3" strokeWidth="1.5" opacity="0.4" />
              <rect x="2.5" y="2.5" width="14" height="7" rx="1.5" fill="currentColor" />
              <path d="M23 4.5v3" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
          </span>
        </div>
        <div className="absolute top-2.5 left-1/2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-ink-900" />
        {children}
      </div>
    </div>
  );
}
