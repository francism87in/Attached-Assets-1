import {
  Compass,
  Globe2,
  PenLine,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { GlowCard } from "@/components/GlowCard";
import { positioning } from "@/data/site";

const icons: Record<string, LucideIcon> = {
  compass: Compass,
  pen: PenLine,
  target: Target,
  sparkles: Sparkles,
  workflow: Workflow,
  globe: Globe2,
};

export function Positioning() {
  return (
    <Section id="positioning">
      <SectionHeading
        index="02"
        eyebrow={positioning.eyebrow}
        title={positioning.title}
        highlight={["global", "indian", "buyers."]}
      >
        <Reveal delay={0.1}>
          <Lede className="max-w-2xl">{positioning.body}</Lede>
        </Reveal>
      </SectionHeading>

      <RevealGroup gap={0.07} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {positioning.pillars.map((pillar, index) => {
          const Icon = icons[pillar.icon] ?? Sparkles;
          return (
            <RevealItem key={pillar.title} as="article" className="h-full">
              <GlowCard className="h-full p-7">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lime transition-colors duration-300 group-hover:border-lime/40">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="eyebrow text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-cool">{pillar.body}</p>
              </GlowCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
