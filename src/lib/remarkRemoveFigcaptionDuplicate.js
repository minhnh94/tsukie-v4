const { visit } = require('unist-util-visit');

// Remark plugin: removes duplicate paragraphs that follow an image with the same alt text.
// Notion markdown exports caption text both as the image alt AND as a standalone paragraph.
// remark-smartypants converts quotes in paragraphs but NOT in image alt, so we normalize
// typographic characters before comparing.
function remarkRemoveFigcaptionDuplicate() {
  return function (tree) {
    const toRemove = new Set();

    visit(tree, 'image', (node, index, parent) => {
      if (!parent || index === null || !node.alt) return;

      const altNorm = normalize(node.alt.trim());
      if (!altNorm) return;

      // Look for the next sibling paragraph after the image
      // The image is usually wrapped in a paragraph, so check the grandparent level too
      const siblings = parent.children;
      let nextParaIndex = index + 1;
      // Skip whitespace-only nodes
      while (
        nextParaIndex < siblings.length &&
        siblings[nextParaIndex].type === 'text' &&
        siblings[nextParaIndex].value.trim() === ''
      ) {
        nextParaIndex++;
      }

      const nextSibling = siblings[nextParaIndex];
      if (nextSibling && nextSibling.type === 'paragraph') {
        const paraText = getParagraphText(nextSibling);
        if (normalize(paraText) === altNorm) {
          toRemove.add(nextSibling);
        }
      }
    });

    // Also handle the case where image is inside a paragraph (common in remark)
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === null) return;
      const images = node.children.filter((c) => c.type === 'image');
      if (images.length === 0) return;

      const img = images[0];
      if (!img.alt) return;

      const altNorm = normalize(img.alt.trim());
      if (!altNorm) return;

      // Find next sibling paragraph
      let nextIndex = index + 1;
      while (
        nextIndex < parent.children.length &&
        parent.children[nextIndex].type !== 'paragraph'
      ) {
        nextIndex++;
      }

      const nextSibling = parent.children[nextIndex];
      if (nextSibling && nextSibling.type === 'paragraph') {
        const paraText = getParagraphText(nextSibling);
        if (normalize(paraText) === altNorm) {
          toRemove.add(nextSibling);
        }
      }
    });

    if (toRemove.size === 0) return;

    // Remove all marked nodes
    visit(tree, 'paragraph', (node, index, parent) => {
      if (toRemove.has(node) && parent && index !== null) {
        parent.children.splice(index, 1);
        return [1, index]; // tell visit to re-check this index
      }
    });
  };
}

function getParagraphText(node) {
  return node.children.map(getNodeText).join('');
}

function getNodeText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(getNodeText).join('');
  return '';
}

function normalize(text) {
  return text
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[.,!?]+$/, '');  // strip trailing punctuation (links may omit trailing dot)
}

module.exports = remarkRemoveFigcaptionDuplicate;
