/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0E1117',
        surface: '#171B26',
        elevated: '#1F2433',
        border: '#2A3140',
        ink: '#F5F7FA',
        'ink-muted': '#9AA4B2',
        'ink-faint': '#5B6472',
        brand: '#7C5CFC',
        'brand-from': '#6366F1',
        'brand-to': '#A855F7',
        agree: '#22C55E',
        disagree: '#FB3B5C',
        skip: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 20px 60px -15px rgba(124,92,252,0.35)',
      },
      borderRadius: {
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
