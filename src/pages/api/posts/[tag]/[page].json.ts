import type { APIRoute, GetStaticPaths } from 'astro';
import { getPagesFromDB } from '@/lib/contentFetcher.js';
import { TAG_LATEST } from '@/utils/constants.js';

const PAGE_SIZE = 10;

export const getStaticPaths: GetStaticPaths = async () => {
  const pageInfo = await getPagesFromDB();
  const allPosts = pageInfo.pages;

  // Group posts by tag
  const byTag: Record<string, any[]> = {};
  allPosts.forEach((post) => {
    const tag = post.tag;
    if (!byTag[tag]) byTag[tag] = [];
    byTag[tag].push(post);
  });

  // Add "latest" group (all posts sorted by date — already sorted from getPagesFromDB)
  byTag[TAG_LATEST] = allPosts;

  const paths: { params: { tag: string; page: string }; props: any }[] = [];

  for (const [tag, posts] of Object.entries(byTag)) {
    const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * PAGE_SIZE;
      const pagePosts = posts.slice(start, start + PAGE_SIZE);
      paths.push({
        params: { tag, page: String(page) },
        props: {
          posts: pagePosts.map((p) => ({
            id: p.id,
            title: p.title,
            tag: p.tag,
            slug: p.slug,
            thumbnail: p.thumbnail,
            date: p.date,
            summary: p.summary,
          })),
          totalPages,
          currentPage: page,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }
  }

  return paths;
};

export const GET: APIRoute = ({ props }) => {
  return new Response(JSON.stringify(props), {
    headers: { 'Content-Type': 'application/json' },
  });
};
