import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/Button";
import { Reveal, SplitText } from "@/components/Reveal";
import { closing } from "@/data/site";

/**
 * Closing band that ends every page except Contact — a wide, quiet plate that
 * brightens as it enters the viewport, then hands off to the footer.
 */
export function CtaBand({
  title = closing.kicker,
  body = closing.body,
  cta = closing.cta,
  highlight = ["reason."],
}: {
  title?: string;
  body?: string;
  cta?: string;
  highlight?: readonly string[];
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.4, 0.05]);
  const shift = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={ref}
      data-tone="dark"
      className="relative overflow-hidden bg-surface py-20 text-fg sm:py-28"
    >
      <motion.span
        aria-hidden="true"
        style={reduced ? { opacity: 0.22 } : { opacity: glow, y: shift }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/40 blur-[150px]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 text-center lg:px-8">
        <SplitText
          text={title}
          highlight={highlight}
          className="text-balance text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-fg"
        />

        <Reveal delay={0.1} className="mt-8">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-fg-muted">{body}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/contact">{cta}</Button>
          <Button href="/what-we-do" variant="secondary">
            See what we do
          </Button>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <p className="font-display text-sm font-medium tracking-tight text-fg-muted">
            {closing.tagline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
