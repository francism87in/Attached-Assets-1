import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal, SplitText } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { brand, closing, markets } from "@/data/site";
import { easeBrand } from "@/lib/motion";

const fieldClass =
  "w-full rounded-xl border border-fg/12 bg-fg/[0.03] px-4 py-3.5 text-sm text-fg placeholder:text-fg/35 transition-colors duration-200 focus:border-accent/60 focus:outline-none";

export function Closing({ headless = false }: { headless?: boolean }) {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);

  /**
   * No CRM is wired up yet, so the brief is handed to the visitor's mail client
   * with everything pre-filled. Swap this for the CRM/webhook endpoint when the
   * backend exists — the field names already match the intake fields.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company")}`,
      `Email: ${data.get("email")}`,
      `Primary market: ${data.get("market")}`,
      "",
      `${data.get("brief")}`,
    ].join("\n");

    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
      `NRI growth strategy — ${data.get("company")}`,
    )}&body=${encodeURIComponent(lines)}`;
    setSent(true);
  }

  return (
    <Section id="contact" className="pb-32">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          {headless ? null : (
            <>
              <Reveal className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-accent" />
                <span className="eyebrow text-fg-muted">{closing.eyebrow}</span>
              </Reveal>

              <SplitText
                text={closing.title}
                highlight={["already", "online."]}
                className="mt-8 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl"
              />

              <Reveal delay={0.1} className="mt-8">
                <p className="max-w-xl text-lg leading-relaxed text-fg-muted">{closing.body}</p>
              </Reveal>
            </>
          )}

          <Reveal delay={0.15} className={headless ? "" : "mt-10"}>
            <p className="font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
              {closing.kicker}
            </p>
            <p className="mt-4 font-display text-base font-medium text-fg/70">
              {closing.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <a
              href={`mailto:${brand.email}`}
              className="group inline-flex items-center gap-3 text-sm text-fg/70 transition-colors hover:text-accent"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/12 transition-colors group-hover:border-accent/50">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              {brand.email}
            </a>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          data-tone="dark"
          className="relative overflow-hidden rounded-3xl border border-fg/12 bg-surface p-8 text-fg sm:p-10"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-purple/25 blur-3xl"
          />

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: easeBrand }}
                className="flex min-h-[24rem] flex-col items-start justify-center"
              >
                <CheckCircle2 className="h-10 w-10 text-accent" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-fg">
                  Your brief is ready to send.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  We opened your mail client with the details filled in. If nothing appeared,
                  write to {brand.email} and we will pick it up from there.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 cursor-pointer font-display text-sm font-semibold text-accent underline underline-offset-4"
                >
                  Edit the brief
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: easeBrand }}
                className="relative flex flex-col gap-4"
              >
                <p className="eyebrow text-fg-muted">Start with the commercial target</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-fg/60">Name</span>
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={fieldClass}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-fg/60">Company</span>
                    <input
                      name="company"
                      required
                      autoComplete="organization"
                      placeholder="Developer / brand"
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-fg/60">Work email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={fieldClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-fg/60">Primary NRI market</span>
                  <select name="market" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>
                      Select a market
                    </option>
                    {markets.regions.map((region) => (
                      <option key={region.name} value={region.name} className="bg-surface">
                        {region.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-fg/60">
                    What are you launching?
                  </span>
                  <textarea
                    name="brief"
                    required
                    rows={4}
                    placeholder="Project, city, ticket size, launch window, target markets."
                    className={`${fieldClass} resize-none`}
                  />
                </label>

                <Button type="submit" className="mt-2 w-full">
                  {closing.cta}
                </Button>

                <p className="text-xs leading-relaxed text-fg/40">
                  We reply with a point of view on the market, not a deck of credentials.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  );
}
