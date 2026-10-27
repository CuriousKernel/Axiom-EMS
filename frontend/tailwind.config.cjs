/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#0a1628', elevated: '#0f1f3d', card: '#132040', border: '#1e3a5f' },
        cyan: { glow: '#22d3ee', dim: '#0891b2', soft: '#a5f3fc' },
        amber: { alert: '#f59e0b', bright: '#fbbf24', soft: '#fef3c7' },
        red: { alert: '#ef4444', bright: '#f87171', soft: '#fee2e2' },
        green: { ok: '#22c55e', bright: '#4ade80', soft: '#dcfce7' },
      },
      fontFamily: { mono: ['JetBrains Mono', 'Fira Mono', 'monospace'] },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
}
