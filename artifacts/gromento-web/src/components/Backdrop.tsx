import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Fixed brand aurora behind the whole page: two large blurred orbs (electric
 * purple + neon lime) that drift with scroll progress, over a faint grid. Fixed
 * position keeps it out of the scrolling layer, so it costs one composited
 * layer regardless of page length.
 */
export function Backdrop() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 });

  const purpleY = useTransform(progress, [0, 1], ["-6%", "22%"]);
  const purpleX = useTransform(progress, [0, 1], ["-4%", "10%"]);
  const limeY = useTransform(progress, [0, 1], ["18%", "-14%"]);
  const limeOpacity = useTransform(progress, [0, 0.4, 1], [0.16, 0.3, 0.14]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div className="bg-grid absolute inset-0 opacity-40" />
      <motion.div
        style={reduced ? undefined : { y: purpleY, x: purpleX }}
        className="absolute -top-40 left-[-10%] h-[38rem] w-[38rem] rounded-full bg-purple/25 blur-[140px]"
      />
      <motion.div
        style={reduced ? undefined : { y: limeY, opacity: limeOpacity }}
        className="absolute right-[-12%] top-1/3 h-[32rem] w-[32rem] rounded-full bg-lime/15 blur-[150px]"
      />
      <div className="absolute bottom-[-10%] left-1/3 h-[30rem] w-[30rem] rounded-full bg-violet/25 blur-[160px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
    </div>
  );
}

/** Thin lime rail at the top of the viewport tracking read progress. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-purple via-lime to-purple",
        className,
      )}
    />
  );
}
