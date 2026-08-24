import { motion, useReducedMotion } from "motion/react";
import { MessageCircleQuestion } from "lucide-react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { Figure } from "@/components/Figure";
import { contentEngine } from "@/data/site";
import { easeBrand } from "@/lib/motion";

/**
 * The content engine splits cleanly in two, so each half can carry its own page
 * rather than repeating the whole section on both:
 *
 *  - `questions` — the buyer questions campaigns are built to answer (Approach)
 *  - `formats`   — the pieces those answers become (What We Do)
 *  - `full`      — both, for a single-page context
 */
type Variant = "full" | "questions" | "formats";

export function ContentEngine({ variant = "full" }: { variant?: Variant }) {
  const reduced = useReducedMotion();
  const showQuestions = variant !== "formats";
  const showFormats = variant !== "questions";
  return (
    <Section id="content" className="border-y border-hairline bg-surface-sunken/40">
      <SectionHeading
        eyebrow={contentEngine.eyebrow}
        title={
          showQuestions
            ? contentEngine.title
            : "Every Answer Becomes Marketing Ammunition."
        }
        highlight={showQuestions ? ["reasons", "buy."] : ["ammunition."]}
      >
        <Reveal delay={0.1}>
          <Lede className="max-w-2xl">
            {showQuestions
              ? contentEngine.body
              : "Each answer we build turns into work that runs — across formats, markets and campaigns."}
          </Lede>
        </Reveal>
      </SectionHeading>

      {showQuestions ? (
        <>
          <RevealGroup gap={0.05} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contentEngine.questions.map((question) => (
              <RevealItem key={question}>
                <motion.div
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.3, ease: easeBrand }}
                  className="group flex h-full items-start gap-3 rounded-xl border border-fg/10 bg-fg/[0.02] p-5 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/[0.04]"
                >
                  <MessageCircleQuestion
                    className="mt-0.5 h-4 w-4 shrink-0 text-purple transition-colors duration-300 group-hover:text-accent"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-fg/80">{question}</p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>

          {showFormats ? (
            <Reveal className="mt-14 text-center">
              <p className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {contentEngine.ammunition}
              </p>
            </Reveal>
          ) : null}
        </>
      ) : null}

      {showFormats && !showQuestions ? (
        <Reveal className="mt-14">
          <Figure
            src="/media/engine.svg"
            alt="A content engine at the centre, ringed by films, reels, guides, events, reports and ads"
            caption="Every answer becomes a piece of work that runs."
            className="mx-auto max-w-2xl"
          />
        </Reveal>
      ) : null}

      {showFormats ? (
        <Reveal delay={0.1} className="mt-12">
          <Marquee duration={38} className="py-2">
            {contentEngine.formats.map((format) => (
              <span
                key={format}
                className="mx-2 whitespace-nowrap rounded-full border border-fg/12 bg-fg/[0.03] px-5 py-2.5 font-display text-sm font-medium text-fg/75"
              >
                {format}
              </span>
            ))}
          </Marquee>
        </Reveal>
      ) : null}

      <Reveal delay={0.15} className="mt-12 flex justify-center">
        <p className="max-w-xl text-center font-display text-lg font-medium text-fg/85">
          Content creates trust. <span className="text-accent">Performance marketing scales it.</span>
        </p>
      </Reveal>
    </Section>
  );
}
