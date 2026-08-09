import {
  ChevronRight,
  CreditCard,
  Gift,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Shield,
  Trash2,
} from "lucide-react";
import { AppHeader, AppScreen } from "@/components/AppScreen";
import { Button, StarRating } from "@/components/ui";
import { cities, experts } from "@/data/content";
import { useBookings } from "@/store/bookings";
import { usePrefs } from "@/store/prefs";
import { rupees } from "@/lib/utils";

export function Account() {
  const { bookings, clearAll } = useBookings();
  const { prefs } = usePrefs();
  const city = cities.find((c) => c.slug === prefs.city);
  const spent = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.total, 0);
  const hours = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.hours, 0);

  const rows = [
    { icon: MapPin, label: "Saved addresses", value: prefs.address ? "1 saved" : "None yet" },
    { icon: CreditCard, label: "Payment methods", value: "UPI · HDFC ••4412" },
    { icon: Gift, label: "Refer a friend", value: "₹150 each" },
    { icon: Shield, label: "Safety centre", value: "" },
    { icon: HelpCircle, label: "Help & support", value: "" },
  ];

  return (
    <AppScreen>
      <AppHeader title="Account" backHref="/" />

      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-3xl bg-ink-900 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="font-display grid size-12 place-items-center rounded-full bg-spark-400 text-lg font-extrabold text-ink-900">
              A
            </span>
            <div>
              <p className="font-bold">Aditi Menon</p>
              <p className="text-xs text-white/60">
                +91 98••• ••210 · {city?.name ?? "Mumbai"}
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
            <div>
              <p className="font-display text-xl font-extrabold">{bookings.length}</p>
              <p className="text-[0.7rem] text-white/60">bookings</p>
            </div>
            <div>
              <p className="font-display text-xl font-extrabold">{hours}</p>
              <p className="text-[0.7rem] text-white/60">hours used</p>
            </div>
            <div>
              <p className="font-display text-xl font-extrabold">{rupees(spent)}</p>
              <p className="text-[0.7rem] text-white/60">spent</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Heart className="size-4 text-brand-600" aria-hidden /> Favourite experts
          </p>
          <ul className="mt-3 space-y-3">
            {experts.slice(0, 2).map((e) => (
              <li key={e.name} className="flex items-center gap-3">
                <span className="font-display grid size-10 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                  {e.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{e.name}</span>
                  <span className="block text-xs text-ink-400">{e.speciality}</span>
                </span>
                <StarRating value={e.rating} className="scale-75 origin-right" />
              </li>
            ))}
          </ul>
        </div>

        <ul className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/5">
          {rows.map((r) => (
            <li key={r.label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 border-b border-ink-900/5 px-5 py-4 text-left last:border-0 hover:bg-cream"
              >
                <r.icon className="size-4 shrink-0 text-brand-600" aria-hidden />
                <span className="flex-1 text-sm font-medium">{r.label}</span>
                {r.value ? <span className="text-xs text-ink-400">{r.value}</span> : null}
                <ChevronRight className="size-4 text-ink-400" aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
          <p className="text-sm font-bold">Prototype controls</p>
          <p className="mt-1 text-xs text-ink-400">
            Bookings live in this browser only. Clearing them resets the demo.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={clearAll}>
            <Trash2 className="size-4" aria-hidden /> Clear all bookings
          </Button>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-ink-400 hover:text-ink-900"
        >
          <LogOut className="size-4" aria-hidden /> Log out
        </button>
      </div>
    </AppScreen>
  );
}
