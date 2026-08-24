import { motion, useReducedMotion } from "motion/react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { routes } from "@/routes";
import { easeBrand } from "@/lib/motion";

/**
 * Home's hand-off to the rest of the site. Each card is one page's own title
 * card in miniature — same index, eyebrow and lede — so Home can stay an
 * overview instead of duplicating the sections those pages own.
 */
export function PageTeasers() {
  const reduced = useReducedMotion();
  const inner = routes.filter((route) => route.path !== "/" && route.path !== "/contact");

  return (
    <Section id="explore">
      <SectionHeading
        eyebrow="Explore"
        title="Four ways into the work."
        highlight={["work."]}
      />

      <RevealGroup gap={0.07} className="mt-14 grid gap-4 sm:grid-cols-2">
        {inner.map((route) => (
          <RevealItem key={route.path} as="article" className="h-full">
            <Link href={route.path} className="group block h-full">
              <motion.div
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ duration: 0.35, ease: easeBrand }}
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 group-hover:border-lime/40 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <span className="eyebrow text-white/30">{route.index}</span>
                    <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-lime sm:text-3xl">
                      {route.label}
                    </h3>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime"
                  />
                </div>

                <p className="relative mt-8 max-w-md text-sm leading-relaxed text-gray-cool">
                  {route.lede}
                </p>
              </motion.div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
