import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { Button, ButtonLink, Logo } from "@/components/ui";
import { liveCities } from "@/data/content";
import { cn } from "@/lib/utils";

const links = [
  { label: "Services", section: "services" },
  { label: "How it works", section: "how" },
  { label: "Why SPARK", section: "why" },
  { label: "Cities", section: "cities" },
  { label: "FAQ", section: "faq" },
];

export function SiteNav({
  city,
  onCityChange,
}: {
  city: string;
  onCityChange: (slug: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCity = liveCities.find((c) => c.slug === city) ?? liveCities[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        scrolled ? "border-b border-ink-900/10 bg-cream/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="shell flex h-18 items-center justify-between gap-4">
        <Link href="/" aria-label="SPARK home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <SectionLink
              key={l.section}
              section={l.section}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
            >
              {l.label}
            </SectionLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setCityOpen((v) => !v)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-4 text-sm font-semibold"
              aria-expanded={cityOpen}
            >
              <MapPin className="size-4 text-brand-600" aria-hidden />
              {activeCity.name}
              <ChevronDown className="size-4 text-ink-400" aria-hidden />
            </button>
            {cityOpen ? (
              <ul className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-ink-900/10 bg-white p-1.5 shadow-xl shadow-ink-900/10">
                {liveCities.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        onCityChange(c.slug);
                        setCityOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-brand-50",
                        c.slug === activeCity.slug && "bg-brand-50 text-brand-700",
                      )}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <ButtonLink href="/book" className="hidden sm:inline-flex">
            Book in 10 min
          </ButtonLink>

          <Button
            variant="outline"
            size="sm"
            className="size-10 px-0 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-ink-900/10 bg-cream lg:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {links.map((l) => (
              <SectionLink
                key={l.section}
                section={l.section}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 font-medium text-ink-600 hover:bg-white"
              >
                {l.label}
              </SectionLink>
            ))}
            <ButtonLink href="/book" className="mt-2" onClick={() => setMenuOpen(false)}>
              Book in 10 min
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
