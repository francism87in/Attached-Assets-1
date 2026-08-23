import { Section } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem, SplitText } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { coreMessage } from "@/data/site";

export function CoreMessage() {
  return (
    <Section id="core" className="border-y border-white/[0.07] bg-ink-sunken/40">
      <div className="mx-auto max-w-4xl">
        <Reveal className="flex items-center gap-3">
          <span className="eyebrow text-lime">10</span>
          <span className="eyebrow text-gray-cool">{coreMessage.eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </Reveal>

        <SplitText
          text={coreMessage.title}
          highlight={["one", "growth", "partner."]}
          className="mt-8 text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl"
        />

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-2xl text-lg leading-relaxed text-gray-cool">{coreMessage.body}</p>
        </Reveal>

        <RevealGroup gap={0.12} className="mt-10 flex flex-col gap-1">
          {coreMessage.lines.map((line, index) => (
            <RevealItem
              key={line}
              as="p"
              className={
                index === coreMessage.lines.length - 1
                  ? "font-display text-2xl font-semibold tracking-tight text-lime sm:text-3xl"
                  : "font-display text-2xl font-semibold tracking-tight text-white/35 sm:text-3xl"
              }
            >
              {line}
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12">
          <Button href="/contact">{coreMessage.cta}</Button>
        </Reveal>
      </div>
    </Section>
  );
}
