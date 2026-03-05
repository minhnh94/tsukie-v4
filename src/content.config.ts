import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/markdown/posts' }),
  schema: z.object({
    title: z.string(),
    tags: z.string(),
    date: z.coerce.date(),
    ready: z.boolean(),
    thumbnail: z.string().url(),
    slug: z.string(),
    summary: z.string(),
    readCount: z.number().default(0),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/markdown' }),
  schema: z.object({}).passthrough(),
});

export const collections = { posts, pages };
