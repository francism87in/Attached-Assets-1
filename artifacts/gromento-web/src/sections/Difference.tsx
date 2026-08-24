import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { difference } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * One node of the demand chain. It lights up as the section's scroll progress
 * passes its slot, so the funnel "fills" while the visitor reads it.
 */
function FunnelStep({
  label,
  index,
  total,
  progress,
  reduced,
}: {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const start = index / total;
  const opacity = useTransform(progress, [start - 0.12, start + 0.04], [0.35, 1]);
  const y = useTransform(progress, [start - 0.12, start + 0.04], [12, 0]);
  const borderColor = useTransform(
    progress,
    [start - 0.12, start + 0.04],
    ["rgba(255,255,255,0.10)", "rgba(212,255,0,0.55)"],
  );

  return (
    <motion.li
      style={reduced ? undefined : { opacity, y, borderColor }}
      className="flex items-center gap-3 rounded-full border border-fg/10 bg-surface-raised/70 px-5 py-3 backdrop-blur-sm"
    >
      <span className="eyebrow text-accent">{String(index + 1).padStart(2, "0")}</span>
      <span className="font-display text-sm font-medium tracking-tight text-fg sm:text-base">
        {label}
      </span>
    </motion.li>
  );
}

export function Difference({
  headless = false,
  compact = false,
}: {
  headless?: boolean;
  /** Hide the demand chain — it belongs to the Approach page. */
  compact?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  return (
    <Section id="difference">
      {headless ? null : (
        <SectionHeading
          eyebrow={difference.eyebrow}
          title={difference.title}
          highlight={["demand."]}
        />
      )}

      <div className={cn("grid gap-6 lg:grid-cols-2", !headless && "mt-16")}>
        {/* The old way */}
        <Reveal className="rounded-2xl border border-fg/10 bg-fg/[0.02] p-8">
          <p className="eyebrow text-fg/35">{difference.oldWayLabel}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {difference.oldWay.map((line) => (
              <li key={line} className="flex items-center gap-3 text-fg/45">
                <span aria-hidden="true" className="h-px w-5 bg-fg/20" />
                <span className="font-display text-base line-through decoration-fg/25">
                  {line}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-fg-muted">
            {difference.oldWayKicker}
          </p>
        </Reveal>

        {/* The Gromento way */}
        <Reveal
          delay={0.1}
          className="rounded-2xl border border-accent/25 bg-gradient-to-br from-purple/12 via-transparent to-lime/[0.06] p-8"
        >
          <p className="eyebrow text-accent">{difference.newWayLabel}</p>
          <p className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl">
            {difference.outro}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-fg-muted">{difference.kicker}</p>
        </Reveal>
      </div>

      {/* Scroll-linked demand chain */}
      {compact ? null : (
      <div ref={ref} className="mt-16">
        <RevealGroup className="flex flex-wrap items-center gap-2">
          <RevealItem className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="eyebrow text-fg-muted">The chain we build</span>
          </RevealItem>
        </RevealGroup>

        <div className="relative mt-6 pt-6">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-fg/10" />
          <motion.div
            aria-hidden="true"
            style={reduced ? { scaleX: 1 } : { scaleX: progress }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-purple via-lime to-lime"
          />

          <ul className="flex flex-wrap items-center gap-3">
            {difference.funnel.map((step, index) => (
              <FunnelStep
                key={step}
                label={step}
                index={index}
                total={difference.funnel.length}
                progress={progress}
                reduced={reduced}
              />
            ))}
          </ul>
        </div>
      </div>
      )}
    </Section>
  );
}
