import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Fixed brand wash behind the whole page. On the light ground it reads as ink
 * bleeding into paper — soft violet and lime tints over a faint grid — and the
 * dark blocks (hero, quote, CTA, footer) paint over it with their own ground.
 * Fixed position keeps it out of the scrolling layer, so it costs one
 * composited layer regardless of page length.
 */
export function Backdrop() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 });

  const purpleY = useTransform(progress, [0, 1], ["-6%", "22%"]);
  const purpleX = useTransform(progress, [0, 1], ["-4%", "10%"]);
  const limeY = useTransform(progress, [0, 1], ["18%", "-14%"]);
  const limeOpacity = useTransform(progress, [0, 0.4, 1], [0.45, 0.7, 0.4]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-surface" />
      <div className="bg-grid absolute inset-0 opacity-60" />
      <motion.div
        style={reduced ? undefined : { y: purpleY, x: purpleX }}
        className="absolute -top-40 left-[-10%] h-[38rem] w-[38rem] rounded-full bg-purple/8 blur-[150px]"
      />
      <motion.div
        style={reduced ? undefined : { y: limeY, opacity: limeOpacity }}
        className="absolute right-[-14%] top-1/3 h-[30rem] w-[30rem] rounded-full bg-lime/10 blur-[170px]"
      />
      <div className="absolute bottom-[-10%] left-1/3 h-[30rem] w-[30rem] rounded-full bg-violet/6 blur-[170px]" />
    </div>
  );
}

/** Thin rail at the top of the viewport tracking read progress. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-violet via-purple to-lime",
        className,
      )}
    />
  );
}
