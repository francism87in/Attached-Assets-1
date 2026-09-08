import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, pick, stagger, viewportOnce, wordReveal } from "@/lib/motion";

/**
 * Motion components keyed by tag. Indexing `motion` with a union of tag names
 * produces a union component type that JSX cannot narrow, so we resolve the
 * element here and cast to one concrete motion component.
 */
const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const;

type MotionTag = keyof typeof motionTags;

function resolve(tag: MotionTag) {
  return motionTags[tag] as typeof motion.div;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: MotionTag;
  /** Lets a caller stamp a tone (or any data attribute) on the wrapper. */
  "data-tone"?: "dark";
};

/** Single element that eases up into view once. */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = resolve(as);

  return (
    <Component
      {...rest}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={pick(reduced, variants)}
      transition={reduced ? { duration: 0 } : { delay }}
    >
      {children}
    </Component>
  );
}

/** Parent that staggers `<Reveal>`-shaped children into view. */
export function RevealGroup({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: MotionTag;
}) {
  const reduced = useReducedMotion();
  const Component = resolve(as);

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={reduced ? undefined : stagger(gap, delay)}
    >
      {children}
    </Component>
  );
}

/** Child of `<RevealGroup>` — inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: MotionTag;
}) {
  const reduced = useReducedMotion();
  const Component = resolve(as);

  return (
    <Component className={className} variants={pick(reduced, variants)}>
      {children}
    </Component>
  );
}

/**
 * Headline that reveals word by word. Words keep their own `overflow-hidden`
 * clip so each one rises out of an invisible baseline mask.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  highlight,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Words matching this list render in lime. */
  highlight?: readonly string[];
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const normalise = (word: string) => word.replace(/[^\p{L}\p{N}']/gu, "").toLowerCase();
  const highlighted = new Set((highlight ?? []).map(normalise));

  return (
    <Tag className={cn("font-display", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={reduced ? undefined : stagger(0.038, delay)}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-flex overflow-hidden pb-[0.08em] align-bottom"
            aria-hidden="true"
          >
            <motion.span
              className={cn(
                "inline-block whitespace-pre",
                highlighted.has(normalise(word)) && "text-accent",
                wordClassName,
              )}
              variants={pick(reduced, wordReveal)}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
