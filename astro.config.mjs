// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// GitHub Pages project sites are served from a /<repo-name>/ subpath. This is
// only for previewing the build in CI — production hosting will use a
// top-level domain, where `base` should stay "/".
const isGhPagesPreview = process.env.GH_PAGES_PREVIEW === "true";

// https://astro.build/config
export default defineConfig({
  base: isGhPagesPreview ? "/luxeclean" : "/",
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  // Sharp's native Windows binary is blocked by this machine's Smart App
  // Control policy (same root cause as the native Astro compiler binary
  // issue documented in the README) — it intermittently 500s depending on
  // which responsive image size gets requested, which was making the hero
  // background disappear at some viewport widths. Passthrough skips Sharp
  // entirely and serves the original file, trading responsive/optimized
  // variants for images that always actually load.
  image: {
    service: passthroughImageService(),
  },
});