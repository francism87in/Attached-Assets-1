import { useState } from "react";
import {
  BadgeIndianRupee,
  BusFront,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { Badge, Button, Section, SectionHead } from "@/components/ui";
import { liveCities } from "@/data/content";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: BadgeIndianRupee,
    title: "₹21,000+ a month",
    body: "A fixed salary paid on the 1st, plus shift and rating bonuses. Not per-task payouts that dry up in the monsoon.",
  },
  {
    icon: GraduationCap,
    title: "8 days of paid training",
    body: "Technique, chemicals, safety, and how to handle an awkward customer. You're paid for every training day.",
  },
  {
    icon: BusFront,
    title: "Work within 2 km of home",
    body: "Shifts are inside your own cluster of buildings. No two-hour commute, no night work.",
  },
  {
    icon: HeartPulse,
    title: "PF, ESI and ₹5 lakh cover",
    body: "On the books from day one, with health cover that includes your family.",
  },
  {
    icon: ShieldCheck,
    title: "Backed in a dispute",
    body: "Damage claims are settled by SPARK, never docked from your salary. A support lead is on call all shift.",
  },
  {
    icon: CheckCircle2,
    title: "A path out of the app",
    body: "Top-rated experts become cluster trainers and shift leads. 400 women have moved up already.",
  },
];

export function Experts() {
  const [submitted, setSubmitted] = useState(false);
  const [city, setCity] = useState(liveCities[0].slug);

  return (
    <>
      <section className="pt-8 pb-14">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="bg-spark-400 ring-spark-500/40">We're hiring 8,000 experts</Badge>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-6xl">
              A salaried job.
              <br />
              Not a hustle.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-400">
              SPARK experts are employees — fixed monthly pay, PF, insurance, paid training and
              eight-hour shifts close to home. 22,000 women work with us across six cities.
            </p>
          </div>

          <div className="rounded-5xl bg-ink-900 p-7 text-white">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-12 text-spark-400" aria-hidden />
                <h2 className="font-display mt-5 text-2xl font-extrabold">Application received</h2>
                <p className="mt-2 text-sm text-white/70">
                  A recruiter from the {liveCities.find((c) => c.slug === city)?.name} team calls
                  within two working days. Prototype only — nothing was actually sent.
                </p>
                <Button
                  variant="spark"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Fill it again
                </Button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <h2 className="font-display text-2xl font-extrabold">Apply in a minute</h2>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/70">Your name</span>
                  <input
                    required
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-spark-400"
                    placeholder="Full name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/70">
                    Mobile number
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15 outline-none placeholder:text-white/40 focus:ring-2 focus:ring-spark-400"
                    placeholder="10-digit number"
                  />
                </label>
                <div>
                  <span className="mb-2 block text-sm font-semibold text-white/70">City</span>
                  <div className="flex flex-wrap gap-2">
                    {liveCities.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setCity(c.slug)}
                        className={cn(
                          "rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-colors",
                          c.slug === city
                            ? "bg-spark-400 text-ink-900 ring-spark-400"
                            : "bg-white/5 text-white/70 ring-white/15",
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" variant="spark" size="lg" className="w-full">
                  Submit application
                </Button>
                <p className="text-center text-xs text-white/50">
                  We only ask for Aadhaar and references after the first call.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <SectionHead eyebrow="What you get" title="What working at SPARK actually means" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-4xl bg-cream p-7 ring-1 ring-ink-900/5">
              <b.icon className="size-6 text-brand-600" aria-hidden />
              <h3 className="mt-4 font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Hiring process"
          title="Four steps, about a week"
          body="No agent, no deposit, no fee — at any stage. If anyone asks you for money to join SPARK, report it to us."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {[
            { t: "Apply", b: "Fill the form or walk into a hiring camp with your Aadhaar." },
            { t: "Meet us", b: "A 20-minute conversation at the cluster office nearest you." },
            { t: "Verification", b: "Aadhaar and police verification, plus two references." },
            { t: "Paid training", b: "Eight days of training, then your first shift." },
          ].map((s, i) => (
            <li key={s.t}>
              <span className="font-display grid size-11 place-items-center rounded-2xl bg-brand-600 font-extrabold text-spark-400">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{s.b}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
