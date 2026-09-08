import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { experts } from "@/data/content";
import { serviceBySlug } from "@/data/services";

export type BookingStatus =
  | "assigned"
  | "on_the_way"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Expert = (typeof experts)[number];

export type Booking = {
  id: string;
  serviceSlug: string;
  hours: number;
  citySlug: string;
  area: string;
  address: string;
  notes: string;
  /** "now" for an instant booking, otherwise an ISO timestamp for the slot. */
  when: "now" | string;
  rate: number;
  total: number;
  otp: string;
  expert: Expert;
  status: BookingStatus;
  createdAt: string;
  rating?: number;
};

/** Headline for a booking, shared by the home card and the site-wide tracking bar. */
export const STATUS_HEADLINES: Record<BookingStatus, string> = {
  assigned: "Booking scheduled",
  on_the_way: "Expert on the way",
  arrived: "She's at your door",
  in_progress: "Work in progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type DraftBooking = Omit<
  Booking,
  "id" | "otp" | "expert" | "status" | "createdAt" | "rate" | "total"
>;

const STORAGE_KEY = "spark.bookings.v1";

function randomOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function pickExpert(): Expert {
  return experts[Math.floor(Math.random() * experts.length)];
}

export function priceOf(serviceSlug: string, hours: number) {
  const rate = serviceBySlug(serviceSlug)?.rate ?? 99;
  return { rate, total: rate * hours };
}

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

type BookingsValue = {
  bookings: Booking[];
  activeBooking: Booking | null;
  createBooking: (draft: DraftBooking) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  getBooking: (id: string) => Booking | undefined;
  clearAll: () => void;
};

const BookingsContext = createContext<BookingsValue | null>(null);

const OPEN_STATUSES: BookingStatus[] = ["assigned", "on_the_way", "arrived", "in_progress"];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* private mode / quota — the prototype still works in memory */
    }
  }, [bookings]);

  const createBooking = useCallback((draft: DraftBooking) => {
    const { rate, total } = priceOf(draft.serviceSlug, draft.hours);
    const booking: Booking = {
      ...draft,
      id: `SPK${Date.now().toString().slice(-6)}`,
      rate,
      total,
      otp: randomOtp(),
      expert: pickExpert(),
      status: draft.when === "now" ? "on_the_way" : "assigned",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const value = useMemo<BookingsValue>(
    () => ({
      bookings,
      activeBooking: bookings.find((b) => OPEN_STATUSES.includes(b.status)) ?? null,
      createBooking,
      updateBooking,
      getBooking: (id: string) => bookings.find((b) => b.id === id),
      clearAll: () => setBookings([]),
    }),
    [bookings, createBooking, updateBooking],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingsProvider>");
  return ctx;
}
