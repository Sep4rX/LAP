/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e1a',
        surface: '#111827',
        border: '#1f2937',
        accent: '#00ff88',
        danger: '#ff3b5c',
        warning: '#f59e0b',
        info: '#38bdf8',
        text: '#e2e8f0',
        muted: '#6b7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
