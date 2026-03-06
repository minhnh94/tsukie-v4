import { getCollection, render } from 'astro:content';
import dayjs from 'dayjs';

const PAGE_SIZE = 10;

const loadAllPosts = async () => {
  const entries = await getCollection('posts', ({ data }) => data.ready === true);
  return entries.sort(
    (a, b) => dayjs(b.data.date).valueOf() - dayjs(a.data.date).valueOf()
  );
};

const convertToConsumable = (entry: Awaited<ReturnType<typeof loadAllPosts>>[number]) => {
  return {
    id: entry.data.slug,
    title: entry.data.title,
    thumbnail: entry.data.thumbnail.src,
    ready: entry.data.ready,
    tag: entry.data.tags,
    slug: entry.data.slug,
    summary: entry.data.summary,
    date: dayjs(entry.data.date).format('MMM DD, YYYY'),
    rawDate: dayjs(entry.data.date).toISOString(),
    readCount: entry.data.readCount,
  };
};

export const getPagesFromDB = async (pageSize: number | null = null, startCursor: string | null = null, tag: string | null = null) => {
  const entries = await loadAllPosts();
  let posts = entries.map(convertToConsumable);

  if (tag) {
    posts = posts.filter((post) => post.tag === tag);
  }

  const start = startCursor !== null ? parseInt(startCursor, 10) : 0;
  const end = pageSize !== null ? start + pageSize : posts.length;
  const sliced = posts.slice(start, end);
  const hasMore = end < posts.length;
  const nextCursor = hasMore ? String(end) : null;

  return {
    pages: sliced,
    hasMore,
    nextCursor,
  };
};

export const getPagesForSidebar = async (pageSize = 3, chronologically = false) => {
  const entries = await loadAllPosts();
  const posts = entries.map(convertToConsumable);

  if (chronologically) {
    return posts.slice(0, pageSize);
  }

  const sorted = [...posts].sort((a, b) => b.readCount - a.readCount);
  return sorted.slice(0, pageSize);
};

export const getPagesForFirstIndexPage = async () => {
  const { pages, hasMore, nextCursor } = await getPagesFromDB(PAGE_SIZE);
  return { pages, hasMore, nextCursor };
};

export const getPagesForIndexPage = async (pageNum: number) => {
  const start = (pageNum - 1) * PAGE_SIZE;
  const entries = await loadAllPosts();
  const posts = entries.map(convertToConsumable);
  const sliced = posts.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < posts.length;
  const nextCursor = hasMore ? String(start + PAGE_SIZE) : null;

  return { pages: sliced, hasMore, nextCursor };
};

export const getPagesForTag = async (tag: string, pageNum: number) => {
  const start = (pageNum - 1) * PAGE_SIZE;
  const entries = await loadAllPosts();
  const posts = entries.map(convertToConsumable).filter((post) => post.tag === tag);
  const sliced = posts.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < posts.length;
  const nextCursor = hasMore ? String(start + PAGE_SIZE) : null;

  return { pages: sliced, hasMore, nextCursor };
};

export const getAllPagedIndexPageNums = async () => {
  const entries = await loadAllPosts();
  const count = entries.length;
  const totalPages = Math.ceil(count / PAGE_SIZE);
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
  pageNums.shift();
  return pageNums;
};

export const getPageNumListForTagPages = async () => {
  const entries = await loadAllPosts();
  const count = entries.length;
  const totalPages = Math.ceil(count / PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export const getPageIdBySlug = async (slug: string) => {
  const entries = await loadAllPosts();
  const entry = entries.find((e) => e.data.slug === slug);
  return entry ? entry.data.slug : null;
};

export const getSuggestedArticlesForPage = async (pageProperties: { tag: string }) => {
  const entries = await loadAllPosts();
  const posts = entries
    .map(convertToConsumable)
    .filter((post) => post.tag === pageProperties.tag);
  posts.sort((page1, page2) => page1.readCount - page2.readCount);
  return posts.slice(0, 2);
};

export const getPagePropertiesById = async (pageId: string) => {
  const entries = await loadAllPosts();
  const entry = entries.find((e) => e.data.slug === pageId);
  return entry ? convertToConsumable(entry) : null;
};

export const renderPostById = async (slug: string) => {
  const entries = await getCollection('posts');
  const entry = entries.find((e) => e.data.slug === slug);
  if (!entry) return null;
  const { Content, headings } = await render(entry);
  return { Content, headings };
};

export const getStaticPageContent = async (slug: string): Promise<string> => {
  const entries = await getCollection('pages');
  const entry = entries.find((e) => e.id === slug);
  return entry?.body ?? '';
};
