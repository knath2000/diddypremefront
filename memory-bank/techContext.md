# Technical Context: Supreme Price Tracker

## Technology Stack Overview

### Frontend Technologies
- **Nuxt 4** (stable July 15, 2025)
  - New `app/` directory structure
  - Smarter data-fetching with shared cache
  - Granular TypeScript projects
  - Faster CLI performance
- **Vue 3.4** with Composition API
- **Pinia** for state management
- **Tailwind CSS v4.1.11** with CSS custom properties (configured this session)
- **ECharts** for price visualization
- **TypeScript** for type safety

### Backend Technologies
- **Nitro Server** (Nuxt 4 backend)
  - Serverless functions on Vercel
  - Edge runtime support
  - Zero Webpack/Vite configuration
- **Prisma ORM** for database operations
- **Node.js 18+** runtime environment

### Database & Storage
- **Primary Options**:
  - **PlanetScale** (MySQL with branching)
  - **Supabase** (PostgreSQL with real-time)
- **Search Engine**: Meilisearch (self-hosted on Vercel KV)
- **Cache Layer**: Vercel KV (Redis) for sessions and search cache
- **File Storage**: Vercel Blob for image assets

### Deployment & Infrastructure
- **Vercel** (primary deployment)
  - Native Nuxt 4 support via `@nuxt/vercel-builder`
  - Edge Functions for page rendering
  - Serverless Functions for API routes
  - Vercel Cron for background jobs (≤1 min intervals)
- **CDN**: Vercel Edge Network for global distribution
- **Monitoring**: Vercel Analytics + Sentry

## Current Implementation Status (Latest Session)

### ✅ Tailwind CSS v4 Configuration (Completed)
```css
/* assets/css/main.css - Current implementation */
@import "tailwindcss";

@theme {
  --color-supreme-red: #ff0000;
  --color-supreme-white: #ffffff;
  --color-supreme-black: #000000;
  
  /* Platform Colors */
  --color-stockx-500: #22c55e;
  --color-goat-500: #3b82f6;
  --color-grailed-500: #a855f7;
  
  /* Custom fonts and animations */
  --font-family-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}

/* Platform-specific styling patterns */
.platform-stockx {
  background-color: var(--color-stockx-50);
  color: var(--color-stockx-900);
}
```

### ✅ Component Architecture (Established)
- **Zero External Dependencies**: All UI components built from scratch
- **Tailwind v4 Utilities**: Using latest CSS-first configuration
- **Dark Mode**: CSS variable-based theme switching
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### ✅ Current Project Structure
```
components/
├─ AppHeader.vue     # Layout with dark mode toggle
├─ AppFooter.vue     # Footer with social links
└─ ItemCard.vue      # Product display component

pages/
├─ index.vue         # Main catalog page
├─ trending.vue      # Trending items page
└─ alerts.vue        # Price alerts page

assets/css/
└─ main.css          # Tailwind v4 configuration
```

## Development Environment

### Prerequisites
```bash
# Required versions
Node.js: 18.0.0 or higher
pnpm: 8.0.0 or higher (preferred package manager)
Git: 2.30.0 or higher
```

### Local Development Setup
```bash
# Project initialization
npx nuxi init supreme-tracker
cd supreme-tracker
pnpm install

# Add Vercel builder
pnpm add --save-dev @nuxt/vercel-builder

# Development server
pnpm dev  # Runs on http://localhost:3000
```

### Environment Configuration
```bash
# Required environment variables
DATABASE_URL=postgresql://...           # Database connection
STOCKX_API_KEY=...                     # StockX developer API key
STOCKX_API_SECRET=...                  # StockX API secret
APIFY_TOKEN=...                        # Apify platform token
MEILISEARCH_HOST=...                   # Search engine endpoint
MEILISEARCH_MASTER_KEY=...             # Search engine admin key
SUPABASE_URL=...                       # Authentication service
SUPABASE_ANON_KEY=...                  # Public Supabase key
SENTRY_DSN=...                         # Error tracking
VERCEL_ENV=development|preview|production
```

### Development Tools
- **VS Code** with recommended extensions:
  - Volar (Vue 3 support)
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - Prisma extension
- **Chrome DevTools** with Vue DevTools
- **Postman/Insomnia** for API testing

## External API Integration

### StockX Official API
```typescript
// Configuration
const stockxConfig = {
  baseURL: 'https://api.stockx.com/v2',
  authentication: 'OAuth2',
  rateLimits: {
    requests: 1000,
    period: '1 hour',
    burst: 10
  },
  documentation: 'https://developer.stockx.com'
}
```

### Apify Platform Integration
```typescript
// For GOAT and Grailed scraping
const apifyConfig = {
  baseURL: 'https://api.apify.com/v2',
  actors: {
    goatScraper: 'apify/goat-scraper',
    grailedScraper: 'apify/grailed-scraper'
  },
  rateLimits: {
    concurrent: 5,
    monthly: 10000  // requests
  }
}
```

### Fallback Options
- **Sneaks-API** (GitHub: druv5319/Sneaks-API)
  - Open-source multi-platform scraper
  - Good for POCs but requires maintenance
  - Use for development/testing only

## Database Architecture

### Schema Management
```typescript
// Prisma configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // or "mysql" for PlanetScale
  url      = env("DATABASE_URL")
}
```

### Migration Strategy
- **Development**: Auto-migrations with `prisma db push`
- **Production**: Explicit migrations with `prisma migrate deploy`
- **Branching**: PlanetScale branch-based schema changes

### Performance Considerations
- **Connection Pooling**: Built into PlanetScale/Supabase
- **Query Optimization**: Prisma query analysis
- **Indexing Strategy**: Time-series optimized for price data
- **Read Replicas**: Available in production tier

## Build & Deployment

### Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "app/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "crons": [
    {
      "path": "/api/poll-stockx",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/poll-goat", 
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### Build Process
```bash
# Local build
pnpm build     # Generates .output/ directory
pnpm preview   # Test production build locally

# Vercel deployment
vercel --prod  # Deploy to production
vercel         # Deploy to preview environment
```

### Environment Strategy
- **Development**: Local with `.env.local`
- **Preview**: Vercel preview deployments for PRs
- **Production**: Vercel production with environment secrets

## Performance Requirements

### Frontend Performance
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1
- **Bundle Size**: <1MB initial, <5MB total

### Backend Performance  
- **API Response Time**: <200ms (cached), <2s (fresh)
- **Database Query Time**: <100ms average
- **Background Job Execution**: <5 minutes
- **Concurrent Users**: 1000+ supported

### Availability Targets
- **Uptime**: 99.9% (8.77 hours downtime/year)
- **Data Freshness**: 15-30 minute maximum lag
- **Error Rate**: <0.1% of requests

## Security Considerations

### API Security
- **Authentication**: JWT tokens with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Per-user and per-IP throttling
- **Input Validation**: Zod schemas for all inputs
- **CORS**: Restricted to authorized domains only

### Data Protection
- **Encryption**: TLS 1.3 for all connections
- **API Keys**: Environment variables only, never committed
- **Database**: Encrypted at rest (provider default)
- **User Data**: GDPR/CCPA compliant handling

### Compliance Requirements
- **StockX API**: Respect Terms of Service and rate limits
- **Web Scraping**: Follow robots.txt and ethical guidelines
- **Data Retention**: Configurable user data deletion
- **Legal Notices**: Platform trademark attribution

## Monitoring & Observability

### Application Monitoring
```typescript
// Sentry configuration
import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1
})
```

### Performance Tracking
- **Vercel Analytics**: Page performance and user analytics
- **Real User Monitoring**: Core Web Vitals tracking
- **API Metrics**: Response times and error rates
- **Database Monitoring**: Query performance and connection health

### Business Metrics
- **Price Data Accuracy**: Comparison with manual verification
- **Data Freshness**: Time since last successful update
- **User Engagement**: Page views, session duration, retention
- **Alert Effectiveness**: Notification delivery success rates

## Development Constraints

### Technical Limitations
- **Vercel Function Timeout**: 10 seconds (hobby), 60 seconds (pro)
- **Vercel Cron Frequency**: Minimum 1-minute intervals
- **Database Connections**: Limited by provider tier
- **API Rate Limits**: StockX and Apify usage quotas

### Legal Constraints
- **StockX API ToS**: Commercial usage restrictions
- **Platform Scraping**: Anti-bot detection and IP blocking
- **Data Usage**: Attribution and deletion requirements
- **Copyright**: Image usage and trademark compliance

### Scalability Planning
- **Microservice Migration**: Plan for separate scraping services
- **Database Sharding**: Horizontal scaling strategy
- **CDN Strategy**: Multi-region asset distribution
- **Queue Systems**: Background job processing at scale

## Future Technology Considerations

### Potential Upgrades
- **Nuxt 5+**: Stay current with framework evolution
- **Edge Databases**: PlanetScale Edge or Turso for global latency
- **AI/ML Integration**: TensorFlow.js or hosted model APIs
- **Real-time Features**: WebSocket connections for live updates

### Alternative Platforms
- **Backup Deployment**: Netlify or Railway as Vercel alternative
- **Database Alternatives**: TimescaleDB for time-series optimization
- **Search Alternatives**: Algolia for managed search service
- **Monitoring Alternatives**: DataDog or New Relic for enterprise needs 