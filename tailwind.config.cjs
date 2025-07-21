const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'supreme-red': '#da2727',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-magenta': '#ec4899',
        'glass-white': 'rgba(255,255,255,0.25)',
        'glass-dark': 'rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'radial-gradient-bg': 'radial-gradient(circle at top left, #3b82f6, transparent 50%), radial-gradient(circle at bottom right, #ec4899, transparent 50%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 6px var(--supreme-red-glow)' },
          '100%': { boxShadow: '0 0 18px var(--supreme-red-glow)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.bg-blur': {
          '@apply bg-white/[.65] dark:bg-gray-800/[.65] backdrop-blur-lg': {},
          'border': `1px solid ${theme('colors.gray.200')}`,
          'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        '.dark .bg-blur': {
          'border': `1px solid ${theme('colors.gray.700')}`,
        }
      })
    })
  ],
} 