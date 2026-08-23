import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { MenuOverlay } from "@/components/MenuOverlay";
import { routes } from "@/routes";
import { easeCine } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Nav() {
  const reduced = useReducedMotion();
  const [location] = useLocation();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setCondensed(latest > 40));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <motion.div
          initial={reduced ? false : { y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: easeCine, delay: 0.2 }}
          className={cn(
            "relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 transition-all duration-300 lg:px-10",
            condensed ? "py-3" : "py-5",
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 -z-10 border-b transition-all duration-300",
              condensed
                ? "border-white/10 bg-ink/70 backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          />

          <Link href="/" className="shrink-0" aria-label="Gromento — home">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 xl:flex">
            {routes.slice(1, -1).map((route) => {
              const active = route.path === location;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "group relative font-display text-sm font-medium transition-colors duration-200",
                    active ? "text-lime" : "text-white/70 hover:text-white",
                  )}
                >
                  {route.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-lime transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/contact" className="px-5 py-2.5 text-[0.8125rem]">
                Talk to Gromento
              </Button>
            </div>

            {/*
              The menu trigger is a labelled pill, not an icon jammed into the
              corner: bigger hit area, its own inset from the viewport edge, and
              it opens a full-screen layer that nothing can paint over.
            */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="group relative inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 backdrop-blur-sm transition-colors duration-200 hover:border-lime/60"
            >
              <span className="flex flex-col gap-[3px]" aria-hidden="true">
                <span className="block h-px w-4 bg-white transition-colors duration-200 group-hover:bg-lime" />
                <span className="block h-px w-4 bg-white transition-colors duration-200 group-hover:bg-lime" />
                <span className="block h-px w-2.5 bg-white transition-all duration-200 group-hover:w-4 group-hover:bg-lime" />
              </span>
              <span className="font-display text-sm font-semibold text-white transition-colors duration-200 group-hover:text-lime">
                Menu
              </span>
            </button>
          </div>
        </motion.div>
      </header>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPath={location}
      />
    </>
  );
}
