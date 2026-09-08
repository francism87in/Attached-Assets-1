import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SplitText } from "@/components/Reveal";
import type { RouteDef } from "@/routes";

/**
 * Title card that opens every inner page. Oversized type, an index that ties
 * back to the menu, and a scroll-linked recede so the card feels like a camera
 * pulling back rather than content scrolling away.
 */
export function PageHeader({ route }: { route: RouteDef }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <header ref={ref} className="relative overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-16">
      <motion.div
        style={reduced ? undefined : { y, opacity, scale }}
        className="mx-auto w-full max-w-6xl px-6 lg:px-8"
      >
        <div className="flex items-center gap-3">
          <span className="eyebrow text-accent">{route.index}</span>
          <span className="eyebrow text-fg-muted">{route.eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
        </div>

        <SplitText
          as="h1"
          text={route.title}
          highlight={route.highlight}
          className="mt-8 max-w-5xl text-balance text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-fg"
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.22 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted"
        >
          {route.lede}
        </motion.p>
      </motion.div>
    </header>
  );
}
