import { Link } from "wouter";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { Logo } from "@/components/ui";
import { cities } from "@/data/content";
import { services } from "@/data/services";

type FooterLink = { label: string; href?: string; section?: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About SPARK", section: "why" },
      { label: "Become an expert", href: "/experts" },
      { label: "Careers", href: "/experts" },
      { label: "Press", section: "why" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", section: "faq" },
      { label: "Safety", section: "why" },
      { label: "Cancellation policy", section: "faq" },
      { label: "Contact us", section: "faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink-900 pt-16 pb-10 text-white/70">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Trained, background-verified home experts at your door in ten minutes. Billed by
              the hour, from ₹99.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <SectionLink
                  key={i}
                  section="why"
                  className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-spark-400 hover:text-ink-900"
                  aria-label="SPARK on social media"
                >
                  <Icon className="size-4" />
                </SectionLink>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-spark-400">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold text-white">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.section ? (
                      <SectionLink section={l.section} className="hover:text-spark-400">
                        {l.label}
                      </SectionLink>
                    ) : (
                      <Link href={l.href!} className="hover:text-spark-400">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <h3 className="mb-3 text-sm font-bold text-white">Cities</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="hover:text-spark-400"
              >
                House help in {c.name}
                {c.live ? "" : " (soon)"}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SPARK Home Services Pvt. Ltd. Prototype build.</p>
          <p className="flex gap-4">
            <SectionLink section="faq" className="hover:text-spark-400">
              Terms
            </SectionLink>
            <SectionLink section="faq" className="hover:text-spark-400">
              Privacy
            </SectionLink>
            <SectionLink section="faq" className="hover:text-spark-400">
              Grievance officer
            </SectionLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
