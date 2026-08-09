import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Info,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { AppHeader, AppScreen, ProgressBar } from "@/components/AppScreen";
import { Button } from "@/components/ui";
import { cities, liveCities } from "@/data/content";
import { hourOptions, serviceBySlug, services } from "@/data/services";
import { priceOf, useBookings } from "@/store/bookings";
import { usePrefs } from "@/store/prefs";
import { cn, dayLabel, rupees, toAmPm } from "@/lib/utils";

const STEPS = ["Location", "Service", "When", "Pay"] as const;

/** Next seven bookable days. */
function nextDays(count = 5) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

/** 7:00 AM – 8:00 PM in 30-minute slots, skipping anything already past today. */
function slotsFor(day: Date) {
  const now = new Date();
  const isToday = day.toDateString() === now.toDateString();
  const out: string[] = [];
  for (let h = 7; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes() + 30)))
        continue;
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}

export function Book() {
  const [, navigate] = useLocation();
  const { prefs, setPrefs } = usePrefs();
  const { createBooking } = useBookings();
  // /book/:service jumps straight past the service picker.
  const { service: routeService } = useParams<{ service?: string }>();
  const preselected = routeService && serviceBySlug(routeService) ? routeService : null;

  const [step, setStep] = useState(preselected ? 2 : 0);
  const [city, setCity] = useState(prefs.city);
  const [area, setArea] = useState("");
  const [address, setAddress] = useState(prefs.address);
  const [serviceSlug, setServiceSlug] = useState(preselected ?? "");
  const [hours, setHours] = useState(
    () => (preselected ? serviceBySlug(preselected)?.suggestedHours : 1) ?? 1,
  );
  const [instant, setInstant] = useState(true);
  const [day, setDay] = useState(() => nextDays()[0]);
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");

  const service = serviceBySlug(serviceSlug);
  const { rate, total } = useMemo(
    () => (service ? priceOf(service.slug, hours) : { rate: 0, total: 0 }),
    [service, hours],
  );

  const days = useMemo(() => nextDays(), []);
  const slots = useMemo(() => slotsFor(day), [day]);

  const canContinue =
    (step === 0 && address.trim().length > 3) ||
    (step === 1 && Boolean(service)) ||
    (step === 2 && (instant || Boolean(slot))) ||
    step === 3;

  function handleContinue() {
    if (!canContinue) return;
    if (step === 0) setPrefs({ city, address: address.trim() });
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (!service) return;

    let when: "now" | string = "now";
    if (!instant) {
      const [h, m] = slot.split(":").map(Number);
      const scheduled = new Date(day);
      scheduled.setHours(h, m, 0, 0);
      when = scheduled.toISOString();
    }

    const booking = createBooking({
      serviceSlug: service.slug,
      hours,
      citySlug: city,
      area: area || (cities.find((c) => c.slug === city)?.areas[0] ?? ""),
      address: address.trim(),
      notes: notes.trim(),
      when,
    });
    navigate(`/track/${booking.id}`);
  }

  return (
    <AppScreen
      footer={
        <div className="flex items-center gap-3">
          {service && step > 0 ? (
            <div className="min-w-0">
              <p className="font-display text-lg leading-none font-extrabold">{rupees(total)}</p>
              <p className="truncate text-[0.7rem] text-ink-400">
                {hours} {hours === 1 ? "hr" : "hrs"} × ₹{rate}
              </p>
            </div>
          ) : null}
          <Button
            className="flex-1"
            size="lg"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {step === 3 ? `Pay ${rupees(total)}` : "Continue"}
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      }
    >
      <AppHeader
        title={STEPS[step]}
        subtitle={`Step ${step + 1} of ${STEPS.length}`}
        onBack={step === 0 ? undefined : () => setStep(step - 1)}
        backHref="/"
      />
      <ProgressBar step={step} total={STEPS.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-8"
        >
          {step === 0 ? (
            <LocationStep
              city={city}
              setCity={setCity}
              area={area}
              setArea={setArea}
              address={address}
              setAddress={setAddress}
            />
          ) : null}

          {step === 1 ? (
            <ServiceStep
              value={serviceSlug}
              onChange={(slug) => {
                setServiceSlug(slug);
                setHours(serviceBySlug(slug)?.suggestedHours ?? 1);
              }}
            />
          ) : null}

          {step === 2 ? (
            <WhenStep
              hours={hours}
              setHours={setHours}
              instant={instant}
              setInstant={setInstant}
              days={days}
              day={day}
              setDay={(d) => {
                setDay(d);
                setSlot("");
              }}
              slots={slots}
              slot={slot}
              setSlot={setSlot}
            />
          ) : null}

          {step === 3 && service ? (
            <PayStep
              serviceName={service.name}
              includes={service.includes}
              hours={hours}
              rate={rate}
              total={total}
              address={address}
              cityName={cities.find((c) => c.slug === city)?.name ?? ""}
              area={area}
              instant={instant}
              day={day}
              slot={slot}
              notes={notes}
              setNotes={setNotes}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </AppScreen>
  );
}

/* ---------------------------------------------------------------- Step 1 */

function LocationStep({
  city,
  setCity,
  area,
  setArea,
  address,
  setAddress,
}: {
  city: string;
  setCity: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
}) {
  const areas = cities.find((c) => c.slug === city)?.areas ?? [];
  return (
    <div>
      <div className="map-grid relative mb-6 h-36 overflow-hidden rounded-3xl bg-sand ring-1 ring-ink-900/5">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 rounded-full bg-brand-400/40 animate-spark-ping" />
          <span className="relative grid size-9 place-items-center rounded-full bg-brand-600 text-white ring-4 ring-white">
            <MapPin className="size-4" aria-hidden />
          </span>
        </span>
      </div>

      <p className="mb-2.5 text-sm font-bold">Your city</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {liveCities.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCity(c.slug)}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-colors",
              c.slug === city
                ? "bg-brand-600 text-white ring-brand-600"
                : "bg-white text-ink-600 ring-ink-900/10",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {areas.length ? (
        <>
          <p className="mb-2.5 text-sm font-bold">Nearby clusters</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {areas.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setArea(a === area ? "" : a)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
                  a === area
                    ? "bg-spark-400 text-ink-900 ring-spark-500"
                    : "bg-white text-ink-600 ring-ink-900/10",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <label className="block">
        <span className="mb-2.5 block text-sm font-bold">Flat, building and street</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="e.g. B-1204, Lake Homes, Adi Shankaracharya Marg"
          className="w-full resize-none rounded-2xl bg-white p-4 text-sm ring-1 ring-ink-900/10 outline-none placeholder:text-ink-400/70 focus:ring-2 focus:ring-brand-600"
        />
      </label>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        We only match experts already on shift inside your cluster — that's what keeps arrival
        under ten minutes.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- Step 2 */

function ServiceStep({ value, onChange }: { value: string; onChange: (slug: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold">What needs doing?</p>
      <div className="grid grid-cols-2 gap-3">
        {services.map((s) => {
          const selected = s.slug === value;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => onChange(s.slug)}
              className={cn(
                "relative rounded-3xl bg-white p-4 text-left ring-1 transition-all",
                selected ? "ring-2 ring-brand-600" : "ring-ink-900/5 hover:ring-ink-900/20",
              )}
            >
              {selected ? (
                <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-brand-600 text-white">
                  <Check className="size-3" aria-hidden />
                </span>
              ) : null}
              <s.icon className="mb-3 size-6 text-brand-600" aria-hidden />
              <p className="text-sm leading-tight font-bold">{s.name}</p>
              <p className="mt-1 text-xs text-ink-400">₹{s.rate}/hr</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Step 3 */

function WhenStep({
  hours,
  setHours,
  instant,
  setInstant,
  days,
  day,
  setDay,
  slots,
  slot,
  setSlot,
}: {
  hours: number;
  setHours: (n: number) => void;
  instant: boolean;
  setInstant: (v: boolean) => void;
  days: Date[];
  day: Date;
  setDay: (d: Date) => void;
  slots: string[];
  slot: string;
  setSlot: (s: string) => void;
}) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-bold">How long do you need her?</p>
      <div className="mb-3 flex items-center justify-between rounded-3xl bg-white p-2 ring-1 ring-ink-900/5">
        <button
          type="button"
          onClick={() => setHours(Math.max(1, hours - 1))}
          disabled={hours <= 1}
          className="grid size-10 place-items-center rounded-full bg-ink-900/5 disabled:opacity-40"
          aria-label="Fewer hours"
        >
          <Minus className="size-4" />
        </button>
        <span className="font-display text-xl font-extrabold">
          {hours} {hours === 1 ? "hour" : "hours"}
        </span>
        <button
          type="button"
          onClick={() => setHours(Math.min(hourOptions.at(-1)!, hours + 1))}
          disabled={hours >= hourOptions.at(-1)!}
          className="grid size-10 place-items-center rounded-full bg-ink-900/5 disabled:opacity-40"
          aria-label="More hours"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <p className="mb-6 text-xs text-ink-400">
        Finish early and we refund the unused time to the minute.
      </p>

      <p className="mb-2.5 text-sm font-bold">When?</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setInstant(true)}
          className={cn(
            "rounded-3xl bg-white p-4 text-left ring-1 transition-all",
            instant ? "ring-2 ring-brand-600" : "ring-ink-900/5",
          )}
        >
          <Zap
            className={cn("mb-2 size-5", instant ? "text-brand-600" : "text-ink-400")}
            aria-hidden
          />
          <p className="text-sm font-bold">Right now</p>
          <p className="mt-0.5 text-xs text-ink-400">Arrives in ~10 min</p>
        </button>
        <button
          type="button"
          onClick={() => setInstant(false)}
          className={cn(
            "rounded-3xl bg-white p-4 text-left ring-1 transition-all",
            !instant ? "ring-2 ring-brand-600" : "ring-ink-900/5",
          )}
        >
          <CalendarClock
            className={cn("mb-2 size-5", !instant ? "text-brand-600" : "text-ink-400")}
            aria-hidden
          />
          <p className="text-sm font-bold">Schedule</p>
          <p className="mt-0.5 text-xs text-ink-400">Pick a slot</p>
        </button>
      </div>

      {!instant ? (
        <div className="mt-6">
          <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
            {days.map((d) => {
              const active = d.toDateString() === day.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setDay(d)}
                  className={cn(
                    "shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold ring-1 transition-colors",
                    active
                      ? "bg-ink-900 text-white ring-ink-900"
                      : "bg-white text-ink-600 ring-ink-900/10",
                  )}
                >
                  {dayLabel(d)}
                </button>
              );
            })}
          </div>

          {slots.length ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={cn(
                    "rounded-xl py-2.5 text-xs font-semibold ring-1 transition-colors",
                    s === slot
                      ? "bg-brand-600 text-white ring-brand-600"
                      : "bg-white text-ink-600 ring-ink-900/10",
                  )}
                >
                  {toAmPm(s)}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-4 text-sm text-ink-400 ring-1 ring-ink-900/5">
              No slots left today. Pick tomorrow, or book "Right now" instead.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 flex items-start gap-3 rounded-3xl bg-brand-50 p-4 ring-1 ring-brand-100">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
          <p className="text-xs leading-relaxed text-brand-700">
            14 experts are on shift near you right now. The nearest free one is assigned the
            moment you pay.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Step 4 */

function PayStep({
  serviceName,
  includes,
  hours,
  rate,
  total,
  address,
  cityName,
  area,
  instant,
  day,
  slot,
  notes,
  setNotes,
}: {
  serviceName: string;
  includes: string[];
  hours: number;
  rate: number;
  total: number;
  address: string;
  cityName: string;
  area: string;
  instant: boolean;
  day: Date;
  slot: string;
  notes: string;
  setNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-lg font-extrabold">{serviceName}</p>
            <p className="text-sm text-ink-400">
              {hours} {hours === 1 ? "hour" : "hours"} ·{" "}
              {instant ? "arriving in ~10 min" : `${dayLabel(day)}, ${toAmPm(slot)}`}
            </p>
          </div>
          <span className="rounded-full bg-spark-400 px-3 py-1 text-xs font-bold">
            {rupees(rate)}/hr
          </span>
        </div>
        <ul className="mt-4 space-y-1.5 border-t border-ink-900/10 pt-4">
          {includes.map((i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
              <Check className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
        <p className="flex items-center gap-2 text-sm font-bold">
          <MapPin className="size-4 text-brand-600" aria-hidden /> Address
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          {address}
          <br />
          {[area, cityName].filter(Boolean).join(", ")}
        </p>
      </div>

      <label className="block">
        <span className="mb-2.5 block text-sm font-bold">Anything she should know?</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. Please ring the bell twice, dog at home"
          className="w-full resize-none rounded-2xl bg-white p-4 text-sm ring-1 ring-ink-900/10 outline-none placeholder:text-ink-400/70 focus:ring-2 focus:ring-brand-600"
        />
      </label>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Wallet className="size-4 text-brand-600" aria-hidden /> Bill
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between text-ink-400">
            <dt>
              {serviceName} · {hours} {hours === 1 ? "hr" : "hrs"}
            </dt>
            <dd>{rupees(total)}</dd>
          </div>
          <div className="flex justify-between text-ink-400">
            <dt>Visit fee</dt>
            <dd className="text-brand-600">₹0</dd>
          </div>
          <div className="flex justify-between border-t border-ink-900/10 pt-2 font-bold text-ink-900">
            <dt>Total</dt>
            <dd>{rupees(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
          <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden />
          Unused minutes are refunded automatically after the booking ends.
        </p>
      </div>
    </div>
  );
}
