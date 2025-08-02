// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules for Supreme Price Tracker
  modules: [
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
  ],

  // Vite configuration
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // CSS and styling
  css: ['~/assets/css/main.css'],

  // PostCSS configuration for Tailwind
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    stockxApiKey: process.env.STOCKX_API_KEY,
    stockxApiSecret: process.env.STOCKX_API_SECRET,
    apifyToken: process.env.APIFY_TOKEN,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
      vercelEnv: process.env.VERCEL_ENV || 'development'
    }
  },



  // Vercel deployment optimizations
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 60
      }
    },
    experimental: {
      wasm: true
    }
  },

  // Performance optimizations
  experimental: {
    viewTransition: false,
    payloadExtraction: false,
    sharedPrerenderData: true
  },

  // Nuxt build configuration
  build: {
    transpile: [
      'echarts',
      'vue-echarts',
      // Additional transpiles can be added here if needed
    ],
  },

  // Security headers configuration
  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https:'],
        'script-src': ["'self'", 'https:', "'unsafe-inline'"]
      }
    }
  },

  // Global error handling hooks
  hooks: {
    'render:route': (url, result) => {
      if ((result as any).error) {
        // eslint-disable-next-line no-console
        console.error(`Error rendering ${url}:`, (result as any).error)
      }
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Supreme Price Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time Supreme streetwear price tracking across StockX, GOAT, and Grailed' },
        { name: 'keywords', content: 'supreme, streetwear, price tracker, stockx, goat, grailed, sneakers' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
