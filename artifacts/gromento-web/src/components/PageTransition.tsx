import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogoMark } from "@/components/Logo";
import { easeCine } from "@/lib/motion";
import { routeFor } from "@/routes";

/**
 * Cinematic route change. On every navigation two panels sweep across the
 * viewport — deep violet leading, charcoal trailing — with the mark and the
 * incoming page's name held in the gap. The new page then rises underneath.
 *
 * Scroll is reset while the curtain covers the screen, so the jump is never
 * visible. Under reduced motion the curtain is skipped entirely and the page
 * simply swaps.
 */
export function PageTransition({
  location,
  children,
}: {
  location: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [covering, setCovering] = useState(false);
  const route = routeFor(location);

  useEffect(() => {
    document.title = route.documentTitle;

    if (reduced) {
      window.scrollTo(0, 0);
      return;
    }

    setCovering(true);
    // Reset scroll at the moment the curtain is fully drawn.
    const reset = window.setTimeout(() => window.scrollTo(0, 0), 260);
    const clear = window.setTimeout(() => setCovering(false), 380);

    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(clear);
    };
  }, [location, reduced, route.documentTitle]);

  return (
    <>
      <AnimatePresence>
        {covering ? (
          <motion.div
            key={`curtain-${location}`}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60]"
          >
            <motion.span
              className="absolute inset-0 origin-bottom bg-violet"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.6, ease: easeCine, delay: 0.05 }}
              style={{ transformOrigin: "top" }}
            />
            <motion.span
              className="absolute inset-0 origin-top bg-surface"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.55, ease: easeCine, delay: 0.12 }}
              style={{ transformOrigin: "top" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-4"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easeCine, delay: 0.1 }}
            >
              <LogoMark className="h-10 w-10 text-accent" />
              <span className="eyebrow text-fg/70">{route.label}</span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: easeCine, delay: reduced ? 0 : 0.05 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
