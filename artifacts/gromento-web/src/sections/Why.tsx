import { Section, SectionHeading } from "@/components/Section";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { GlowCard } from "@/components/GlowCard";
import { why } from "@/data/site";

export function Why() {
  return (
    <Section id="why">
      <SectionHeading
        eyebrow={why.eyebrow}
        title={why.title}
        highlight={["room."]}
      />

      <RevealGroup gap={0.07} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {why.reasons.map((reason, index) => (
          <RevealItem key={reason.title} as="article" className="h-full">
            <GlowCard glow="rgba(212,255,0,0.16)" className="flex h-full flex-col p-7">
              <span className="font-display text-5xl font-semibold leading-none tracking-tight text-fg/10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-accent">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{reason.body}</p>
            </GlowCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
