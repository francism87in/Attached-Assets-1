import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const STATUSES: BookingStatus[] = [
  "assigned",
  "on_the_way",
  "arrived",
  "in_progress",
  "completed",
  "cancelled",
];

function randomOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Time-ordered prefix plus a random suffix. A plain timestamp slice repeats
 * every ~17 minutes, which is well within one session and would hand two
 * bookings the same id.
 */
function newBookingId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `SPK${stamp}${suffix}`;
}

function pickExpert(): Expert {
  return experts[Math.floor(Math.random() * experts.length)];
}

export function priceOf(serviceSlug: string, hours: number) {
  const rate = serviceBySlug(serviceSlug)?.rate ?? 99;
  return { rate, total: rate * hours };
}

/** Storage is user-writable, so anything that doesn't look like a booking is dropped. */
function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.serviceSlug === "string" &&
    typeof b.hours === "number" &&
    typeof b.rate === "number" &&
    typeof b.total === "number" &&
    typeof b.when === "string" &&
    typeof b.createdAt === "string" &&
    typeof b.status === "string" &&
    STATUSES.includes(b.status as BookingStatus) &&
    typeof b.expert === "object" &&
    b.expert !== null
  );
}

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isBooking) : [];
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
  // Lets createBooking check ids without taking `bookings` as a dependency.
  const bookingsRef = useRef(bookings);

  useEffect(() => {
    bookingsRef.current = bookings;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* private mode / quota — the prototype still works in memory */
    }
  }, [bookings]);

  const createBooking = useCallback((draft: DraftBooking) => {
    const { rate, total } = priceOf(draft.serviceSlug, draft.hours);

    let id = newBookingId();
    while (bookingsRef.current.some((b) => b.id === id)) id = newBookingId();

    const booking: Booking = {
      ...draft,
      id,
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
