// Prefixes internal links with Astro's configured `base` (a no-op "/" in
// production; only non-trivial for the GitHub Pages preview, which is
// served from a /luxeclean/ subpath).
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
