import { visit } from 'unist-util-visit';

export function rehypeRemoveFigcaptionDuplicate() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process rehype-figure figures
      if (
        node.tagName !== 'figure' ||
        !node.properties?.className?.includes('rehype-figure') ||
        !parent ||
        index === null
      ) return;

      // Extract figcaption text
      const figcaption = node.children.find(
        (c) => c.type === 'element' && c.tagName === 'figcaption'
      );
      if (!figcaption) return;
      const captionText = getTextContent(figcaption).trim();
      if (!captionText) return;

      // Find next meaningful sibling (skip whitespace text nodes)
      let nextSiblingIndex = index + 1;
      while (
        nextSiblingIndex < parent.children.length &&
        parent.children[nextSiblingIndex].type === 'text' &&
        parent.children[nextSiblingIndex].value.trim() === ''
      ) {
        nextSiblingIndex++;
      }

      const nextSibling = parent.children[nextSiblingIndex];
      if (
        nextSibling &&
        nextSibling.type === 'element' &&
        nextSibling.tagName === 'p' &&
        getTextContent(nextSibling).trim() === captionText
      ) {
        // Remove the duplicate paragraph
        parent.children.splice(nextSiblingIndex, 1);
      }
    });
  };
}

function getTextContent(node) {
  if (node.type === 'text') return node.value;
  if (!node.children) return '';
  return node.children.map(getTextContent).join('');
}
