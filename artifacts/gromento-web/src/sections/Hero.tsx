import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/Button";
import { Marquee } from "@/components/Marquee";
import { LogoMark } from "@/components/Logo";
import { SplitText } from "@/components/Reveal";
import { stagger, fadeUp, pick } from "@/lib/motion";
import { hero, tickerMarkets } from "@/data/site";
import { asset } from "@/lib/utils";

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
    <div
      id="top"
      ref={ref}
      data-tone="dark"
      className="relative min-h-[100svh] overflow-hidden bg-surface pt-32 text-fg"
    >
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={reduced ? undefined : stagger(0.09, 0.15)}
          className="flex flex-col items-start"
        >
          <motion.span
            variants={pick(reduced, fadeUp)}
            className="inline-flex items-center gap-2 rounded-full border border-fg/12 bg-fg/[0.04] px-4 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            <span className="eyebrow text-fg-muted">{hero.eyebrow}</span>
          </motion.span>

          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-fg">
            <SplitText as="span" text="Grow Louder." className="block" highlight={["louder"]} />
            <SplitText
              as="span"
              text="Move Upward."
              className="block text-fg-muted"
              highlight={["upward"]}
              delay={0.15}
            />
          </h1>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-8 max-w-2xl font-display text-xl font-medium leading-snug text-fg sm:text-2xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {hero.body}
          </motion.p>

          <motion.ul
            variants={pick(reduced, fadeUp)}
            className="mt-8 flex flex-col gap-2 border-l-2 border-accent/60 pl-5"
          >
            {hero.negations.map((line) => (
              <li key={line} className="font-display text-sm font-medium text-fg-muted sm:text-base">
                {line}
              </li>
            ))}
          </motion.ul>

          <motion.p
            variants={pick(reduced, fadeUp)}
            className="mt-8 max-w-2xl font-display text-lg font-medium text-fg sm:text-xl"
          >
            Gromento is built around one audience:{" "}
            <span className="text-accent">the global Indian property buyer.</span>
          </motion.p>

          <motion.div
            variants={pick(reduced, fadeUp)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/contact">{hero.primaryCta}</Button>
            <Button href="/contact" variant="secondary">
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Oversized ghost mark anchored to the hero's bottom-right corner. */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { rotate: markRotate }}
        className="pointer-events-none absolute -right-10 bottom-32 hidden text-purple/10 xl:block"
      >
        <LogoMark className="h-[22rem] w-[22rem]" />
      </motion.div>

      {/* Skyline plate — the market the campaigns are built for. It sits low
          and under a scrim so the hero copy never competes with it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none"
      >
        <img
          src={asset("media/skyline.svg")}
          alt=""
          className="h-[17vh] w-full object-cover object-bottom opacity-55 sm:h-[21vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-surface/50 to-surface" />
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="border-y border-fg/10 bg-surface/40 py-4 backdrop-blur-sm">
          <Marquee duration={48}>
            {tickerMarkets.map((market) => (
              <span key={market} className="flex items-center gap-6 px-6">
                <span className="font-display text-sm font-medium tracking-tight text-fg/70">
                  {market}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/70" />
              </span>
            ))}
          </Marquee>
        </div>
      </div>

    </div>
  );
}
