import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import dayjs from 'dayjs';

const POSTS_DIR = path.join(process.cwd(), 'src/markdown-posts');
const PAGE_SIZE = 10;

let _cachedPosts = null;

const loadAllPosts = () => {
  if (_cachedPosts !== null) {
    return _cachedPosts;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((fileName) => {
      const filePath = path.join(POSTS_DIR, fileName);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      return { frontmatter: data, content, filePath };
    })
    .filter((post) => post.frontmatter.ready === true)
    .sort((a, b) => dayjs(b.frontmatter.date).valueOf() - dayjs(a.frontmatter.date).valueOf());

  _cachedPosts = posts;
  return _cachedPosts;
};

const convertToConsumable = (frontmatter) => {
  return {
    id: frontmatter.slug,
    title: frontmatter.title,
    thumbnail: frontmatter.thumbnail,
    ready: frontmatter.ready,
    tag: frontmatter.tags,
    slug: frontmatter.slug,
    summary: frontmatter.summary,
    date: dayjs(frontmatter.date).format('MMM DD, YYYY'),
    rawDate: dayjs(frontmatter.date).toISOString(),
    readCount: frontmatter.readCount || 0,
  };
};

export const getPagesFromDB = async (pageSize = null, startCursor = null, tag = null) => {
  let posts = loadAllPosts().map((post) => convertToConsumable(post.frontmatter));

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
  const posts = loadAllPosts().map((post) => convertToConsumable(post.frontmatter));

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

export const getPagesForIndexPage = async (pageNum) => {
  const start = (pageNum - 1) * PAGE_SIZE;
  const posts = loadAllPosts().map((post) => convertToConsumable(post.frontmatter));
  const sliced = posts.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < posts.length;
  const nextCursor = hasMore ? String(start + PAGE_SIZE) : null;

  return { pages: sliced, hasMore, nextCursor };
};

export const getPagesForTag = async (tag, pageNum) => {
  const start = (pageNum - 1) * PAGE_SIZE;
  const posts = loadAllPosts()
    .map((post) => convertToConsumable(post.frontmatter))
    .filter((post) => post.tag === tag);
  const sliced = posts.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < posts.length;
  const nextCursor = hasMore ? String(start + PAGE_SIZE) : null;

  return { pages: sliced, hasMore, nextCursor };
};

export const getAllPagedIndexPageNums = async () => {
  const count = loadAllPosts().length;
  const totalPages = Math.ceil(count / PAGE_SIZE);
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
  pageNums.shift();
  return pageNums;
};

export const getPageNumListForTagPages = async () => {
  const count = loadAllPosts().length;
  const totalPages = Math.ceil(count / PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export const getPageIdBySlug = async (slug) => {
  const post = loadAllPosts().find((p) => p.frontmatter.slug === slug);
  return post ? post.frontmatter.slug : null;
};

export const getSuggestedArticlesForPage = async (pageProperties) => {
  const posts = loadAllPosts()
    .map((post) => convertToConsumable(post.frontmatter))
    .filter((post) => post.tag === pageProperties.tag);
  posts.sort((page1, page2) => page1.readCount - page2.readCount);
  return posts.slice(0, 2);
};

export const getPagePropertiesById = async (pageId) => {
  const post = loadAllPosts().find((p) => p.frontmatter.slug === pageId);
  return post ? convertToConsumable(post.frontmatter) : null;
};

export const getPageContentAsMarkdownById = async (pageId) => {
  const post = loadAllPosts().find((p) => p.frontmatter.slug === pageId);
  return post ? post.content : '';
};
