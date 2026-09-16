# Luxury Duo Cleaning LLC — website rebuild

Rebuild of the site at luxeduocleaningllc.com on Astro + Tailwind, keeping the
existing visual identity (pale lavender-gray background, black pill buttons,
Young Serif headings / Bitter body — measured from the live site) while
modernizing the stack, structure, SEO, and accessibility.

## Stack

- **Astro** — static output, minimal JS
- **Tailwind CSS v4** — theme tokens in [`src/styles/global.css`](src/styles/global.css) (`@theme` block)
- **React islands** (`client:load`) only where there's real interactivity: the mobile nav toggle, and the two forms. Everything else — including the services accordion (native `<details>/<summary>`) — ships zero JS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

### ⚠️ Known local blocker on this machine

`npm run dev` / `npm run build` currently fail here with:

```
Cannot find native binding ... An Application Control policy has blocked this file.
```

This is **Windows Smart App Control / WDAC blocking the native Astro compiler
binary** (`@astrojs/compiler-binding-win32-x64-msvc`), not a bug in this
project. It's a machine-level security policy, so it wasn't something to work
around automatically. Options, in order of least disruptive:

1. Run the project inside **WSL2** (Windows Subsystem for Linux) — Linux
   binaries aren't subject to this Windows policy.
2. Push this repo to GitHub and preview via a host's deploy preview
   (Netlify/Vercel/Cloudflare Pages) instead of running locally.
3. Turn off **Smart App Control** in Windows Security settings — note this is
   a one-way switch; Microsoft only lets you turn it back on via a clean
   Windows reinstall.

## Project structure

```
src/
  components/      Reusable Astro components + the two form React islands
  layouts/
    Layout.astro   <head> (SEO/OG/JSON-LD, font preloads), Header, Footer
  pages/           One file per route (Home, About Us, Services,
                   Testimonials, Contact, Request a Quote)
  site.config.ts   Business facts, nav, service list, placeholder testimonials
  styles/
    global.css     Tailwind v4 theme tokens (colors, fonts, radius)
```

## Content still needed from the client

Everything below is a clearly-marked placeholder in the code — search for
`PLACEHOLDER` / `TODO` / `placeholder` to find every instance.

- **Phone number** — no number was provided despite "receive calls" being a
  stated goal. `site.phonePlaceholder` in `src/site.config.ts` is a dummy
  value; nothing fabricated. JSON-LD schema omits `telephone` entirely until
  a real number exists.
- **Canonical domain** — live site is `luxeduocleaningllc.com`, the given
  contact email is on `luxuryduocleaning.com`. `site.url` in
  `src/site.config.ts` is a placeholder until you confirm which one is
  canonical (affects page titles, canonical `<link>`, OG tags, JSON-LD).
- **Footer content** — the live site's footer was never filled in (it still
  reads "Your Site Title"). `src/components/Footer.astro` has a reasonable
  placeholder structure; confirm real copy and whether TikTok (present on the
  live site's footer, not mentioned in the original brief) should be linked
  alongside Instagram.
- **Real photography** — every image slot renders `PlaceholderImage.astro`
  (a labeled gray box) instead of a photo. The homepage "Recent work" section
  (`src/pages/index.astro`) has two slots sized for the client's two real
  completed-job photos — replace those `PlaceholderImage` usages with
  `astro:assets`'s `<Image />` once files are supplied.
- **Testimonials** — `src/site.config.ts` → `placeholderTestimonials` has 3
  dummy quotes. Replace with real ones on the Testimonials page and homepage.
- **Form backend** — the Contact and Request-a-Quote forms validate and show
  submit feedback, but don't send anywhere until `PUBLIC_FORM_ENDPOINT` is
  set (see `.env.example`). Point it at Formspree, Netlify Forms, or your own
  serverless function.
- **Location** — copy uses Orlando, FL per your confirmation (the live site's
  About section currently says "Tampa based company" — worth fixing on the
  live site too if it's stale).

## Notes on real vs. estimated design tokens

The original brief's color/font guesses were close but not exact. These
values were measured directly from the live site's computed styles rather
than eyeballed from screenshots:

- Background: `#EAEAEE`
- Heading font: **Young Serif** (not Fraunces/Lora)
- Body/nav/label font: **Bitter** (not Inter) — labels are plain black, not navy
- Button radius: effectively a full pill (`border-radius: 300px`)
