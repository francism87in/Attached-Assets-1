import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language for the site (Motion for React — motion.dev).
 *
 * Rules we hold to across every section:
 *  - one dominant animated idea per viewport, everything else is support;
 *  - transform/opacity only, so animations stay off the layout/paint path;
 *  - `whileInView` with `once: true` so content never re-animates on scroll-back;
 *  - `useReducedMotion()` at each call site renders the final state immediately.
 */

/** Brand easing — the same curve as `--ease-brand` in index.css. */
export const easeBrand = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.6,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
  mass: 0.5,
};

/** Default in-view trigger: fires slightly before the block is centred. */
export const viewportOnce = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeBrand },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeBrand } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeBrand },
  },
};

/** Wrap a group of `fadeUp` children to stagger them in. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Word-by-word headline reveal (used by <SplitText />). */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotate: 3 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.75, ease: easeBrand },
  },
};

/**
 * Collapse a variant set to its final ("show") state — used when the visitor
 * asks for reduced motion, so they get the readable end state with no movement.
 */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1, rotate: 0 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0 } },
};

export function pick(reduced: boolean | null, variants: Variants): Variants {
  return reduced ? staticVariants : variants;
}
