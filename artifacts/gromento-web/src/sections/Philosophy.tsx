import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Section } from "@/components/Section";
import { Reveal, SplitText } from "@/components/Reveal";
import { philosophy } from "@/data/site";

export function Philosophy() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The quote plate scales in slightly as it crosses the viewport centre.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.45, 0.1]);

  return (
    <Section id="philosophy">
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <Reveal className="flex items-center justify-center gap-3">
          <span className="eyebrow text-lime">08</span>
          <span className="eyebrow text-gray-cool">{philosophy.eyebrow}</span>
        </Reveal>

        <SplitText
          text={philosophy.title}
          highlight={["preference."]}
          className="mt-8 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
        />

        <Reveal delay={0.1} className="mt-8">
          <p className="text-lg leading-relaxed text-gray-cool">{philosophy.body}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-base text-white/70">{philosophy.lead}</p>
        </Reveal>

        <motion.figure
          style={reduced ? undefined : { scale }}
          className="relative mt-8"
        >
          <motion.span
            aria-hidden="true"
            style={reduced ? { opacity: 0.25 } : { opacity: glow }}
            className="absolute inset-0 -z-10 rounded-3xl bg-purple/30 blur-3xl"
          />
          <blockquote className="rounded-3xl border border-white/12 bg-white/[0.03] px-8 py-12 backdrop-blur-sm">
            <p className="text-balance font-display text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
              “{philosophy.quote}”
            </p>
          </blockquote>
        </motion.figure>

        <Reveal delay={0.1} className="mt-10">
          <p className="font-display text-xl font-medium text-lime">{philosophy.outro}</p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-gray-cool">{philosophy.kicker}</p>
        </Reveal>
      </div>
    </Section>
  );
}
