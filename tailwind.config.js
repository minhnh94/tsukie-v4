module.exports = {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        aspekta: ['Aspekta', 'sans-serif'],
        'pt-mono': ['PT Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5715' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.415', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.333', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.277', letterSpacing: '-0.01em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.4em',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.500'),
            lineHeight: '1.5',
            maxWidth: 'none',
            // Headings
            h1: {
              fontFamily: theme('fontFamily.aspekta').join(', '),
              fontWeight: '650',
              fontSize: theme('fontSize.3xl[0]'),
              lineHeight: theme('fontSize.3xl[1].lineHeight'),
              letterSpacing: theme('fontSize.3xl[1].letterSpacing'),
              color: theme('colors.slate.800'),
              marginTop: '0', marginBottom: '0',
            },
            h2: {
              fontFamily: theme('fontFamily.aspekta').join(', '),
              fontWeight: '650',
              fontSize: theme('fontSize.2xl[0]'),
              lineHeight: theme('fontSize.2xl[1].lineHeight'),
              letterSpacing: theme('fontSize.2xl[1].letterSpacing'),
              color: theme('colors.slate.800'),
              marginTop: '0', marginBottom: '0',
            },
            h3: {
              fontFamily: theme('fontFamily.aspekta').join(', '),
              fontWeight: '650',
              fontSize: theme('fontSize.xl[0]'),
              lineHeight: theme('fontSize.xl[1].lineHeight'),
              letterSpacing: theme('fontSize.xl[1].letterSpacing'),
              color: theme('colors.slate.800'),
              marginTop: '0', marginBottom: '0',
            },
            h4: {
              fontFamily: theme('fontFamily.aspekta').join(', '),
              fontWeight: '650',
              fontSize: theme('fontSize.lg[0]'),
              lineHeight: theme('fontSize.lg[1].lineHeight'),
              letterSpacing: theme('fontSize.lg[1].letterSpacing'),
              color: theme('colors.slate.800'),
              marginTop: '0', marginBottom: '0',
            },
            // Text
            'p strong': { fontWeight: '500', color: theme('colors.slate.800') },
            strong: { fontWeight: '500', color: theme('colors.slate.800') },
            p: { marginTop: '0', marginBottom: '0' },
            // Blockquote
            blockquote: {
              fontStyle: 'italic', paddingLeft: theme('spacing.4'),
              borderLeftWidth: '2px', borderLeftColor: theme('colors.teal.500'),
              marginBottom: theme('spacing.8'), marginTop: '0', quotes: 'none',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            // Lists
            ul: { listStyleType: 'disc', listStylePosition: 'inside', paddingLeft: '0', marginTop: '0', marginBottom: '0' },
            ol: { listStyleType: 'decimal', listStylePosition: 'inside', paddingLeft: '0', marginTop: '0', marginBottom: '0' },
            li: { marginTop: theme('spacing.2'), marginBottom: '0', paddingLeft: '0' },
            'li p': { display: 'inline', margin: '0' },
            // Links
            a: { fontWeight: '500', color: theme('colors.sky.500'), textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            // Media
            figure: { marginBottom: theme('spacing.8'), marginTop: '0' },
            img: { width: '100%', marginTop: '0', marginBottom: '0' },
            figcaption: { fontSize: theme('fontSize.sm[0]'), textAlign: 'center', color: theme('colors.gray.400'), marginTop: theme('spacing.3'), fontStyle: 'italic' },
            // Code
            pre: { overflowX: 'auto', fontSize: theme('fontSize.sm[0]'), color: theme('colors.slate.500'), backgroundColor: theme('colors.slate.800'), padding: theme('spacing.4'), borderRadius: theme('borderRadius.DEFAULT'), lineHeight: theme('lineHeight.tight'), marginTop: '0', marginBottom: '0' },
            code: { fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' },
            'pre code': { fontFamily: theme('fontFamily.pt-mono').join(', ') },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'p > code': { color: theme('colors.sky.300') },
            'h3 > code': { color: theme('colors.sky.300') },
            'li > code': { color: theme('colors.sky.300') },
            // Tables
            table: { width: '100%', fontSize: theme('fontSize.sm[0]') },
            thead: { borderBottomColor: theme('colors.slate.300') },
            'thead th': { color: theme('colors.slate.800'), fontWeight: '600', paddingBottom: theme('spacing.2') },
            'tbody td': { paddingTop: theme('spacing.2'), paddingBottom: theme('spacing.2') },
            'tbody tr': { borderBottomColor: theme('colors.slate.200') },
            // Misc
            hr: { marginTop: '0', marginBottom: '0' },
            // Spacing: replicate space-y-4 behavior
            '> :where(*+*):not(:where([class~="not-prose"],[class~="not-prose"] *))': { marginTop: theme('spacing.4') },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.400'),
            h1: { color: theme('colors.slate.100') },
            h2: { color: theme('colors.slate.100') },
            h3: { color: theme('colors.slate.100') },
            h4: { color: theme('colors.slate.100') },
            'p strong': { color: theme('colors.slate.100') },
            strong: { color: theme('colors.slate.100') },
            blockquote: { borderLeftColor: theme('colors.gray.400') },
            thead: { borderBottomColor: theme('colors.slate.600') },
            'thead th': { color: theme('colors.slate.100') },
            'tbody tr': { borderBottomColor: theme('colors.slate.700') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
