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
            index="07"
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
            <p className="eyebrow text-gray-cool">{developers.body}</p>
          </Reveal>
          <RevealGroup gap={0.05} as="ul" className="grid gap-2 sm:grid-cols-2">
            {developers.partners.map((partner) => (
              <RevealItem
                key={partner}
                as="li"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-lime/35 hover:bg-lime/[0.03]"
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lime/40 text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-ink">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm text-white/80">{partner}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </motion.div>
      </div>
    </Section>
  );
}
