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
  // Confirmed with the client as the towns they actually travel to. Keep this in
  // sync with reality before adding any city, since it is a promise of coverage.
  serviceAreaCities: [
    "Winter Park",
    "Kissimmee",
    "Lake Nona",
    "Altamonte Springs",
    "Apopka",
    "Sanford",
    "Oviedo",
    "Maitland",
    "Casselberry",
    "Ocoee",
    "Windermere",
    "Lake Mary",
  ],
  // Drives the service-area map embed. Swapping map providers is a one-line
  // change here plus the iframe URL in ServiceAreaMap.astro.
  mapQuery: "Orlando, FL",
  // No real phone number was provided. Do not replace with a fabricated number.
  phonePlaceholder: "(555) 555-5555",
  phoneHref: "tel:+15555555555",
  email: "info@luxuryduocleaning.com",
  // Keep in sync with openingHoursSpecification in Layout.astro's JSON-LD.
  hours: "Mon–Fri, 8am–6pm",
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

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
  // Optional link to the service this review is about (a slug from `services`).
  service?: string;
};

// SAMPLE COPY, not real reviews. These are written to show the shape and tone of
// a finished testimonials section and are labelled as samples everywhere they
// render. Replace wholesale with real Google reviews before launch; do not let
// them ship unlabelled.
export const sampleTestimonials: Testimonial[] = [
  {
    quote:
      "We've used Luxury Duo for three post-construction cleanups now. They're fast, they're thorough, and they actually understand what a jobsite needs.",
    author: "Jake Rivera",
    role: "Rivera General Contracting",
    rating: 5,
    service: "commercial-construction",
  },
  {
    quote:
      "Our guests consistently mention how clean the place is. Turnovers happen on time and we haven't had a single complaint since switching.",
    author: "Maria Perez",
    role: "Vacation rental owner, Kissimmee",
    rating: 5,
    service: "airbnb",
  },
  {
    quote:
      "Best commercial crew we've hired in Orlando. Professional, reliable, and the attention to detail is unmatched.",
    author: "Derek Kim",
    role: "Facility manager, Orlando Business Park",
    rating: 5,
    service: "commercial",
  },
  {
    quote:
      "They deep cleaned the whole house before we hosted for the holidays. Every baseboard, every window track. I wouldn't have known where to start.",
    author: "Tanisha Whitfield",
    role: "Homeowner, Winter Park",
    rating: 5,
    service: "deep-cleaning",
  },
  {
    quote:
      "I turn over units on short notice and they have never once made me reschedule a walkthrough. The unit is always ready.",
    author: "Marcus Delgado",
    role: "Property manager, Lake Nona",
    rating: 5,
    service: "move-in-move-out",
  },
];
