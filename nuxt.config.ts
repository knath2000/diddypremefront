// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Deployment-aware defaults
const PROD_API_BASE = "https://diddyback-production.up.railway.app"
const isProdEnv = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

// Environment variables validation
const requiredEnvVars = [
  'DATABASE_URL',
  'NUXT_PUBLIC_API_BASE_URL'
] as const

// Validate environment variables in development
if (process.env.NODE_ENV === 'development') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`⚠️  Missing environment variable: ${envVar}`)
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  // Development tools
  devtools: { 
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
  ],

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['chart.js', 'vue-chartjs']
    }
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // PostCSS
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    stockxApiKey: process.env.STOCKX_API_KEY || '',
    stockxApiSecret: process.env.STOCKX_API_SECRET || '',
    apifyToken: process.env.APIFY_TOKEN || '',
    databaseUrl: process.env.DATABASE_URL || '',
    
    // Public keys (client-side)
    public: {
      // Default to production API on Vercel prod if no env override is set
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || (isProdEnv ? PROD_API_BASE : 'http://localhost:8080'),
      vercelEnv: process.env.VERCEL_ENV || 'development',
      appVersion: process.env.npm_package_version || '1.0.0',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || ''
    }
  },

  // Nitro server configuration
  nitro: {
    preset: 'vercel',
    
    // Vercel-specific optimizations
    vercel: {
      functions: {
        maxDuration: 60,
        runtime: 'nodejs20.x'
      }
    },
    
    // Experimental features
    experimental: {
      wasm: true,
      asyncContext: true
    },
    
    // Compression
    compressPublicAssets: true,
    
    // Error handling
  },

  // Performance optimizations
  experimental: {
    viewTransition: false,
    payloadExtraction: false,
    sharedPrerenderData: true,
    componentIslands: true,
    asyncContext: true
  },

  // Build configuration
  build: {
    transpile: [
      'chart.js',
      'vue-chartjs',
    ],
    analyze: {
      analyzerMode: 'static'
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Supreme Price Tracker - Real-time Streetwear Pricing',
      titleTemplate: '%s | Supreme Tracker',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time Supreme streetwear price tracking across StockX, GOAT, and Grailed' },
        { name: 'keywords', content: 'supreme, streetwear, price tracker, stockx, goat, grailed, sneakers' },
        { name: 'author', content: 'Supreme Tracker Team' },
        { name: 'theme-color', content: '#ff0000' },
        // Open Graph
        { property: 'og:title', content: 'Supreme Price Tracker' },
        { property: 'og:description', content: 'Real-time Supreme streetwear price tracking' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Supreme Price Tracker' },
        { name: 'twitter:description', content: 'Real-time Supreme streetwear price tracking' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    },
    
    // Page transition
    pageTransition: { 
      name: 'page', 
      mode: 'out-in' 
    },
    
    // Layout transition
    layoutTransition: { 
      name: 'layout', 
      mode: 'out-in' 
    }
  },

  // Hooks
  hooks: {
    'build:before': () => {
      console.log('🚀 Starting Supreme Price Tracker build...')
    },
    'build:done': () => {
      console.log('✅ Build completed successfully!')
    }
  }
})
