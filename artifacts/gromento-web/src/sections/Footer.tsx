import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { Marquee } from "@/components/Marquee";
import { brand } from "@/data/site";
import { routes } from "@/routes";

export function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-surface-sunken text-fg">
      <div data-tone="dark" className="border-y border-fg/10 bg-surface py-6 text-fg">
        <Marquee duration={30} fade={false}>
          {[0, 1, 2].map((copy) => (
            <span key={copy} className="flex items-center gap-6 px-6">
              <span className="font-display text-2xl font-semibold tracking-tight text-fg/85 sm:text-3xl">
                Grow <span className="text-accent">Louder.</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-fg/85 sm:text-3xl">
                Move <span className="text-accent">Upward.</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-fg/30 sm:text-3xl">
                Every single time.
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Gromento — home">
            <Logo />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-muted">
            Real estate marketing built for global Indian buyers — market intelligence, content,
            creative, performance and conversion in one system.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-fg/35">Pages</p>
          <ul className="mt-5 flex flex-col gap-3">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className="text-sm text-fg/65 transition-colors hover:text-accent"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-fg/35">Contact</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <li>
              <a
                href={`mailto:${brand.email}`}
                className="text-fg/65 transition-colors hover:text-accent"
              >
                {brand.email}
              </a>
            </li>
            <li>
              <Link href="/contact" className="text-fg/65 transition-colors hover:text-accent">
                Talk to Gromento
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-fg/10 px-6 py-8 text-xs text-fg/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {brand.name}. Trend-led marketing for NRI real estate
          demand.
        </p>
        <p className="font-display tracking-tight">{brand.taglineFull}</p>
      </div>
    </footer>
  );
}
