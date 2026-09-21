import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c1917',
        sand: '#f5f0e8',
        gold: '#b08d57',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
} satisfies Config;
