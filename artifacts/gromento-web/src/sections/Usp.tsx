import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { usp } from "@/data/site";
import { cn } from "@/lib/utils";

export function Usp({ headless = false }: { headless?: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Slow counter-drift on the right rail gives the block a sense of depth.
  const railY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <Section id="usp">
      {headless ? null : (
        <SectionHeading
          eyebrow={usp.eyebrow}
          title={usp.title}
          highlight={["buyer", "before"]}
        />
      )}

      <div
        ref={ref}
        className={cn(
          "grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20",
          !headless && "mt-16",
        )}
      >
        <div>
          <RevealGroup className="flex flex-col gap-3">
            {usp.lead.map((line, index) => (
              <RevealItem
                key={line}
                as="p"
                className={
                  index === usp.lead.length - 1
                    ? "font-display text-2xl font-semibold tracking-tight text-accent sm:text-3xl"
                    : "font-display text-2xl font-semibold tracking-tight text-fg-muted sm:text-3xl"
                }
              >
                {line}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-8">
            <Lede>{usp.body}</Lede>
          </Reveal>

          <Reveal delay={0.15} className="mt-8">
            <Lede>{usp.motivations}</Lede>
          </Reveal>
        </div>

        <motion.div style={reduced ? undefined : { y: railY }} className="lg:pt-4">
          <RevealGroup className="flex flex-col divide-y divide-fg/10 border-y border-fg/10">
            {usp.contrasts.map((row) => (
              <RevealItem
                key={row.label}
                className="group flex items-baseline justify-between gap-6 py-5 transition-colors duration-300 hover:bg-fg/[0.03]"
              >
                <span className="font-display text-lg font-medium text-fg">{row.label}</span>
                <span className="text-right text-sm text-fg-muted transition-colors duration-300 group-hover:text-accent">
                  {row.value}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.2} className="mt-10 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6">
            <p className="text-base leading-relaxed text-fg/85">{usp.outro}</p>
            <p className="mt-4 font-display text-lg font-semibold text-accent">{usp.kicker}</p>
          </Reveal>
        </motion.div>
      </div>
    </Section>
  );
}
