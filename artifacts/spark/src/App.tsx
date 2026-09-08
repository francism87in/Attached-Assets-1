import { useEffect } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Account } from "@/pages/Account";
import { AppHome } from "@/pages/AppHome";
import { Book } from "@/pages/Book";
import { Bookings } from "@/pages/Bookings";
import { CityPage } from "@/pages/CityPage";
import { Experts } from "@/pages/Experts";
import { Landing } from "@/pages/Landing";
import { NotFound } from "@/pages/NotFound";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Track } from "@/pages/Track";
import { serviceBySlug } from "@/data/services";
import { STATUS_HEADLINES, useBookings } from "@/store/bookings";
import { usePrefs } from "@/store/prefs";

/** App surfaces render bare (no marketing chrome). */
const APP_ROUTES = ["/app", "/book", "/track", "/bookings", "/account"];

export function App() {
  const [location] = useLocation();
  const isAppRoute = APP_ROUTES.some((r) => location.startsWith(r));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isAppRoute) {
    return (
      <Switch>
        <Route path="/app" component={AppHome} />
        <Route path="/book" component={Book} />
        <Route path="/book/:service" component={Book} />
        <Route path="/track/:id" component={Track} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/account" component={Account} />
      </Switch>
    );
  }

  return <MarketingLayout />;
}

function MarketingLayout() {
  const { prefs, setPrefs } = usePrefs();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav city={prefs.city} onCityChange={(city) => setPrefs({ city })} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/city/:slug" component={CityPage} />
          <Route path="/experts" component={Experts} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
      <ActiveBookingBar />
    </div>
  );
}

/** Sticky "your expert is on the way" pill, mirroring the live-order bar in delivery apps. */
function ActiveBookingBar() {
  const { activeBooking } = useBookings();
  if (!activeBooking) return null;

  const service = serviceBySlug(activeBooking.serviceSlug);
  const label = STATUS_HEADLINES[activeBooking.status];

  return (
    <div className="sticky bottom-0 z-40 px-4 pb-4">
      <Link
        href={`/track/${activeBooking.id}`}
        className="shell flex items-center gap-3 rounded-full bg-ink-900 px-5 py-3 text-white shadow-2xl shadow-ink-900/25"
      >
        <span className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full rounded-full bg-spark-400 opacity-75 animate-spark-ping" />
          <span className="relative inline-flex size-2.5 rounded-full bg-spark-400" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
          {label} · {service?.name}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-spark-400">
          Track <ArrowRight className="size-4" aria-hidden />
        </span>
      </Link>
    </div>
  );
}
