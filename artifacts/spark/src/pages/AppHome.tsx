import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AppScreen } from "@/components/AppScreen";
import { BottomNav } from "@/components/BottomNav";
import { ButtonLink } from "@/components/ui";
import { cities, experts } from "@/data/content";
import { serviceBySlug, services } from "@/data/services";
import { STATUS_HEADLINES, useBookings } from "@/store/bookings";
import { usePrefs } from "@/store/prefs";
import { rupees } from "@/lib/utils";

/** The app's own home screen — what the installed build opens on. */
export function AppHome() {
  const { prefs } = usePrefs();
  const { bookings, activeBooking } = useBookings();
  const city = cities.find((c) => c.slug === prefs.city) ?? cities[0];
  const lastCompleted = bookings.find((b) => b.status === "completed");

  return (
    <AppScreen footer={<BottomNav />}>
      <header className="bg-ink-900 px-5 pt-4 pb-16 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[0.7rem] font-semibold tracking-wide text-spark-400 uppercase">
              <MapPin className="size-3.5" aria-hidden /> Delivering to
            </p>
            <p className="font-display truncate text-lg font-extrabold">
              {prefs.address || `${city.areas[0] ?? city.name}, ${city.name}`}
            </p>
          </div>
          <Link
            href="/account"
            aria-label="Account"
            className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-spark-400 font-extrabold text-ink-900"
          >
            A
          </Link>
        </div>
      </header>

      <div className="-mt-12 space-y-5 px-5 pb-6">
        {activeBooking ? (
          <Link
            href={`/track/${activeBooking.id}`}
            className="flex items-center gap-3 rounded-3xl bg-brand-600 p-4 text-white shadow-lg shadow-brand-600/25"
          >
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-spark-400 opacity-75 animate-spark-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-spark-400" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">
                {serviceBySlug(activeBooking.serviceSlug)?.name} ·{" "}
                {STATUS_HEADLINES[activeBooking.status]}
              </span>
              <span className="block truncate text-xs text-white/70">
                {activeBooking.expert.name} · #{activeBooking.id}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0" aria-hidden />
          </Link>
        ) : (
          <div className="rounded-3xl bg-brand-600 p-5 text-white shadow-lg shadow-brand-600/25">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-spark-400">
              <Sparkles className="size-3.5" aria-hidden /> 14 experts on shift near you
            </p>
            <p className="font-display mt-1 text-2xl font-extrabold">Arriving in 10 min</p>
            <p className="mt-1 text-sm text-white/70">
              Hourly help from ₹99. No visit fee, no minimum.
            </p>
            <ButtonLink href="/book" variant="spark" className="mt-4 w-full">
              Book now
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        )}

        <section>
          <h2 className="mb-3 text-sm font-bold">What needs doing?</h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/book/${s.slug}`}
                className="rounded-3xl bg-white p-4 ring-1 ring-ink-900/5 active:scale-[0.98]"
              >
                <s.icon className="mb-3 size-6 text-brand-600" aria-hidden />
                <p className="text-sm leading-tight font-bold">{s.name}</p>
                <p className="mt-1 text-xs text-ink-400">₹{s.rate}/hr</p>
              </Link>
            ))}
          </div>
        </section>

        {lastCompleted ? (
          <section>
            <h2 className="mb-3 text-sm font-bold">Book again</h2>
            <Link
              href={`/book/${lastCompleted.serviceSlug}`}
              className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-900/5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Repeat2 className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {serviceBySlug(lastCompleted.serviceSlug)?.name}
                </span>
                <span className="block truncate text-xs text-ink-400">
                  {lastCompleted.hours} {lastCompleted.hours === 1 ? "hr" : "hrs"} ·{" "}
                  {rupees(lastCompleted.total)} · {lastCompleted.expert.name}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-400" aria-hidden />
            </Link>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-sm font-bold">Experts working near you</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
            {experts.map((e) => (
              <div
                key={e.name}
                className="w-40 shrink-0 rounded-3xl bg-white p-4 ring-1 ring-ink-900/5"
              >
                <span className="font-display grid size-11 place-items-center rounded-full bg-brand-50 font-bold text-brand-700">
                  {e.initials}
                </span>
                <p className="mt-3 text-sm font-bold">{e.name}</p>
                <p className="flex items-center gap-1 text-xs text-ink-400">
                  <Star className="size-3 fill-spark-500 text-spark-500" aria-hidden />
                  {e.rating} · since {e.since}
                </p>
                <p className="mt-1 text-xs text-ink-400">{e.speciality}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-900/5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
          <p className="text-xs leading-relaxed text-ink-400">
            Every expert is police-verified, salaried and trained for eight days. Bookings are
            covered up to ₹25,000 against damage.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold text-ink-400"
        >
          <Zap className="size-3.5" aria-hidden /> About SPARK
        </Link>
      </div>
    </AppScreen>
  );
}
