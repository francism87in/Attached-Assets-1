import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeIndianRupee,
  ChevronDown,
  Clock3,
  HeartHandshake,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { HeroPhone } from "@/components/landing/HeroPhone";
import { Badge, Button, ButtonLink, Section, SectionHead, StarRating } from "@/components/ui";
import { cities, faqs, liveCities, promises, stats, steps, testimonials } from "@/data/content";
import { services } from "@/data/services";
import { usePrefs } from "@/store/prefs";
import { cn } from "@/lib/utils";

export function Landing() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <Why />
      <StatsBand />
      <Testimonials />
      <Cities />
      <ExpertCta />
      <Faq />
      <DownloadCta />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  const { prefs, setPrefs } = usePrefs();
  const [, navigate] = useLocation();
  const [area, setArea] = useState("");
  const city = liveCities.find((c) => c.slug === prefs.city) ?? liveCities[0];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
      <div
        className="absolute -top-40 -right-40 -z-10 size-[34rem] rounded-full bg-brand-100/60 blur-3xl"
        aria-hidden
      />
      <div className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_auto]">
        <div>
          <Badge icon={Sparkles} className="bg-spark-400 text-ink-900 ring-spark-500/40">
            Now live in {liveCities.length} cities
          </Badge>

          <h1 className="mt-5 text-[2.75rem] leading-[0.98] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            House help in
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">10 minutes.</span>
              <span
                className="absolute inset-x-0 bottom-1.5 -z-0 h-4 rounded-full bg-spark-400 sm:h-5"
                aria-hidden
              />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-400">
            Dishes, cleaning, laundry, ironing — a trained, background-verified expert at your
            door in the time it takes to make chai. Billed by the hour, from{" "}
            <span className="font-semibold text-ink-900">₹99</span>.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-4xl bg-white p-2 shadow-xl shadow-ink-900/5 ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:rounded-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (area.trim()) setPrefs({ address: area.trim() });
              navigate("/book");
            }}
          >
            <label className="flex flex-1 items-center gap-2 px-4 py-2">
              <MapPin className="size-5 shrink-0 text-brand-600" aria-hidden />
              <span className="sr-only">Your area</span>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={`Your area in ${city.name} — e.g. ${city.areas[0]}`}
                className="w-full bg-transparent text-[0.95rem] outline-none placeholder:text-ink-400/70"
              />
            </label>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Book in 10 min
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-600" aria-hidden /> Police-verified
              experts
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeIndianRupee className="size-4 text-brand-600" aria-hidden /> No visit fee
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-spark-500 text-spark-500" aria-hidden /> 4.87 from 3.2
              lakh ratings
            </span>
          </div>
        </div>

        <div className="mx-auto lg:mx-0">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- TrustBar */

function TrustBar() {
  const items = [
    "10 lakh+ homes served",
    "All-women workforce",
    "Salaried, insured experts",
    "Hourly billing from ₹99",
    "7 AM – 8 PM, every day",
  ];
  return (
    <div className="border-y border-ink-900/10 bg-white/60 py-4">
      <div className="shell no-scrollbar flex gap-8 overflow-x-auto text-sm font-semibold text-ink-600">
        {items.map((i) => (
          <span key={i} className="flex shrink-0 items-center gap-2">
            <span className="size-1.5 rounded-full bg-spark-500" aria-hidden />
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Services */

function Services() {
  return (
    <Section id="services">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="What we do"
          title="Book the job, not a whole day of someone's time"
          body="Every service is charged by the hour. Pick what needs doing, choose how long, and only the hours you use are billed."
        />
        <ButtonLink href="/book" variant="outline" className="hidden sm:inline-flex">
          See all prices
        </ButtonLink>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
          >
            <Link
              href={`/services/${s.slug}`}
              className="group flex h-full flex-col rounded-4xl bg-white p-6 ring-1 ring-ink-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/5"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-spark-400">
                  <s.icon className="size-6" aria-hidden />
                </span>
                {s.popular ? (
                  <span className="rounded-full bg-spark-400 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide uppercase">
                    Popular
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.name}</h3>
              <p className="mt-1 text-sm text-ink-400">{s.tagline}</p>
              <p className="mt-5 flex items-center gap-1 text-sm font-semibold text-ink-900">
                ₹{s.rate}
                <span className="font-normal text-ink-400">/ hour</span>
                <ArrowRight
                  className="ml-auto size-4 text-brand-600 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ HowItWorks */

function HowItWorks() {
  return (
    <Section id="how" className="bg-white">
      <SectionHead
        eyebrow="How it works"
        title="Four taps between a messy sink and a clean one"
        align="center"
      />
      <ol className="mt-14 grid gap-8 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="font-display grid size-12 place-items-center rounded-2xl bg-ink-900 text-lg font-extrabold text-spark-400">
              {i + 1}
            </span>
            {i < steps.length - 1 ? (
              <span
                className="absolute top-6 left-14 hidden h-px w-[calc(100%-3.5rem)] bg-ink-900/12 md:block"
                aria-hidden
              />
            ) : null}
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/book" size="lg">
          Try the booking flow
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- Why */

function Why() {
  return (
    <Section id="why">
      <SectionHead
        eyebrow="Why SPARK"
        title="The part nobody else fixed: who actually shows up"
        body="Ten-minute arrival only matters if you trust the person on the other side of the door. Our experts are employees, not gig workers."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promises.map((p) => (
          <div key={p.title} className="rounded-4xl bg-white p-7 ring-1 ring-ink-900/5">
            <h3 className="text-base font-bold">{p.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- StatsBand */

function StatsBand() {
  return (
    <section className="bg-brand-600 py-14 text-white">
      <div className="shell grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-4xl font-extrabold text-spark-400">{s.value}</p>
            <p className="mt-1 text-sm text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Testimonials */

function Testimonials() {
  return (
    <Section className="bg-white">
      <SectionHead
        eyebrow="From our customers"
        title="Booked once out of desperation. Kept booking out of habit."
      />
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="w-[19rem] shrink-0 snap-start rounded-4xl bg-cream p-6 ring-1 ring-ink-900/5 sm:w-[22rem]"
          >
            <StarRating value={t.rating} />
            <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-ink-600">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-900/10 pt-4">
              <span className="font-display grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {t.name.charAt(0)}
              </span>
              <span className="text-sm">
                <span className="block font-bold">{t.name}</span>
                <span className="text-ink-400">
                  {t.area} · {t.service}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- Cities */

function Cities() {
  const { setPrefs } = usePrefs();
  return (
    <Section id="cities">
      <SectionHead
        eyebrow="Where we work"
        title="Live in six cities, building in two more"
        body="We launch cluster by cluster — a set of buildings at a time — so the ten-minute promise holds from day one."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <div
            key={c.slug}
            className={cn(
              "rounded-4xl p-6 ring-1",
              c.live ? "bg-white ring-ink-900/5" : "bg-transparent ring-ink-900/10 ring-dashed",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{c.name}</h3>
              {c.live ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  <span className="size-2 rounded-full bg-spark-500" aria-hidden />
                  Live
                </span>
              ) : (
                <span className="text-xs font-semibold text-ink-400">Coming soon</span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-400">{c.state}</p>
            {c.live ? (
              <>
                <p className="mt-4 text-sm leading-relaxed text-ink-400">
                  {c.areas.join(" · ")}
                </p>
                <Link
                  href="/book"
                  onClick={() => setPrefs({ city: c.slug })}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5"
                >
                  Book in {c.name} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </>
            ) : (
              <p className="mt-4 text-sm text-ink-400">
                Hiring and training experts now. Leave your pincode in the app to get told first.
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- ExpertCta */

function ExpertCta() {
  return (
    <Section>
      <div className="grid gap-10 overflow-hidden rounded-5xl bg-ink-900 p-8 text-white sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead
            tone="dark"
            eyebrow="For experts"
            title="A salaried job, not a hustle"
            body="Fixed monthly pay, PF and insurance, eight days of paid training and shifts inside a two-kilometre radius of home. 22,000 women work with SPARK today."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/experts" variant="spark" size="lg">
              Apply as an expert
            </ButtonLink>
            <ButtonLink
              href="/experts"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              See pay and benefits
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: BadgeIndianRupee, k: "₹21,000+", v: "average monthly earning" },
            { icon: Clock3, k: "8-hour", v: "fixed shifts, no night work" },
            { icon: HeartHandshake, k: "PF + ESI", v: "on the books from day one" },
            { icon: ShieldCheck, k: "₹5 lakh", v: "health cover for her family" },
          ].map((b) => (
            <div key={b.k} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <b.icon className="size-5 text-spark-400" aria-hidden />
              <p className="font-display mt-3 text-2xl font-extrabold">{b.k}</p>
              <p className="mt-1 text-sm text-white/60">{b.v}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- Faq */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead
          eyebrow="Questions"
          title="Everything people ask before their first booking"
        />
        <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-base font-bold sm:text-lg">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-brand-600 transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <p className="pb-5 text-[0.95rem] leading-relaxed text-ink-400">{f.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------- DownloadCta */

function DownloadCta() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-5xl bg-spark-400 px-8 py-14 text-center sm:px-12">
        <div
          className="absolute -top-24 -left-24 size-72 rounded-full bg-white/40 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight font-extrabold sm:text-5xl">
            Your sink is full. Someone is nine minutes away.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-600">
            Open SPARK, drop a pin and pick an hour. That's the whole thing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/book" variant="dark" size="lg">
              Book a service
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/app" variant="outline" size="lg">
              Open the app
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs font-semibold tracking-wide text-ink-600 uppercase">
            Prototype · no real bookings are placed
          </p>
        </div>
      </div>
    </Section>
  );
}

/* Small helper kept for the service-detail page's hour stepper. */
export function HourStepper({
  value,
  onChange,
  min = 1,
  max = 4,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white p-1.5 ring-1 ring-ink-900/10">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid size-9 place-items-center rounded-full bg-ink-900/5 disabled:opacity-40"
        aria-label="Fewer hours"
      >
        <Minus className="size-4" />
      </button>
      <span className="font-display w-16 text-center text-base font-bold">
        {value} {value === 1 ? "hour" : "hours"}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid size-9 place-items-center rounded-full bg-ink-900/5 disabled:opacity-40"
        aria-label="More hours"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
