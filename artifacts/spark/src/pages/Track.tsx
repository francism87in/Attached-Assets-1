import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  Heart,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Timer,
  X,
} from "lucide-react";
import { AppHeader, AppScreen } from "@/components/AppScreen";
import { Button, ButtonLink } from "@/components/ui";
import { serviceBySlug } from "@/data/services";
import { useBookings, type Booking } from "@/store/bookings";
import { cn, mmss, rupees, toAmPm } from "@/lib/utils";

const ARRIVAL_SECONDS = 10 * 60;

export function Track() {
  const { id } = useParams<{ id: string }>();
  const { getBooking, updateBooking } = useBookings();
  const booking = getBooking(id);
  const [now, setNow] = useState(() => Date.now());
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const etaSeconds = useMemo(() => {
    if (!booking) return 0;
    const elapsed = (now - new Date(booking.createdAt).getTime()) / 1000;
    return Math.max(0, Math.round(ARRIVAL_SECONDS - elapsed));
  }, [booking, now]);

  // Instant bookings flip to "arrived" on their own once the ETA runs out.
  useEffect(() => {
    if (booking?.status === "on_the_way" && etaSeconds === 0) {
      updateBooking(booking.id, { status: "arrived" });
    }
  }, [booking, etaSeconds, updateBooking]);

  if (!booking) {
    return (
      <AppScreen>
        <AppHeader title="Booking not found" backHref="/bookings" />
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-ink-400">
            This booking isn't on this device any more. Bookings in the prototype are stored
            locally.
          </p>
          <ButtonLink href="/book" className="mt-6">
            Make a new booking
          </ButtonLink>
        </div>
      </AppScreen>
    );
  }

  const service = serviceBySlug(booking.serviceSlug);
  const scheduled = booking.when !== "now" ? new Date(booking.when) : null;

  function submitOtp() {
    if (!booking) return;
    if (otpInput === booking.otp) {
      updateBooking(booking.id, { status: "in_progress" });
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  }

  return (
    <AppScreen
      footer={
        booking.status === "completed" || booking.status === "cancelled" ? (
          <ButtonLink href="/book" className="w-full" size="lg">
            Book again
          </ButtonLink>
        ) : booking.status === "in_progress" ? (
          <Button
            className="w-full"
            size="lg"
            variant="dark"
            onClick={() => updateBooking(booking.id, { status: "completed" })}
          >
            End booking & release payment
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1">
              <MessageCircle className="size-4" aria-hidden /> Chat
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Phone className="size-4" aria-hidden /> Call
            </Button>
          </div>
        )
      }
    >
      <AppHeader
        title={service?.name ?? "Booking"}
        subtitle={`#${booking.id} · ${booking.hours} ${booking.hours === 1 ? "hour" : "hours"}`}
        backHref="/bookings"
      />

      {booking.status === "on_the_way" || booking.status === "arrived" ? (
        <MapPanel arrived={booking.status === "arrived"} />
      ) : null}

      <div className="space-y-4 px-5 pt-4 pb-8">
        <StatusCard
          booking={booking}
          etaSeconds={etaSeconds}
          scheduledAt={scheduled}
        />

        <ExpertCard
          booking={booking}
          favourite={favourite}
          onFavourite={() => setFavourite((v) => !v)}
        />

        {booking.status === "arrived" ? (
          <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
            <p className="text-sm font-bold">Share your start OTP</p>
            <p className="mt-1 text-xs text-ink-400">
              She's at your door. The clock only starts once this code is entered.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50 py-4 text-center">
              <p className="text-[0.7rem] font-semibold tracking-wide text-brand-700 uppercase">
                Your code
              </p>
              <p className="font-display text-3xl font-extrabold tracking-[0.4em] text-brand-700">
                {booking.otp}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setOtpError(false);
                }}
                inputMode="numeric"
                placeholder="Enter code"
                aria-label="Start OTP"
                className={cn(
                  "flex-1 rounded-2xl bg-cream px-4 py-3 text-center text-lg font-bold tracking-[0.3em] ring-1 outline-none",
                  otpError ? "ring-2 ring-red-500" : "ring-ink-900/10 focus:ring-2 focus:ring-brand-600",
                )}
              />
              <Button onClick={submitOtp} disabled={otpInput.length < 4}>
                Start
              </Button>
            </div>
            {otpError ? (
              <p className="mt-2 text-xs font-medium text-red-600">
                That code doesn't match. It's shown above.
              </p>
            ) : null}
          </div>
        ) : null}

        {booking.status === "completed" ? (
          <RatingCard booking={booking} />
        ) : null}

        <Timeline status={booking.status} />

        <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
          <p className="text-sm font-bold">Booking details</p>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Where">{booking.address}</Row>
            <Row label="When">
              {scheduled
                ? `${scheduled.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}, ${toAmPm(
                    `${String(scheduled.getHours()).padStart(2, "0")}:${String(
                      scheduled.getMinutes(),
                    ).padStart(2, "0")}`,
                  )}`
                : "Instant booking"}
            </Row>
            {booking.notes ? <Row label="Note">{booking.notes}</Row> : null}
            <Row label="Paid">
              {rupees(booking.total)} ({booking.hours} × {rupees(booking.rate)})
            </Row>
          </dl>
          {booking.status !== "completed" && booking.status !== "cancelled" ? (
            <button
              type="button"
              onClick={() => updateBooking(booking.id, { status: "cancelled" })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/12 py-2.5 text-sm font-semibold text-ink-400 hover:border-red-300 hover:text-red-600"
            >
              <X className="size-4" aria-hidden /> Cancel booking
            </button>
          ) : null}
        </div>

        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-ink-400">
          <Shield className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Every booking is covered up to ₹25,000 against damage, and support is one tap away for
          the full duration.
        </p>
      </div>
    </AppScreen>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="shrink-0 text-ink-400">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function MapPanel({ arrived }: { arrived: boolean }) {
  return (
    <div className="map-grid relative mx-5 h-44 overflow-hidden rounded-3xl bg-sand ring-1 ring-ink-900/5">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 176" fill="none" aria-hidden>
        <path
          d="M32 148 C 100 148, 110 92, 168 84 S 244 52, 288 32"
          stroke="var(--color-brand-600)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 10"
        />
      </svg>
      <motion.span
        className="absolute grid size-9 place-items-center rounded-full bg-ink-900 text-spark-400 shadow-lg"
        initial={{ top: "12%", left: "84%" }}
        animate={arrived ? { top: "78%", left: "8%" } : { top: ["12%", "40%"], left: ["84%", "50%"] }}
        transition={{ duration: arrived ? 1 : 8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M13.5 2 4 13.2h6.1L9.6 22 20 10.4h-6.6L13.5 2Z" />
        </svg>
      </motion.span>
      <span className="absolute bottom-5 left-6">
        <span className="absolute inset-0 rounded-full bg-brand-400/40 animate-spark-ping" />
        <span className="relative block size-4 rounded-full bg-brand-600 ring-4 ring-white" />
      </span>
    </div>
  );
}

function StatusCard({
  booking,
  etaSeconds,
  scheduledAt,
}: {
  booking: Booking;
  etaSeconds: number;
  scheduledAt: Date | null;
}) {
  const copy: Record<Booking["status"], { title: string; body: string }> = {
    assigned: {
      title: scheduledAt
        ? `Scheduled for ${scheduledAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
        : "Expert assigned",
      body: "We'll assign the nearest expert on shift 20 minutes before your slot and ping you.",
    },
    on_the_way: {
      title: `Arriving in ${mmss(etaSeconds)}`,
      body: "She's walking over from a booking in the next tower. Keep your phone nearby.",
    },
    arrived: {
      title: "She's at your door",
      body: "Share the four-digit OTP below to start the clock.",
    },
    in_progress: {
      title: "Work in progress",
      body: `Booked for ${booking.hours} ${booking.hours === 1 ? "hour" : "hours"}. Unused minutes come back to you.`,
    },
    completed: {
      title: "Booking complete",
      body: "Payment released. Tell us how it went.",
    },
    cancelled: {
      title: "Booking cancelled",
      body: "No charge has been made. You can book again whenever you need.",
    },
  };

  const tone =
    booking.status === "cancelled"
      ? "bg-ink-900/5 text-ink-600"
      : booking.status === "completed"
        ? "bg-spark-400 text-ink-900"
        : "bg-brand-600 text-white";

  return (
    <div className={cn("rounded-3xl p-5", tone)}>
      <p
        className={cn(
          "flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wide uppercase",
          booking.status === "cancelled"
            ? "text-ink-400"
            : booking.status === "completed"
              ? "text-ink-600"
              : "text-spark-400",
        )}
      >
        <Sparkles className="size-3.5" aria-hidden /> Status
      </p>
      <p className="font-display mt-1 text-2xl font-extrabold">{copy[booking.status].title}</p>
      <p
        className={cn(
          "mt-1.5 text-sm",
          booking.status === "on_the_way" || booking.status === "arrived" || booking.status === "in_progress"
            ? "text-white/75"
            : "text-ink-600",
        )}
      >
        {copy[booking.status].body}
      </p>
    </div>
  );
}

function ExpertCard({
  booking,
  favourite,
  onFavourite,
}: {
  booking: Booking;
  favourite: boolean;
  onFavourite: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-900/5">
      <span className="font-display grid size-13 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">
        {booking.expert.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          {booking.expert.name}
          <BadgeCheck className="size-4 text-brand-600" aria-hidden />
        </p>
        <p className="flex items-center gap-1 text-[0.7rem] text-ink-400">
          <Star className="size-3 shrink-0 fill-spark-500 text-spark-500" aria-hidden />
          <span className="truncate">
            {booking.expert.rating} · {booking.expert.jobs.toLocaleString("en-IN")} homes
          </span>
        </p>
        <p className="truncate text-[0.7rem] text-ink-400">{booking.expert.speciality}</p>
      </div>
      <button
        type="button"
        onClick={onFavourite}
        aria-pressed={favourite}
        aria-label="Mark as favourite expert"
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-colors",
          favourite ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-ink-400 ring-ink-900/10",
        )}
      >
        <Heart className={cn("size-4", favourite && "fill-current")} aria-hidden />
      </button>
    </div>
  );
}

function Timeline({ status }: { status: Booking["status"] }) {
  const order: Booking["status"][] = ["assigned", "on_the_way", "arrived", "in_progress", "completed"];
  const labels: Record<string, string> = {
    assigned: "Expert assigned",
    on_the_way: "On the way",
    arrived: "At your door",
    in_progress: "Work started",
    completed: "Completed & paid",
  };
  const current = order.indexOf(status);

  if (status === "cancelled") return null;

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
      <p className="mb-4 flex items-center gap-2 text-sm font-bold">
        <Timer className="size-4 text-brand-600" aria-hidden /> Progress
      </p>
      <ol className="space-y-3">
        {order.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-white",
                  done ? "bg-brand-600" : "bg-ink-900/10",
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : null}
              </span>
              <span className={cn("text-sm", done ? "font-semibold text-ink-900" : "text-ink-400")}>
                {labels[s]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function RatingCard({ booking }: { booking: Booking }) {
  const { updateBooking } = useBookings();
  const [hover, setHover] = useState(0);
  const value = booking.rating ?? 0;

  return (
    <div className="rounded-3xl bg-white p-5 text-center ring-1 ring-ink-900/5">
      <p className="text-sm font-bold">How was {booking.expert.name.split(" ")[0]}?</p>
      <div className="mt-3 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => updateBooking(booking.id, { rating: i })}
            aria-label={`Rate ${i} out of 5`}
          >
            <Star
              className={cn(
                "size-8 transition-colors",
                i <= (hover || value) ? "fill-spark-500 text-spark-500" : "text-ink-900/15",
              )}
            />
          </button>
        ))}
      </div>
      {value ? (
        <p className="mt-3 text-xs text-ink-400">
          Thanks — logged against booking #{booking.id}.
        </p>
      ) : (
        <p className="mt-3 text-xs text-ink-400">Ratings decide who gets shift bonuses.</p>
      )}
      <Link
        href="/book"
        className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
      >
        Book {booking.expert.name.split(" ")[0]} again
      </Link>
    </div>
  );
}
