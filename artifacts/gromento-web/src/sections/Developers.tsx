import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Check } from "lucide-react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { developers } from "@/data/site";

export function Developers() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <Section id="developers">
      <div ref={ref} className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={developers.eyebrow}
            title={developers.title}
            highlight={["market", "around", "it."]}
          >
            <Reveal delay={0.1}>
              <Lede className="max-w-xl">{developers.outro}</Lede>
            </Reveal>
          </SectionHeading>
        </div>

        <motion.div style={reduced ? undefined : { y: plateY }}>
          <Reveal className="mb-6">
            <p className="eyebrow text-fg-muted">{developers.body}</p>
          </Reveal>
          <RevealGroup gap={0.05} as="ul" className="grid gap-2 sm:grid-cols-2">
            {developers.partners.map((partner) => (
              <RevealItem
                key={partner}
                as="li"
                className="group flex items-center gap-3 rounded-xl border border-fg/10 bg-fg/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-accent/35 hover:bg-accent/[0.03]"
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm text-fg/80">{partner}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </motion.div>
      </div>
    </Section>
  );
}
