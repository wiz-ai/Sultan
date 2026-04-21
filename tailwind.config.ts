import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      colors: {
        sultan: {
          ink: '#0f1412',
          cream: '#faf5ec',
          parchment: '#f4ead5',
          sand: '#e8dcc0',
          emerald: {
            50: '#f0f7f3',
            100: '#daece0',
            200: '#b6d9c2',
            300: '#86bf9c',
            400: '#539d77',
            500: '#2f7f5a',
            600: '#1d6448',
            700: '#17513b',
            800: '#134131',
            900: '#0f2e24',
          },
          gold: {
            50: '#fdf9ec',
            100: '#faefca',
            200: '#f4de91',
            300: '#edc856',
            400: '#e6b533',
            500: '#d49a1e',
            600: '#b67816',
            700: '#915716',
            800: '#784519',
            900: '#663a1a',
          },
          clay: '#b55839',
          spice: '#a0371d',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 46, 36, 0.25)',
        glow: '0 0 0 1px rgba(230, 181, 51, 0.25), 0 20px 50px -20px rgba(230, 181, 51, 0.35)',
        card: '0 2px 10px -2px rgba(15, 46, 36, 0.08), 0 8px 30px -12px rgba(15, 46, 36, 0.12)',
      },
      backgroundImage: {
        'pattern-arabesque':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23d49a1e' stroke-opacity='0.08' stroke-width='1'><path d='M40 0 L80 40 L40 80 L0 40 Z'/><circle cx='40' cy='40' r='18'/><circle cx='40' cy='40' r='30'/></g></svg>\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
