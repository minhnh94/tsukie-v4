import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { rehypeExternalLinks, rehypeLazyImages } from './src/lib/rehypeExternalLinks.js';

const devOnlyRoutes = {
  name: 'dev-only-routes',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') {
        injectRoute({
          pattern: '/yappie-test',
          entrypoint: new URL('./src/dev-pages/yappie-test.astro', import.meta.url),
        });
      }
    },
  },
};

export default defineConfig({
  site: 'https://tsukie.com',
  output: 'static',
  trailingSlash: 'never',
  // Emit /blog.html rather than /blog/index.html: Cloudflare Pages redirects
  // directory-style pages to a trailing slash, which contradicts trailingSlash above.
  build: { format: 'file' },
  markdown: {
    rehypePlugins: [rehypeExternalLinks, rehypeLazyImages],
  },
  integrations: [
    devOnlyRoutes,
    mdx(),
    react(),
    sitemap(),
  ],
});
