import { Link } from "wouter";
import { CalendarClock, ChevronRight, Inbox } from "lucide-react";
import { AppHeader, AppScreen } from "@/components/AppScreen";
import { ButtonLink } from "@/components/ui";
import { serviceBySlug } from "@/data/services";
import { useBookings, type BookingStatus } from "@/store/bookings";
import { cn, rupees } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  assigned: "bg-brand-50 text-brand-700",
  on_the_way: "bg-brand-600 text-white",
  arrived: "bg-spark-400 text-ink-900",
  in_progress: "bg-brand-600 text-white",
  completed: "bg-ink-900/5 text-ink-600",
  cancelled: "bg-ink-900/5 text-ink-400",
};

const statusLabels: Record<BookingStatus, string> = {
  assigned: "Scheduled",
  on_the_way: "On the way",
  arrived: "At your door",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function Bookings() {
  const { bookings } = useBookings();

  return (
    <AppScreen
      footer={
        <ButtonLink href="/book" className="w-full" size="lg">
          New booking
        </ButtonLink>
      }
    >
      <AppHeader title="Your bookings" subtitle={`${bookings.length} total`} backHref="/" />

      <div className="space-y-3 px-5 pt-2 pb-8">
        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-ink-900/5">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Inbox className="size-6" aria-hidden />
            </span>
            <p className="mt-4 font-bold">Nothing booked yet</p>
            <p className="mt-1.5 text-sm text-ink-400">
              Your first expert can be at the door in about ten minutes.
            </p>
          </div>
        ) : null}

        {bookings.map((b) => {
          const service = serviceBySlug(b.serviceSlug);
          const when =
            b.when === "now"
              ? new Date(b.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : new Date(b.when).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                });

          return (
            <Link
              key={b.id}
              href={`/track/${b.id}`}
              className="flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-900/5 transition-shadow hover:shadow-lg hover:shadow-ink-900/5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                {service ? <service.icon className="size-5" aria-hidden /> : <CalendarClock className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{service?.name ?? "Service"}</p>
                <p className="truncate text-xs text-ink-400">
                  {when} · {b.hours} {b.hours === 1 ? "hr" : "hrs"} · {rupees(b.total)}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold",
                  statusStyles[b.status],
                )}
              >
                {statusLabels[b.status]}
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-400" aria-hidden />
            </Link>
          );
        })}
      </div>
    </AppScreen>
  );
}
