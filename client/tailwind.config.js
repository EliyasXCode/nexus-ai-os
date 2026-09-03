/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#080c16',
          surface: '#0f172a',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#6366f1',
          accent: '#38bdf8',
          purple: '#a855f7',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'nexus-glow': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'nexus-accent': '0 0 20px -3px rgba(56, 189, 248, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'glow-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'glow-spin': 'glow-spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
