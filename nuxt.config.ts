// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules for Supreme Price Tracker
  modules: [
    '@pinia/nuxt'
  ],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // CSS and styling
  // css: [], // Moving CSS import to app.vue for better compatibility
  
  // PostCSS configuration for Tailwind
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
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
    viewTransition: true,
    payloadExtraction: false,
    sharedPrerenderData: true
  },

  // Build optimizations
  build: {
    transpile: ['echarts', 'vue-echarts']
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
