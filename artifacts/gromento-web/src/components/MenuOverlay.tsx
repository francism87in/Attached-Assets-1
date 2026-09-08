import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "wouter";
import { ArrowUpRight, X } from "lucide-react";
import { routes } from "@/routes";
import { brand, tickerMarkets } from "@/data/site";
import { easeCine } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Full-screen navigation. It replaces the old collapsing panel that lived in
 * the header's top-right corner: a full-bleed layer can't be covered by
 * anything painted over that corner, and it gives the site its cinematic
 * entrance — a curtain drops, then the routes stagger in.
 *
 * Behaviour: locks background scroll, closes on Escape, on route change and on
 * backdrop click, and returns focus to the trigger.
 */
export function MenuOverlay({
  open,
  onClose,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          data-tone="dark"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto text-fg"
          initial={reduced ? { opacity: 0 } : undefined}
          animate={reduced ? { opacity: 1 } : undefined}
          exit={reduced ? { opacity: 0 } : undefined}
          transition={{ duration: reduced ? 0 : 0.3 }}
        >
          {/* Curtain: two panels wipe down, the second a beat behind the first. */}
          {!reduced ? (
            <>
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 origin-top bg-purple"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.5, ease: easeCine }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 origin-top bg-surface"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.5, ease: easeCine, delay: 0.08 }}
              />
            </>
          ) : (
            <span aria-hidden="true" className="absolute inset-0 bg-surface" />
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-0 h-[36rem] w-[36rem] rounded-full bg-purple/25 blur-[160px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[150px]"
          />

          <div className="relative flex min-h-full flex-col">
            <div className="flex items-center justify-between px-6 py-5 lg:px-10">
              <span className="eyebrow text-fg-muted">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-fg/15 px-4 py-2.5 font-display text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Close
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-10"
              onMouseLeave={() => setHovered(null)}
            >
              <ul className="flex flex-col">
                {routes.map((route, index) => {
                  const active = route.path === currentPath;
                  const dimmed = hovered !== null && hovered !== route.path;

                  return (
                    <li key={route.path} className="overflow-hidden">
                      <motion.div
                        initial={reduced ? false : { y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={reduced ? undefined : { y: "60%", opacity: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.6,
                          ease: easeCine,
                          delay: reduced ? 0 : 0.28 + index * 0.06,
                        }}
                      >
                        <Link
                          href={route.path}
                          onClick={onClose}
                          onMouseEnter={() => setHovered(route.path)}
                          className={cn(
                            "group flex items-baseline gap-4 border-b border-fg/10 py-4 transition-opacity duration-300 sm:gap-6 sm:py-5",
                            dimmed ? "opacity-35" : "opacity-100",
                          )}
                        >
                          <span
                            className={cn(
                              "eyebrow shrink-0 transition-colors duration-300",
                              active ? "text-accent" : "text-fg-muted",
                            )}
                          >
                            {route.index}
                          </span>
                          <span
                            className={cn(
                              "font-display text-[clamp(2rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-colors duration-300",
                              active ? "text-accent" : "text-fg group-hover:text-accent",
                            )}
                          >
                            {route.label}
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="ml-auto h-5 w-5 shrink-0 translate-y-1 text-fg-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:h-7 sm:w-7"
                          />
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: easeCine, delay: reduced ? 0 : 0.6 }}
              className="flex flex-col gap-6 border-t border-fg/10 px-6 py-8 sm:flex-row sm:items-end sm:justify-between lg:px-10"
            >
              <div>
                <p className="eyebrow text-fg-muted">Markets we build for</p>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-muted">
                  {tickerMarkets.slice(0, 8).join(" · ")} and other high-intent NRI markets.
                </p>
              </div>
              <a
                href={`mailto:${brand.email}`}
                className="font-display text-lg font-semibold text-fg transition-colors hover:text-accent"
              >
                {brand.email}
              </a>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
