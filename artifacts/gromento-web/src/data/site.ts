/**
 * Every string on the site lives here, transcribed from
 * `Gromento_Website_Content.docx` so copy edits never require touching layout.
 */

export const brand = {
  name: "Gromento",
  tagline: "Grow Louder. Move Upward.",
  taglineFull: "Grow Louder. Move Upward. Every single time.",
  descriptor: "Trend-led marketing agency for global Indian property buyers",
  email: "hello@gromento.com",
} as const;

export const hero = {
  eyebrow: "Real estate marketing · NRI demand",
  title: "Grow Louder. Move Upward.",
  subtitle: "The Real Estate Marketing Partner Built for NRI Demand.",
  body: "We help real estate developers attract, influence and convert NRI buyers and property investors through content-led marketing, performance campaigns and market-specific growth strategy.",
  negations: [
    "Not generic lead generation.",
    "Not another creative agency.",
    "Not marketing designed for everyone.",
  ],
  closing: "Gromento is built around one audience: the global Indian property buyer.",
  primaryCta: "Build Your NRI Growth Strategy",
  secondaryCta: "Talk to Gromento",
} as const;

export const tickerMarkets = [
  "Dubai",
  "Abu Dhabi",
  "Doha",
  "Muscat",
  "Riyadh",
  "New York",
  "New Jersey",
  "Dallas",
  "Houston",
  "Austin",
  "California",
  "Seattle",
  "London",
  "Singapore",
] as const;

export const usp = {
  eyebrow: "Our USP",
  title: "We Understand the Buyer Before We Market the Property.",
  lead: [
    "Most real estate agencies start with the project.",
    "We start with the buyer.",
  ],
  body: "An NRI in Dubai, Dallas, London or Singapore does not evaluate Indian property the same way a local buyer does.",
  contrasts: [
    { label: "Their questions", value: "are different." },
    { label: "Their trust barriers", value: "are higher." },
    { label: "Their decision cycles", value: "are longer." },
  ],
  motivations:
    "Their motivations can range from investment and rental yield to retirement, family security, portfolio diversification and returning to India.",
  outro:
    "Gromento builds the content, communication and acquisition system around those motivations.",
  kicker: "That is our advantage.",
} as const;

export const positioning = {
  eyebrow: "Our Positioning",
  title: "Real Estate Marketing. Built for Global Indian Buyers.",
  body: "Gromento is a specialised marketing partner for real estate developers looking to build demand among NRIs and investors. We combine:",
  pillars: [
    {
      title: "NRI Buyer Intelligence",
      body: "Understand what buyers in different international markets care about before building campaigns.",
      icon: "compass",
    },
    {
      title: "Content Strategy",
      body: "Turn projects into stories, insights, comparisons and reasons to believe.",
      icon: "pen",
    },
    {
      title: "Performance Marketing",
      body: "Reach qualified audiences through Meta, Google, YouTube and digital media.",
      icon: "target",
    },
    {
      title: "Creative Systems",
      body: "Build campaign worlds designed to stop attention rather than simply decorate advertisements.",
      icon: "sparkles",
    },
    {
      title: "Conversion Infrastructure",
      body: "Landing pages, WhatsApp journeys, lead qualification, CRM workflows and remarketing.",
      icon: "workflow",
    },
    {
      title: "International Campaigns",
      body: "Digital campaigns designed around GCC, US, UK, Singapore and other NRI markets.",
      icon: "globe",
    },
  ],
} as const;

export const difference = {
  eyebrow: "The Gromento Difference",
  title: "We Don't Sell Inventory. We Create Demand.",
  oldWayLabel: "Traditional real estate marketing",
  oldWay: ["Project image.", "Configuration.", "Price.", "Location.", "“Book Now.”"],
  oldWayKicker: "Every developer starts looking identical.",
  newWayLabel: "The Gromento system",
  funnel: [
    "Content",
    "Attention",
    "Trust",
    "Intent",
    "Qualified Lead",
    "Site Visit / Event",
    "Sale",
  ],
  outro:
    "We turn the project into a content ecosystem that educates buyers before the sales conversation begins.",
  kicker: "Because an informed lead converts differently from a form-fill lead.",
} as const;

export const contentEngine = {
  eyebrow: "Content Is Our Growth Engine",
  title: "Property Buyers Don't Need More Ads. They Need Better Reasons to Buy.",
  body: "Our campaigns are built around content that answers the questions buyers are already asking:",
  questions: [
    "Why this micro-market?",
    "Why this developer?",
    "Why this project?",
    "Why buy now?",
    "What is the long-term development story?",
    "What infrastructure is coming?",
    "How does it compare with alternatives?",
    "What could drive future demand?",
    "What does ownership look like for an NRI?",
    "What are the financing, taxation and purchase considerations?",
    "Is this better for investment or end use?",
  ],
  ammunition: "Every answer becomes marketing ammunition.",
  formats: [
    "Articles",
    "Reels",
    "Carousels",
    "Founder videos",
    "Property films",
    "Market reports",
    "Comparison content",
    "NRI guides",
    "Webinars",
    "Event campaigns",
    "Performance creatives",
  ],
  kicker: "Content creates trust. Performance marketing scales it.",
} as const;

export const services = {
  eyebrow: "What We Do",
  title: "NRI Real Estate Growth, End to End.",
  items: [
    {
      title: "NRI Market Strategy",
      body: "Audience segmentation, country prioritisation, buyer personas, messaging architecture and campaign planning.",
      icon: "map",
    },
    {
      title: "Brand & Campaign Strategy",
      body: "Positioning, campaign concepts, launch narratives, visual systems and communication architecture.",
      icon: "flag",
    },
    {
      title: "Content Engine",
      body: "Video, short-form content, market education, investor content, project storytelling and thought leadership.",
      icon: "play",
    },
    {
      title: "Performance Marketing",
      body: "Meta Ads, Google Ads, YouTube, lead-generation funnels, campaign optimisation and conversion tracking.",
      icon: "trending",
    },
    {
      title: "Creative Production",
      body: "Static campaigns, motion graphics, property films, 3D visualisation, AI-led content and performance creatives.",
      icon: "camera",
    },
    {
      title: "Landing Pages & Funnels",
      body: "Conversion-focused project pages, NRI landing pages, lead forms, event registrations and qualification journeys.",
      icon: "layout",
    },
    {
      title: "CRM & Automation",
      body: "WhatsApp, email, lead routing, appointment workflows, remarketing and sales-team integration.",
      icon: "zap",
    },
    {
      title: "NRI Property Events",
      body: "Digital demand generation for exhibitions, private previews, investor meets and international property events.",
      icon: "ticket",
    },
  ],
} as const;

export const markets = {
  eyebrow: "Built Around the NRI Buyer Journey",
  title: "One Project. Different Markets. Different Motivations.",
  lead: [
    "A Dubai investor should not receive the same communication as a family living in New Jersey.",
    "A Singapore-based investor may evaluate opportunity differently from a UK-based end user.",
  ],
  body: "We adapt positioning, content and campaigns around:",
  regions: [
    {
      name: "GCC",
      cities: ["Dubai", "Abu Dhabi", "Doha", "Muscat", "Riyadh"] as string[],
    },
    {
      name: "North America",
      cities: [
        "New York",
        "New Jersey",
        "Dallas",
        "Houston",
        "Austin",
        "California",
        "Seattle",
      ] as string[],
    },
    { name: "United Kingdom", cities: [] as string[] },
    { name: "Singapore", cities: [] as string[] },
    { name: "Other High-Intent NRI Markets", cities: [] as string[] },
  ],
  outro: "One project can require several narratives.",
  kicker: "Gromento builds the right narrative for each market.",
} as const;

export const developers = {
  eyebrow: "For Developers",
  title: "You Build the Project. We Build the Market Around It.",
  body: "We partner with:",
  partners: [
    "Residential developers",
    "Luxury developers",
    "Branded residence projects",
    "Plotted developments",
    "Villas and second homes",
    "Investment-focused projects",
    "Developer NRI sales teams",
    "New-market launches",
    "International property exhibitions",
  ],
  outro:
    "Whether the objective is an international launch, NRI lead generation, an overseas event or a long-term global buyer pipeline, we build the marketing infrastructure around the commercial target.",
} as const;

export const philosophy = {
  eyebrow: "Our Philosophy",
  title: "Don't Chase Leads. Build Preference.",
  body: "A developer rarely wins because they generated the largest number of leads.",
  lead: "They win when the buyer enters the sales conversation already thinking:",
  quote: "This is the project I should seriously consider.",
  outro: "That is the job of marketing.",
  kicker:
    "Gromento combines brand, content, performance and conversion to create that preference before the salesperson makes the first call.",
} as const;

export const why = {
  eyebrow: "Why Gromento",
  title: "Six reasons developers keep us in the room.",
  reasons: [
    {
      title: "NRI-First",
      body: "Our strategy begins with the behaviour and psychology of overseas Indian property buyers.",
    },
    {
      title: "Real-Estate Native",
      body: "We understand launches, inventory, micro-markets, ticket sizes, sales funnels and developer economics.",
    },
    {
      title: "Content-Led",
      body: "We build trust before asking for the lead.",
    },
    {
      title: "Performance-Driven",
      body: "Creative decisions are connected to measurable acquisition and conversion outcomes.",
    },
    {
      title: "Market-Specific",
      body: "Communication changes according to geography, buyer profile and purchase motivation.",
    },
    {
      title: "Full-Funnel",
      body: "From first impression to qualified enquiry, appointment, event attendance and sales follow-up.",
    },
  ],
} as const;

export const coreMessage = {
  eyebrow: "The Core Message",
  title: "Global Buyers. Indian Real Estate. One Growth Partner.",
  body: "Gromento helps real estate developers build a stronger pipeline of NRI buyers and investors by combining market intelligence, content, creative, performance marketing and conversion technology.",
  lines: ["Not more marketing.", "More relevant marketing."],
  cta: "Build Your NRI Growth Engine",
} as const;

export const closing = {
  eyebrow: "Closing Section",
  title: "Your Next NRI Buyer Is Already Online.",
  body: "The question is whether your project is giving them enough reason to stop, understand, trust and enquire.",
  kicker: "Let's Build That Reason.",
  tagline: "Grow Louder. Move Upward. Every single time.",
  cta: "Talk to Gromento",
} as const;
