import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { rehypeExternalLinks, rehypeLazyImages } from './src/lib/rehypeExternalLinks.js';

export default defineConfig({
  site: 'https://tsukie.com',
  output: 'static',
  markdown: {
    rehypePlugins: [rehypeExternalLinks, rehypeLazyImages],
  },
  integrations: [
    mdx(),
    tailwind(),
    react(),
    sitemap(),
  ],
});
