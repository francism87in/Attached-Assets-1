export type City = {
  slug: string;
  name: string;
  state: string;
  areas: string[];
  live: boolean;
};

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    areas: ["Bandra", "Andheri", "Powai", "Lower Parel", "Chembur", "Malad"],
    live: true,
  },
  {
    slug: "thane",
    name: "Thane",
    state: "Maharashtra",
    areas: ["Ghodbunder", "Majiwada", "Vartak Nagar", "Kolshet"],
    live: true,
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    areas: ["Kharadi", "Baner", "Viman Nagar", "Hinjewadi", "Koregaon Park"],
    live: true,
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    areas: ["Indiranagar", "Whitefield", "HSR Layout", "Koramangala", "Hebbal"],
    live: true,
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    state: "Delhi",
    areas: ["Gurugram", "Noida", "Dwarka", "Saket", "Vasant Kunj"],
    live: true,
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    areas: ["Gachibowli", "Madhapur", "Kondapur", "Jubilee Hills"],
    live: true,
  },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", areas: [], live: false },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", areas: [], live: false },
];

export const liveCities = cities.filter((c) => c.live);

export function cityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export const steps = [
  {
    title: "Drop a pin",
    body: "Share your location and we match you with experts already working in your building cluster.",
  },
  {
    title: "Pick the work",
    body: "Choose a service and how many hours you need. Prices are per hour, shown before you pay.",
  },
  {
    title: "Expert in 10 minutes",
    body: "Book now and someone is at your door in about ten minutes. Or schedule any slot from 7 AM to 8 PM.",
  },
  {
    title: "Share the OTP",
    body: "A four-digit code starts the clock. The timer stops when the work is done — you're billed for what you used.",
  },
];

export const promises = [
  {
    title: "Background-verified experts",
    body: "Aadhaar and police verification, plus an in-person interview, before anyone takes a single booking.",
  },
  {
    title: "Trained for eight days",
    body: "Every expert completes a paid residential training on technique, chemicals, safety and home etiquette.",
  },
  {
    title: "An all-women workforce",
    body: "SPARK is staffed entirely by women, on salaried shifts with insurance — not per-task gig payouts.",
  },
  {
    title: "Billed by the hour",
    body: "From ₹99 an hour. No visit fee, no per-task surcharge, no tipping expected. The bill is the estimate.",
  },
  {
    title: "Covered against damage",
    body: "Anything broken during a booking is insured up to ₹25,000. Report it in the app and we settle it.",
  },
  {
    title: "Rebook the same person",
    body: "Liked how she worked? Mark her a favourite and we'll route her to you whenever she's on shift.",
  },
];

export const stats = [
  { value: "10 lakh+", label: "homes served" },
  { value: "9 min", label: "median arrival" },
  { value: "4.87", label: "average rating" },
  { value: "22,000", label: "experts on payroll" },
];

export const testimonials = [
  {
    name: "Meera Raghavan",
    area: "Powai, Mumbai",
    quote:
      "I booked at 9:40 PM after a dinner party with a sink I couldn't look at. She was here by 9:51 and the kitchen was spotless before eleven.",
    rating: 5,
    service: "Dishwashing",
  },
  {
    name: "Arjun Sethi",
    area: "Gurugram, Delhi NCR",
    quote:
      "Our full-time help quit without notice. SPARK covered every morning for three weeks — same expert, same 7 AM slot, no drama.",
    rating: 5,
    service: "Home cleaning",
  },
  {
    name: "Fatima Qureshi",
    area: "Kharadi, Pune",
    quote:
      "The hourly billing is what won me. Two hours booked, one hour forty used, and the app refunded the difference on its own.",
    rating: 5,
    service: "Laundry & ironing",
  },
  {
    name: "Nikhil Rao",
    area: "HSR Layout, Bengaluru",
    quote:
      "I travel constantly. I schedule a two-hour reset the evening I land and walk into a clean flat. It's the best ₹200 I spend all week.",
    rating: 5,
    service: "Home cleaning",
  },
  {
    name: "Sneha Kulkarni",
    area: "Ghodbunder, Thane",
    quote:
      "My mother-in-law was sceptical about someone new in the kitchen. She now asks me to book the same expert every Sunday.",
    rating: 4,
    service: "Kitchen cleaning",
  },
];

export const faqs = [
  {
    q: "How is an expert here in ten minutes?",
    a: "Experts work salaried shifts inside a small cluster of buildings rather than travelling across the city. When you book, we assign whoever is closest and free within that cluster, so the trip to your door is usually a short walk or a two-minute ride.",
  },
  {
    q: "What does it cost?",
    a: "Everything is billed by the hour, starting at ₹99 for dishwashing, home cleaning and laundry. Bathroom and kitchen cleaning are ₹129 an hour; organising, cooking prep and upholstery are ₹149. There is no visit charge and no per-task extra — the estimate you see before paying is the bill.",
  },
  {
    q: "Can I book for later?",
    a: "Yes. Slots run every 15 minutes from 7:00 AM to 8:00 PM and you can schedule up to seven days ahead. Scheduled bookings can be moved or cancelled free until an hour before the slot.",
  },
  {
    q: "Do I need to provide supplies?",
    a: "The expert brings brushes, cloths, gloves and cleaning liquid. Anything that belongs to your home — your washing machine, vacuum, mop bucket or preferred detergent — stays yours to provide.",
  },
  {
    q: "Who is coming into my house?",
    a: "A salaried SPARK expert who has cleared Aadhaar and police verification, an in-person interview and eight days of paid training. You see her name, photo, rating and how many homes she has served before she reaches you, and the booking only starts once you share a four-digit OTP.",
  },
  {
    q: "What if something breaks?",
    a: "Report it from the booking screen within 24 hours. Damage during a booking is covered up to ₹25,000 and our support team settles claims directly — the expert is never asked to pay for it.",
  },
  {
    q: "Can I get the same expert again?",
    a: "Tap the heart on her profile after a booking. Whenever she is on shift in your cluster we route your bookings to her first, and you'll see 'your favourite' next to her name.",
  },
  {
    q: "What if I need to cancel?",
    a: "Free until an expert is assigned. After assignment, cancelling within the first two minutes is still free; beyond that we charge a flat ₹49 because she has already started travelling to you.",
  },
];

export const experts = [
  {
    name: "Sunita D.",
    initials: "SD",
    rating: 4.9,
    jobs: 1240,
    since: "2024",
    speciality: "Kitchen & dishwashing",
  },
  {
    name: "Rekha M.",
    initials: "RM",
    rating: 4.95,
    jobs: 2110,
    since: "2023",
    speciality: "Home cleaning",
  },
  {
    name: "Anjali P.",
    initials: "AP",
    rating: 4.88,
    jobs: 860,
    since: "2025",
    speciality: "Organising & laundry",
  },
];
