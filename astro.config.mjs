import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import rehypeFigure from 'rehype-figure';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const remarkRemoveFigcaptionDuplicate = require('./src/lib/remarkRemoveFigcaptionDuplicate.js');

export default defineConfig({
  site: 'https://tsukie.com',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkRemoveFigcaptionDuplicate],
    rehypePlugins: [rehypeFigure],
  },
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    sentry({
      org: import.meta.env.SENTRY_ORG,
      project: import.meta.env.SENTRY_PROJECT,
      authToken: import.meta.env.SENTRY_AUTH_TOKEN,
    }),
    spotlightjs(),
  ],
});
