import { Link, useParams } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { Badge, ButtonLink, Section, SectionHead, StarRating } from "@/components/ui";
import { cityBySlug, stats, testimonials } from "@/data/content";
import { services } from "@/data/services";
import { usePrefs } from "@/store/prefs";

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = cityBySlug(slug);
  const { setPrefs } = usePrefs();

  if (!city) {
    return (
      <Section>
        <SectionHead
          title="We're not in that city yet"
          body="SPARK is live in six cities and launching in two more. Check the list on the home page."
        />
        <SectionLink
          section="cities"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-brand-600 px-5 font-semibold text-white"
        >
          See our cities
        </SectionLink>
      </Section>
    );
  }

  if (!city.live) {
    return (
      <Section>
        <Badge icon={MapPin}>Launching soon</Badge>
        <SectionHead
          title={`SPARK is coming to ${city.name}`}
          body="We're hiring and training experts here right now. Clusters go live one at a time, starting with the first buildings where we have enough experts to hold the ten-minute promise."
        />
        <ButtonLink href="/book" className="mt-8">
          Join the waitlist
        </ButtonLink>
      </Section>
    );
  }

  const cityQuotes = testimonials.filter((t) => t.area.includes(city.name)).slice(0, 2);
  const quotes = cityQuotes.length ? cityQuotes : testimonials.slice(0, 2);

  return (
    <>
      <section className="pt-8 pb-12">
        <div className="shell">
          <Badge icon={MapPin}>
            {city.name}, {city.state}
          </Badge>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold sm:text-6xl">
            House help in {city.name}, at your door in 10 minutes
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-400">
            Trained, background-verified experts working salaried shifts across{" "}
            {city.areas.length} clusters in {city.name}. Dishes, cleaning, laundry and more —
            billed by the hour from ₹99.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book" size="lg" onClick={() => setPrefs({ city: city.slug })}>
              Book in {city.name}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/experts" variant="outline" size="lg">
              Work with us in {city.name}
            </ButtonLink>
          </div>

          <dl className="mt-12 grid gap-6 rounded-4xl bg-white p-8 ring-1 ring-ink-900/5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-extrabold text-brand-600">{s.value}</dt>
                <dd className="mt-1 text-sm text-ink-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section className="bg-white">
        <SectionHead eyebrow="Coverage" title={`Where we work in ${city.name}`} />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {city.areas.map((a) => (
            <span
              key={a}
              className="rounded-full bg-cream px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/10"
            >
              {a}
            </span>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-sm text-ink-400">
          Don't see your building? Drop a pin in the app — we open new clusters wherever demand
          builds up.
        </p>
      </Section>

      <Section>
        <SectionHead eyebrow="Services" title={`What you can book in ${city.name}`} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-3xl bg-white p-6 ring-1 ring-ink-900/5 transition-all hover:-translate-y-1"
            >
              <s.icon className="size-6 text-brand-600" aria-hidden />
              <p className="mt-4 font-bold">{s.name}</p>
              <p className="mt-1 text-sm text-ink-400">₹{s.rate}/hr in {city.name}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHead eyebrow="Locally" title={`What ${city.name} says`} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {quotes.map((t) => (
            <figure key={t.name} className="rounded-4xl bg-cream p-6 ring-1 ring-ink-900/5">
              <StarRating value={t.rating} />
              <blockquote className="mt-4 leading-relaxed text-ink-600">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {t.name} <span className="font-normal text-ink-400">· {t.area}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
