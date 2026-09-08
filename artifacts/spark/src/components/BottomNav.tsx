import { Link, useLocation } from "wouter";
import { CalendarDays, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="flex items-stretch justify-around" aria-label="Main">
      {tabs.map((tab) => {
        const active = location === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[0.7rem] font-semibold transition-colors",
              active ? "text-brand-600" : "text-ink-400",
            )}
          >
            <tab.icon className={cn("size-5", active && "stroke-[2.5]")} aria-hidden />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
