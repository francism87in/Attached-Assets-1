import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/Button";
import { Marquee } from "@/components/Marquee";
import { LogoMark } from "@/components/Logo";
import { SplitText } from "@/components/Reveal";
import { stagger, fadeUp, pick } from "@/lib/motion";
import { hero, tickerMarkets } from "@/data/site";

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Hero content drifts up and dims as the next section takes over.
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, 24]);

  return (
    <div id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden pt-32">
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={reduced ? undefined : stagger(0.09, 0.15)}
          className="flex flex-col items-start"
        >
          <motion.span
            variants={pick(reduced, fadeUp)}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            <span className="eyebrow text-gray-cool">{hero.eyebrow}</span>
          </motion.span>

          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white">
            <SplitText as="span" text="Grow Louder." className="block" highlight={["louder"]} />
            <SplitText
              as="span"
              text="Move Upward."
              className="block text-white/60"
              highlight={["upward"]}
              delay={0.15}
            />
          </h1>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-8 max-w-2xl font-display text-xl font-medium leading-snug text-white sm:text-2xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-5 max-w-2xl text-base leading-relaxed text-gray-cool sm:text-lg"
          >
            {hero.body}
          </motion.p>

          <motion.ul
            variants={pick(reduced, fadeUp)}
            className="mt-8 flex flex-col gap-2 border-l-2 border-lime/60 pl-5"
          >
            {hero.negations.map((line) => (
              <li key={line} className="font-display text-sm font-medium text-white/55 sm:text-base">
                {line}
              </li>
            ))}
          </motion.ul>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-8 max-w-2xl font-display text-lg font-medium text-white sm:text-xl"
          >
            Gromento is built around one audience:{" "}
            <span className="text-lime">the global Indian property buyer.</span>
          </motion.p>

          <motion.div
            variants={pick(reduced, fadeUp)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#contact">{hero.primaryCta}</Button>
            <Button href="#contact" variant="secondary">
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Oversized ghost mark anchored to the hero's bottom-right corner. */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { rotate: markRotate }}
        className="pointer-events-none absolute -right-10 bottom-24 hidden text-purple/15 xl:block"
      >
        <LogoMark className="h-[22rem] w-[22rem]" />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="border-y border-white/10 bg-ink/40 py-4 backdrop-blur-sm">
          <Marquee duration={48}>
            {tickerMarkets.map((market) => (
              <span key={market} className="flex items-center gap-6 px-6">
                <span className="font-display text-sm font-medium tracking-tight text-white/70">
                  {market}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-lime/70" />
              </span>
            ))}
          </Marquee>
        </div>
      </div>

    </div>
  );
}
