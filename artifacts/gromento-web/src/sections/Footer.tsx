import { Logo } from "@/components/Logo";
import { Marquee } from "@/components/Marquee";
import { brand, nav } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-sunken/60">
      <div className="border-b border-white/10 py-6">
        <Marquee duration={30} fade={false}>
          {[0, 1, 2].map((copy) => (
            <span key={copy} className="flex items-center gap-6 px-6">
              <span className="font-display text-2xl font-semibold tracking-tight text-white/85 sm:text-3xl">
                Grow <span className="text-lime">Louder.</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white/85 sm:text-3xl">
                Move <span className="text-lime">Upward.</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white/30 sm:text-3xl">
                Every single time.
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-cool">
            Real estate marketing built for global Indian buyers — market intelligence, content,
            creative, performance and conversion in one system.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-white/35">Sections</p>
          <ul className="mt-5 flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-white/65 transition-colors hover:text-lime"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-white/35">Contact</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <li>
              <a
                href={`mailto:${brand.email}`}
                className="text-white/65 transition-colors hover:text-lime"
              >
                {brand.email}
              </a>
            </li>
            <li>
              <a href="#contact" className="text-white/65 transition-colors hover:text-lime">
                Talk to Gromento
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-white/10 px-6 py-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {brand.name}. Trend-led marketing for NRI real estate
          demand.
        </p>
        <p className="font-display tracking-tight">{brand.taglineFull}</p>
      </div>
    </footer>
  );
}
