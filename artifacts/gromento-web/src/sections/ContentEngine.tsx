import { motion, useReducedMotion } from "motion/react";
import { MessageCircleQuestion } from "lucide-react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { contentEngine } from "@/data/site";
import { easeBrand } from "@/lib/motion";

export function ContentEngine() {
  const reduced = useReducedMotion();

  return (
    <Section id="content" className="border-y border-white/[0.07] bg-ink-sunken/40">
      <SectionHeading
        index="04"
        eyebrow={contentEngine.eyebrow}
        title={contentEngine.title}
        highlight={["reasons", "buy."]}
      >
        <Reveal delay={0.1}>
          <Lede className="max-w-2xl">{contentEngine.body}</Lede>
        </Reveal>
      </SectionHeading>

      <RevealGroup gap={0.05} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contentEngine.questions.map((question) => (
          <RevealItem key={question}>
            <motion.div
              whileHover={reduced ? undefined : { y: -3 }}
              transition={{ duration: 0.3, ease: easeBrand }}
              className="group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-lime/40 hover:bg-lime/[0.04]"
            >
              <MessageCircleQuestion
                className="mt-0.5 h-4 w-4 shrink-0 text-purple transition-colors duration-300 group-hover:text-lime"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-white/80">{question}</p>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-14 text-center">
        <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {contentEngine.ammunition}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <Marquee duration={38} className="py-2">
          {contentEngine.formats.map((format) => (
            <span
              key={format}
              className="mx-2 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 font-display text-sm font-medium text-white/75"
            >
              {format}
            </span>
          ))}
        </Marquee>
      </Reveal>

      <Reveal delay={0.15} className="mt-12 flex justify-center">
        <p className="max-w-xl text-center font-display text-lg font-medium text-white/85">
          Content creates trust. <span className="text-lime">Performance marketing scales it.</span>
        </p>
      </Reveal>
    </Section>
  );
}
