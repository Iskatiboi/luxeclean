// @ts-check
import { defineConfig } from 'astro/config';

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

  integrations: [react()]
});