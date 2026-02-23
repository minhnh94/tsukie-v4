import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeFigure from 'rehype-figure';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { rehypeExternalLinks } from './rehypeExternalLinks.js';

function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeFigure)
  .use(rehypeLazyImages)
  .use(rehypeHighlight, { ignoreMissing: true })
  .use(rehypeExternalLinks)
  .use(rehypeSlug)
  .use(rehypeStringify);

export async function renderMarkdown(markdown) {
  const result = await processor.process(markdown);
  // notion-to-md outputs "undefined" for unsupported block types,
  // which renders as a standalone <p>undefined</p>. Remove only those.
  return String(result).replace(/<p>undefined<\/p>/g, '');
}

export function extractHeadings(html) {
  const headings = [];
  const re = /<h([123])\s+id="([^"]+)"[^>]*>(.*?)<\/h[123]>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    headings.push({
      depth: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
  }
  return headings;
}
