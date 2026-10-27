/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#070B14',
        'navy-surface': '#0B1528',
        'panel-elevated': '#0F1F3D',
        'cyan-glow': '#00E5FF',
        'vivid-blue': '#2563EB',
        'ice-blue': '#7DD3FC',
        'pale-blue': '#BAE6FD',
        'royal-blue': '#1D4ED8',
        'azure-blue': '#0EA5E9',
        'text-primary': '#F0F7FF',
        'text-secondary': '#93B2D6',
        ers: {
          dark: '#070B14',
          navy: '#0B1528',
          card: '#0F1F3D',
          panel: '#122040',
          border: '#1E3A5F',
          cyan: '#00E5FF',
          blue: '#2563EB',
          red: '#EF4444',
          amber: '#F59E0B',
          emerald: '#10B981',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        hud: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 229, 255, 0.45)',
        'cyan-glow-sm': '0 0 10px rgba(0, 229, 255, 0.35)',
        'blue-glow': '0 0 22px -3px rgba(37, 99, 235, 0.5)',
        'red-glow': '0 0 22px -3px rgba(239, 68, 68, 0.6)',
        'amber-glow': '0 0 22px -3px rgba(245, 158, 11, 0.5)',
        'panel-depth': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(0, 229, 255, 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 8px rgba(0, 229, 255, 0.2)' },
          '100%': { boxShadow: '0 0 22px rgba(0, 229, 255, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
