const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addComponents, theme }) => {
  addComponents({
    '.prose': {
      color: theme('colors.slate.500'),
      maxWidth: '65ch',
      '& :where(h1, h2, h3, h4)': {
        color: theme('colors.slate.800'),
        fontWeight: theme('fontWeight.semibold'),
      },
      '& :where(p, ul, ol, blockquote, pre, figure)': {
        marginTop: theme('spacing.4'),
        marginBottom: theme('spacing.4'),
      },
      '& :where(a)': {
        color: theme('colors.sky.500'),
        textDecoration: 'none',
        fontWeight: theme('fontWeight.medium'),
      },
      '& :where(a:hover)': { textDecoration: 'underline' },
      '& :where(strong)': {
        color: theme('colors.slate.800'),
        fontWeight: theme('fontWeight.medium'),
      },
      '& :where(blockquote)': {
        borderLeftWidth: '2px',
        borderLeftColor: theme('colors.teal.500'),
        fontStyle: 'italic',
        paddingLeft: theme('spacing.4'),
      },
      '& :where(ul, ol)': {
        paddingLeft: theme('spacing.5'),
      },
      '& :where(ul)': { listStyleType: 'disc' },
      '& :where(ol)': { listStyleType: 'decimal' },
      '& :where(li)': {
        marginTop: theme('spacing.1'),
        marginBottom: theme('spacing.1'),
      },
      '& :where(img)': {
        width: '100%',
      },
      '& :where(figcaption)': {
        marginTop: theme('spacing.3'),
        fontSize: theme('fontSize.sm')[0],
        fontStyle: 'italic',
        textAlign: 'center',
        color: theme('colors.gray.400'),
      },
      '& :where(pre)': {
        overflowX: 'auto',
        borderRadius: theme('borderRadius.DEFAULT'),
        backgroundColor: theme('colors.slate.800'),
        color: theme('colors.slate.500'),
        padding: theme('spacing.4'),
        fontSize: theme('fontSize.sm')[0],
        lineHeight: theme('lineHeight.tight'),
      },
      '& :where(code)': {
        fontFamily: theme('fontFamily.pt-mono'),
        color: theme('colors.sky.300'),
      },
      '& :where(code)::before, & :where(code)::after': {
        content: '""',
      },
    },
    '.dark .prose, .prose.dark\:prose-invert': {
      color: theme('colors.slate.400'),
      '& :where(h1, h2, h3, h4)': {
        color: theme('colors.slate.100'),
      },
      '& :where(strong)': {
        color: theme('colors.slate.100'),
      },
      '& :where(blockquote)': {
        borderLeftColor: theme('colors.gray.400'),
      },
    },
    '.prose-slate': {},
    '.max-w-none': { maxWidth: 'none' },
  });
});
