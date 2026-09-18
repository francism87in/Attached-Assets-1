/**
 * The site map — one source of truth for routing, the menu overlay, the footer
 * and each page's title card. Order here is the order everywhere.
 */
export type RouteDef = {
  path: string;
  /** Short label for nav and menu. */
  label: string;
  /** Two-digit index shown in the menu and on the page's title card. */
  index: string;
  /** Small line above the page title. */
  eyebrow: string;
  /** Oversized page title. */
  title: string;
  /** Words rendered in lime inside the title. */
  highlight: readonly string[];
  /** One line under the title. */
  lede: string;
  /** Browser tab title. */
  documentTitle: string;
};

export const routes: readonly RouteDef[] = [
  {
    path: "/",
    label: "Home",
    index: "01",
    eyebrow: "Gromento",
    title: "Grow Louder. Move Upward.",
    highlight: ["louder.", "upward."],
    lede: "The real estate marketing partner built for NRI demand.",
    documentTitle: "Gromento — Real Estate Marketing Built for NRI Demand",
  },
  {
    path: "/approach",
    label: "Approach",
    index: "02",
    eyebrow: "The Gromento Difference",
    title: "We Don't Sell Inventory. We Create Demand.",
    highlight: ["demand."],
    lede: "Content, attention, trust, intent — the chain that turns a project into a market.",
    documentTitle: "Approach — Gromento",
  },
  {
    path: "/what-we-do",
    label: "What We Do",
    index: "03",
    eyebrow: "What We Do",
    title: "NRI Real Estate Growth, End to End.",
    highlight: ["end", "to", "end."],
    lede: "Strategy, content, performance, creative and conversion under one roof.",
    documentTitle: "What We Do — Gromento",
  },
  {
    path: "/nri-markets",
    label: "NRI Markets",
    index: "04",
    eyebrow: "Built Around the NRI Buyer Journey",
    title: "One Project. Different Markets. Different Motivations.",
    highlight: ["different", "markets.", "motivations."],
    lede: "A Dubai investor and a New Jersey family should never get the same campaign.",
    documentTitle: "NRI Markets — Gromento",
  },
  {
    path: "/why-gromento",
    label: "Why Gromento",
    index: "05",
    eyebrow: "Why Gromento",
    title: "We Understand the Buyer Before We Market the Property.",
    highlight: ["buyer", "before"],
    lede: "NRI-first, real-estate native, content-led and measured on acquisition.",
    documentTitle: "Why Gromento — Gromento",
  },
  {
    path: "/contact",
    label: "Contact",
    index: "06",
    eyebrow: "Closing Section",
    title: "Your Next NRI Buyer Is Already Online.",
    highlight: ["already", "online."],
    lede: "The question is whether your project gives them a reason to stop and enquire.",
    documentTitle: "Contact — Gromento",
  },
] as const;

export function routeFor(path: string): RouteDef {
  return routes.find((route) => route.path === path) ?? routes[0]!;
}
