// Central place for business facts so placeholders are easy to find and swap later.
export const site = {
  name: "Luxury Duo Cleaning LLC",
  shortName: "Luxury Duo Cleaning",
  // Canonical domain not yet decided (live site is luxeduocleaningllc.com, contact
  // email is on luxuryduocleaning.com) — placeholder until confirmed.
  url: "https://www.example-placeholder-domain.com",
  description:
    "Residential, commercial, and construction cleanup cleaning services in Orlando, FL. Get a fast, free quote from Luxury Duo Cleaning.",
  city: "Orlando",
  region: "FL",
  serviceArea: "Greater Orlando, FL area",
  // No real phone number was provided. Do not replace with a fabricated number.
  phonePlaceholder: "(555) 555-5555",
  phoneHref: "tel:+15555555555",
  email: "info@luxuryduocleaning.com",
  instagramUrl: "https://instagram.com/",
  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Request a Quote", href: "/request-a-quote" },
} as const;

export type Service = {
  slug: string;
  title: string;
  summary: string;
  details: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "commercial-construction",
    title: "Commercial & Construction Cleanup",
    summary: "Pre- and post-construction cleaning for contractors, builders, and property managers.",
    details:
      "We work with contractors, construction companies, and property managers to get job sites, offices, and units cleaning-ready or move-in ready — debris and dust removal, floor-to-ceiling wipe-down, and final detail cleans on your project timeline.",
    featured: true,
  },
  {
    slug: "residential",
    title: "Residential Cleaning",
    summary: "Recurring or one-time cleaning for your home, on your schedule.",
    details:
      "Kitchen, bathroom, and living-space wipe-down, dusting, vacuuming, and mopping — tailored to a weekly, biweekly, monthly, or one-time visit.",
  },
  {
    slug: "commercial",
    title: "Commercial Cleaning",
    summary: "Reliable cleaning for offices and small businesses.",
    details:
      "Routine office and storefront cleaning built around your business hours, so your space stays presentable without disrupting your day.",
  },
  {
    slug: "airbnb",
    title: "Airbnb & Vacation Rental Cleaning",
    summary: "Fast turnovers for hosts, between every guest.",
    details:
      "Turnover cleaning built for tight guest windows — linens, restock checks, and a consistent standard your reviews can count on.",
  },
  {
    slug: "move-in-move-out",
    title: "Move-In / Move-Out Cleaning",
    summary: "A clean slate for tenants, owners, and property managers.",
    details:
      "Deep, detailed cleaning for empty units — inside cabinets and appliances, baseboards, and fixtures — ready for the next occupant or a final walkthrough.",
  },
  {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    summary: "A thorough, top-to-bottom reset for any space.",
    details:
      "Everything in a standard clean, plus the detail work — baseboards, interior windows, appliance interiors, and hard-to-reach buildup.",
  },
];

export const placeholderTestimonials = [
  {
    quote:
      "PLACEHOLDER TESTIMONIAL — replace with a real client quote before launch.",
    author: "Client Name, Orlando FL",
  },
  {
    quote:
      "PLACEHOLDER TESTIMONIAL — replace with a real client quote before launch.",
    author: "Client Name, Orlando FL",
  },
  {
    quote:
      "PLACEHOLDER TESTIMONIAL — replace with a real client quote before launch.",
    author: "Client Name, Orlando FL",
  },
];
