import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Phone, ShieldCheck, Sparkles, Star } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const FRAMES = ["pick", "matching", "otw"] as const;
type Frame = (typeof FRAMES)[number];

const durations: Record<Frame, number> = { pick: 3200, matching: 2600, otw: 4600 };

/** Auto-playing three-beat demo of the booking flow, shown beside the hero copy. */
export function HeroPhone() {
  const [frame, setFrame] = useState<Frame>("pick");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFrame((f) => FRAMES[(FRAMES.indexOf(f) + 1) % FRAMES.length]);
    }, durations[frame]);
    return () => window.clearTimeout(timer);
  }, [frame]);

  return (
    <div className="relative">
      <div
        className="absolute -inset-8 -z-10 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <PhoneFrame>
        <div className="h-[600px] bg-cream pt-11">
          <AnimatePresence mode="wait">
            {frame === "pick" ? <PickFrame key="pick" /> : null}
            {frame === "matching" ? <MatchingFrame key="matching" /> : null}
            {frame === "otw" ? <OtwFrame key="otw" /> : null}
          </AnimatePresence>
        </div>
      </PhoneFrame>

      <motion.div
        className="absolute top-32 -left-36 hidden rounded-2xl bg-white px-4 py-3 shadow-xl shadow-ink-900/10 ring-1 ring-ink-900/5 xl:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[0.7rem] font-semibold text-ink-400">Median arrival</p>
        <p className="font-display text-xl font-extrabold">9 min 12 s</p>
      </motion.div>

      <motion.div
        className="absolute -bottom-7 right-4 hidden rounded-2xl bg-ink-900 px-4 py-3 text-white shadow-xl xl:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-spark-400">
          <ShieldCheck className="size-3.5" /> Verified expert
        </p>
        <p className="font-display text-xl font-extrabold">22,000 on shift</p>
      </motion.div>
    </div>
  );
}

const frameMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35 },
};

function PickFrame() {
  return (
    <motion.div {...frameMotion} className="px-5 pt-3">
      <p className="text-[0.7rem] font-semibold tracking-wide text-ink-400 uppercase">
        Delivering to
      </p>
      <p className="font-display text-lg font-bold">Hiranandani, Powai</p>

      <div className="mt-4 rounded-2xl bg-brand-600 p-4 text-white">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-spark-400">
          <Sparkles className="size-3.5" /> Experts free near you
        </p>
        <p className="font-display mt-1 text-2xl font-extrabold">Arriving in 10 min</p>
      </div>

      <p className="mt-5 mb-3 text-sm font-bold">What do you need done?</p>
      <div className="grid grid-cols-2 gap-2.5">
        {services.slice(0, 6).map((s, i) => (
          <div
            key={s.slug}
            className={cn(
              "rounded-2xl bg-white p-3 ring-1 ring-ink-900/5",
              i === 0 && "ring-2 ring-brand-600",
            )}
          >
            <s.icon className="mb-2 size-5 text-brand-600" aria-hidden />
            <p className="text-xs leading-tight font-bold">{s.name}</p>
            <p className="mt-0.5 text-[0.65rem] text-ink-400">₹{s.rate}/hr</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MatchingFrame() {
  return (
    <motion.div {...frameMotion} className="flex h-full flex-col items-center px-6 pt-16">
      <div className="relative grid size-28 place-items-center">
        <span className="absolute inset-0 rounded-full bg-brand-400/30 animate-spark-ping" />
        <span className="absolute inset-3 rounded-full bg-brand-400/40" />
        <span className="relative grid size-16 place-items-center rounded-full bg-brand-600 text-spark-400">
          <Sparkles className="size-7" />
        </span>
      </div>
      <p className="font-display mt-8 text-center text-xl font-extrabold">
        Finding an expert near you
      </p>
      <p className="mt-2 text-center text-sm text-ink-400">
        Searching 14 experts on shift within 900 m of your building
      </p>
      <div className="mt-8 w-full space-y-2">
        {["Location confirmed", "Dishwashing · 1 hour", "₹99 paid"].map((line) => (
          <div
            key={line}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-ink-900/5"
          >
            <Check className="size-4 text-brand-600" aria-hidden />
            {line}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function OtwFrame() {
  return (
    <motion.div {...frameMotion} className="flex h-full flex-col">
      <div className="map-grid relative h-56 bg-sand">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 224" fill="none" aria-hidden>
          <path
            d="M40 190 C 110 190, 120 120, 175 110 S 250 70, 280 44"
            stroke="var(--color-brand-600)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 10"
          />
        </svg>
        <span className="absolute top-8 right-16 grid size-9 place-items-center rounded-full bg-ink-900 text-spark-400 shadow-lg">
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M13.5 2 4 13.2h6.1L9.6 22 20 10.4h-6.6L13.5 2Z" />
          </svg>
        </span>
        <span className="absolute bottom-6 left-8 size-4 rounded-full bg-brand-600 ring-4 ring-brand-200" />
      </div>

      <div className="-mt-6 flex-1 rounded-t-[1.75rem] bg-white px-5 pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-900/15" />
        <p className="text-[0.7rem] font-semibold tracking-wide text-ink-400 uppercase">
          Arriving in
        </p>
        <p className="font-display text-3xl font-extrabold">6 min 04 s</p>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-3">
          <span className="font-display grid size-12 place-items-center rounded-full bg-brand-600 font-bold text-white">
            RM
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Rekha M.</p>
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <Star className="size-3 fill-spark-500 text-spark-500" /> 4.95 · 2,110 homes
            </p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-spark-400 text-ink-900">
            <Phone className="size-4" />
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-brand-200 bg-brand-50 px-4 py-3">
          <span className="text-xs font-semibold text-brand-700">Start OTP</span>
          <span className="font-display text-lg font-extrabold tracking-[0.3em] text-brand-700">
            4821
          </span>
        </div>
      </div>
    </motion.div>
  );
}
