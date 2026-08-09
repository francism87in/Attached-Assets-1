import { Link, useParams } from "wouter";
import { ArrowRight, Check, Clock3, ShieldCheck, X } from "lucide-react";
import { Badge, ButtonLink, Section, SectionHead } from "@/components/ui";
import { liveCities, steps } from "@/data/content";
import { serviceBySlug, services } from "@/data/services";
import { rupees } from "@/lib/utils";

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceBySlug(slug);

  if (!service) {
    return (
      <Section>
        <SectionHead
          title="We don't offer that yet"
          body="Pick one of our live services instead — or tell us what you need in the app."
        />
        <ButtonLink href="/#services" className="mt-8">
          See all services
        </ButtonLink>
      </Section>
    );
  }

  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <section className="pt-8 pb-14">
        <div className="shell grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav className="mb-6 text-sm text-ink-400">
              <Link href="/" className="hover:text-ink-900">
                Home
              </Link>
              <span className="px-2">/</span>
              <Link href="/#services" className="hover:text-ink-900">
                Services
              </Link>
              <span className="px-2">/</span>
              <span className="text-ink-900">{service.name}</span>
            </nav>

            <span className="grid size-14 place-items-center rounded-3xl bg-brand-600 text-spark-400">
              <Icon className="size-7" aria-hidden />
            </span>

            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
              {service.name} in 10 minutes
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-400">{service.blurb}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Badge icon={Clock3}>{service.suggestedHours} hr typical</Badge>
              <Badge icon={ShieldCheck}>Verified expert</Badge>
              <Badge>Supplies included</Badge>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href={`/book?service=${service.slug}`} size="lg">
                Book for {rupees(service.rate)}/hr
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <p className="text-sm text-ink-400">No visit fee · pay only for hours used</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-4xl bg-white p-6 ring-1 ring-ink-900/5">
              <h2 className="text-base font-bold">What's included</h2>
              <ul className="mt-4 space-y-2.5">
                {service.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-4xl bg-white p-6 ring-1 ring-ink-900/5">
              <h2 className="text-base font-bold">Not included</h2>
              <ul className="mt-4 space-y-2.5">
                {service.excludes.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-400">
                    <X className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-400">
                Need one of these? Message support in the app and we'll send a specialist crew.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <SectionHead eyebrow="How it works" title={`Booking ${service.name.toLowerCase()}`} />
        <ol className="mt-10 grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="font-display grid size-11 place-items-center rounded-2xl bg-ink-900 font-extrabold text-spark-400">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="rounded-4xl bg-white p-8 ring-1 ring-ink-900/5">
          <h2 className="text-xl font-bold">Available in</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {liveCities.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="rounded-full bg-cream px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/10 hover:ring-brand-600"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <h2 className="mt-14 text-xl font-bold">People also book</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-3xl bg-white p-5 ring-1 ring-ink-900/5 transition-all hover:-translate-y-1"
            >
              <s.icon className="size-5 text-brand-600" aria-hidden />
              <p className="mt-3 font-bold">{s.name}</p>
              <p className="mt-0.5 text-sm text-ink-400">₹{s.rate}/hr</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
