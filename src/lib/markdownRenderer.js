import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeFigure from 'rehype-figure';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { rehypeExternalLinks } from './rehypeExternalLinks.js';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeFigure)
  .use(rehypeHighlight, { detect: true })
  .use(rehypeExternalLinks)
  .use(rehypeStringify);

export async function renderMarkdown(markdown) {
  const result = await processor.process(markdown);
  // notion-to-md outputs "undefined" for unsupported block types,
  // which renders as a standalone <p>undefined</p>. Remove only those.
  return String(result).replace(/<p>undefined<\/p>/g, '');
}
