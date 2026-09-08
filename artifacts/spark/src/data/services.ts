import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Brush,
  ChefHat,
  CookingPot,
  Package,
  Shirt,
  Sofa,
  Utensils,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Hourly rate in ₹ — everything on SPARK is billed by the hour. */
  rate: number;
  /** Hours we suggest by default for a typical home. */
  suggestedHours: number;
  popular?: boolean;
  /** Chips shown on the service card / booking summary. */
  includes: string[];
  excludes: string[];
  blurb: string;
};

export const services: Service[] = [
  {
    slug: "dishwashing",
    name: "Dishwashing",
    tagline: "Sink to shelf, spotless",
    icon: Utensils,
    rate: 99,
    suggestedHours: 1,
    popular: true,
    includes: [
      "Wash all used utensils",
      "Scrub pots, pans and cookware",
      "Wipe the sink and platform",
      "Stack dishes back in place",
    ],
    excludes: ["Deep descaling of the sink", "Chimney or oven cleaning"],
    blurb:
      "The pile after dinner is the number one reason people open SPARK. An expert arrives, clears the sink and leaves the platform dry.",
  },
  {
    slug: "bathroom-cleaning",
    name: "Bathroom cleaning",
    tagline: "Tiles, taps and throne",
    icon: Bath,
    rate: 129,
    suggestedHours: 1,
    popular: true,
    includes: [
      "Scrub floor, walls and tiles",
      "Clean the WC inside and out",
      "Polish taps, mirror and fittings",
      "Clear surface drain hair",
    ],
    excludes: ["Acid wash / hard-water descaling", "Plumbing repairs"],
    blurb:
      "Brushes, gloves and a bathroom-grade cleaner come with the expert. One hour is usually enough for two bathrooms.",
  },
  {
    slug: "kitchen-cleaning",
    name: "Kitchen cleaning",
    tagline: "Grease off every surface",
    icon: CookingPot,
    rate: 129,
    suggestedHours: 2,
    includes: [
      "Degrease platform and backsplash",
      "Wipe cabinet fronts and handles",
      "Clean stove-top and burners",
      "Take out the trash",
    ],
    excludes: ["Inside-fridge deep clean", "Chimney dismantling"],
    blurb:
      "A weekly reset for the room that gets dirtiest fastest. Add an hour if the cabinets haven't been touched in a while.",
  },
  {
    slug: "home-cleaning",
    name: "Home cleaning",
    tagline: "Sweep, mop, dust, done",
    icon: Brush,
    rate: 99,
    suggestedHours: 2,
    popular: true,
    includes: [
      "Sweep and mop all floors",
      "Dust furniture and sills",
      "Make beds and straighten rooms",
      "Empty dustbins",
    ],
    excludes: ["Wall or ceiling cleaning", "Moving heavy furniture"],
    blurb:
      "The everyday jhaadu-pocha round, done properly. Most 2BHKs are covered comfortably in two hours.",
  },
  {
    slug: "laundry-ironing",
    name: "Laundry & ironing",
    tagline: "Washed, folded, pressed",
    icon: Shirt,
    rate: 99,
    suggestedHours: 1,
    includes: [
      "Load and run your machine",
      "Hang or dry clothes",
      "Fold and stack neatly",
      "Iron up to 15 garments",
    ],
    excludes: ["Dry cleaning", "Hand-wash of delicate silks"],
    blurb:
      "Your machine, your detergent, our hands. Pick two hours if there's a week's backlog waiting on the chair.",
  },
  {
    slug: "organising",
    name: "Organising",
    tagline: "Wardrobes that make sense",
    icon: Package,
    rate: 149,
    suggestedHours: 2,
    includes: [
      "Sort and refold wardrobes",
      "Arrange kitchen shelves",
      "Group and label storage",
      "Bag things to give away",
    ],
    excludes: ["Buying storage boxes", "Carpentry or installation"],
    blurb:
      "Point at the cupboard that makes you sigh. The expert empties, sorts and rebuilds it while you decide what stays.",
  },
  {
    slug: "cooking-prep",
    name: "Cooking prep",
    tagline: "Chopped, marinated, ready",
    icon: ChefHat,
    rate: 149,
    suggestedHours: 1,
    includes: [
      "Wash and chop vegetables",
      "Knead dough, soak dals",
      "Marinate as instructed",
      "Store in your containers",
    ],
    excludes: ["Full meal cooking", "Grocery shopping"],
    blurb:
      "Not a cook — a prep hand. Everything is cut, soaked and boxed so dinner takes fifteen minutes, not fifty.",
  },
  {
    slug: "sofa-carpet",
    name: "Sofa & carpet",
    tagline: "Vacuumed and freshened",
    icon: Sofa,
    rate: 149,
    suggestedHours: 1,
    includes: [
      "Vacuum sofa and cushions",
      "Spot-treat visible stains",
      "Beat and vacuum carpets",
      "Deodorise fabric",
    ],
    excludes: ["Wet shampooing", "Leather restoration"],
    blurb:
      "A quick refresh before guests arrive. For wet shampooing, book our deep-clean crew a day ahead.",
  },
];

export function serviceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const hourOptions = [1, 2, 3, 4] as const;
