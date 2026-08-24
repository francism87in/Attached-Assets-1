import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Reveal, SplitText } from "@/components/Reveal";

export function NotFound() {
  return (
    <Section className="pt-44">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow text-accent">404</span>
        <SplitText
          as="h1"
          text="This page moved upward."
          highlight={["upward."]}
          className="mt-6 text-balance text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-fg"
        />
        <Reveal delay={0.1} className="mt-6">
          <p className="text-lg text-fg-muted">
            The link you followed doesn't exist. The work does — start from the top.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <Button href="/">Back to home</Button>
        </Reveal>
      </div>
    </Section>
  );
}
