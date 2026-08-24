import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { Section, SectionHeading, Lede } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Figure } from "@/components/Figure";
import { markets } from "@/data/site";
import { easeBrand } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Markets({ headless = false }: { headless?: boolean }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const region = markets.regions[active]!;

  return (
    <Section id="markets" className="border-y border-hairline bg-surface-sunken/40">
      {headless ? null : (
        <SectionHeading
          eyebrow={markets.eyebrow}
          title={markets.title}
          highlight={["different", "markets.", "motivations."]}
        >
          <RevealGroup className="flex flex-col gap-3">
            {markets.lead.map((line) => (
              <RevealItem key={line} as="p">
                <Lede>{line}</Lede>
              </RevealItem>
            ))}
          </RevealGroup>
        </SectionHeading>
      )}

      <Reveal className={headless ? "" : "mt-12"}>
        <Figure
          src="/media/routes-map.svg"
          alt="Demand routes running from New York, Dallas, London, Dubai and Singapore into a single Indian project"
          caption="Five markets, five narratives, one project at the centre."
          imageClassName="bg-surface-raised"
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <p className="eyebrow text-fg-muted">{markets.body}</p>
      </Reveal>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
        {/* Region selector */}
        <RevealGroup gap={0.06} as="ul" className="flex flex-col">
          {markets.regions.map((item, index) => {
            const selected = index === active;
            return (
              <RevealItem key={item.name} as="li">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={selected}
                  className={cn(
                    "group relative flex w-full cursor-pointer items-center justify-between gap-4 border-b border-fg/10 py-5 text-left transition-colors duration-300",
                    selected ? "text-fg" : "text-fg/50 hover:text-fg/80",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="market-active"
                      aria-hidden="true"
                      transition={
                        reduced ? { duration: 0 } : { duration: 0.4, ease: easeBrand }
                      }
                      className="absolute inset-y-0 -left-4 w-0.5 bg-accent"
                    />
                  ) : null}
                  <span className="font-display text-lg font-medium tracking-tight sm:text-xl">
                    {item.name}
                  </span>
                  <span className="eyebrow shrink-0 text-fg/25">
                    {item.cities.length > 0 ? `${item.cities.length} cities` : "Market"}
                  </span>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Region detail */}
        <div className="relative min-h-[18rem] rounded-2xl border border-fg/10 bg-fg/[0.02] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={region.name}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: easeBrand }}
            >
              <span className="eyebrow text-accent">Market focus</span>
              <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                {region.name}
              </h3>

              {region.cities.length > 0 ? (
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {region.cities.map((city, index) => (
                    <motion.li
                      key={city}
                      initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: reduced ? 0 : 0.3,
                        ease: easeBrand,
                        delay: reduced ? 0 : 0.05 * index,
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-fg/12 bg-fg/[0.04] px-4 py-2"
                    >
                      <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      <span className="font-display text-sm font-medium text-fg/85">
                        {city}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 max-w-md text-base leading-relaxed text-fg-muted">
                  Positioning, content and campaigns are rebuilt for this market rather than
                  translated from another one.
                </p>
              )}

              <div className="mt-10 border-t border-fg/10 pt-6">
                <p className="text-base text-fg/80">{markets.outro}</p>
                <p className="mt-2 font-display text-lg font-semibold text-accent">
                  {markets.kicker}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
