# System Patterns: Supreme Price Tracker

## High-Level Architecture

### Frontend-Backend Integration (Nuxt 4 Full-Stack)
```
Frontend (Nuxt 4 SPA + SSR)           Backend (Nitro Server Routes)
├─ Public pages: catalog, item detail  ├─ /api/items            → DB read
│  • Charts rendered with ECharts      ├─ /api/items/:id        → DB read  
│  • Static generation w/ ISR          ├─ /api/search           → Search engine
│  • View-Transitions & <NuxtTime/>    ├─ /api/prices/:id       → DB read
│                                      ├─ /admin/* (auth)       → DB + write
│                                      └─ /webhook/stockx       → Price batch
```

### Background Processing
```
Vercel Cron Jobs / Edge Functions:
• poll-stockx.ts   → every 15 min  (StockX Official API)
• poll-goat.ts     → every 30 min  (Apify Actor)  
• poll-grailed.ts  → every 30 min  (Apify Actor)
```

### Deployment Architecture
- **Edge Runtime**: Pages/Components for ultra-low TTFB
- **Serverless Functions**: API routes via Nitro server
- **Vercel Cron**: Background price polling ≤1 min intervals
- **CDN**: Static assets and incremental static regeneration

## Data Architecture

### Database Schema (PostgreSQL/PlanetScale)

#### Core Tables
```sql
TABLE items
├─ id (PK)
├─ title 
├─ slug
├─ brand
├─ image_url
├─ season
├─ style_code
└─ created_at

TABLE variants  
├─ id (PK)
├─ item_id (FK → items.id)
├─ size
└─ colour

TABLE prices (append-only for history)
├─ id (PK)
├─ variant_id (FK → variants.id)
├─ platform ENUM(stockx, goat, grailed)
├─ price_usd
├─ currency
├─ captured_at
└─ ask_or_bid ENUM(ask, bid, last)
```

#### Performance Optimizations
- **Materialized Views**: For history queries acceleration
- **TimescaleDB Hypertables**: For time-series price data (optional)
- **Indexes**: On variant_id, platform, captured_at for fast filtering

### Data Flow Patterns

#### Real-time Price Updates
1. **Background Jobs** → Fetch from APIs/scrapers
2. **Validation Layer** → Clean and normalize data
3. **Database Insert** → Append-only price records
4. **Cache Invalidation** → Clear stale frontend cache
5. **Real-time Push** → Notify connected clients

#### Search & Discovery
- **Primary Search**: Meilisearch (self-hosted on Vercel KV)
- **Fallback**: PostgreSQL full-text search
- **Auto-complete**: Redis-cached suggestions
- **Filters**: Size, color, price range, platform

## API Design Patterns

### RESTful Endpoints
```
GET  /api/items              # Paginated item catalog
GET  /api/items/:id          # Single item with variants
GET  /api/items/:id/prices   # Historical price data
GET  /api/search?q=...       # Search items
POST /api/alerts             # Create price alert
GET  /api/user/watchlist     # User's followed items
```

### Data Response Patterns
```typescript
// Consistent API response format
interface ApiResponse<T> {
  data: T
  meta: {
    total?: number
    page?: number
    hasMore?: boolean
  }
  timestamps: {
    dataAsOf: string
    requestedAt: string
  }
}
```

### Error Handling
- **Standardized Error Codes**: 4xx client, 5xx server
- **Graceful Degradation**: Fallback to cached data when APIs fail
- **Circuit Breaker**: Prevent cascade failures from external services

## Component Architecture (Vue 3.4)

### Shared Component Patterns
```
components/
├─ ui/                    # Base UI components
│  ├─ Button.vue
│  ├─ Card.vue
│  └─ Chart.vue
├─ features/              # Feature-specific components
│  ├─ PriceChart.vue      # ECharts integration
│  ├─ ItemCard.vue        # Product display
│  └─ SearchBox.vue       # Instant search
└─ layout/                # Layout components
   ├─ Header.vue
   └─ Footer.vue
```

### State Management (Pinia)
```typescript
// stores/items.ts - Item catalog state
// stores/prices.ts - Price data and charts  
// stores/user.ts - Authentication and preferences
// stores/alerts.ts - Price alert management
```

### Server Components Strategy
- **Heavy Charts**: Server-side rendered with selective hydration
- **Static Content**: Pre-rendered at build time with ISR
- **Dynamic Data**: Client-side fetching with SWR patterns

## Performance Patterns

### Caching Strategy
```
Level 1: Browser Cache (static assets, 1 year)
Level 2: CDN Cache (pages, 5 minutes)  
Level 3: Application Cache (API responses, 1 minute)
Level 4: Database Cache (query results, 30 seconds)
```

### Data Fetching Optimization
- **useAsyncData**: Shared cache keys like `price-${variantId}`
- **Batch Requests**: Combine multiple price queries
- **Incremental Loading**: Load chart data progressively
- **Prefetching**: Anticipate user navigation patterns

### Bundle Optimization
- **Code Splitting**: Route-based and component-based
- **Tree Shaking**: Remove unused chart components
- **Dynamic Imports**: Load heavy libraries on demand
- **Image Optimization**: WebP format with fallbacks

## Integration Patterns

### External API Management
```typescript
// Centralized API client with retry logic
class DataSource {
  async fetchStockXPrices(itemId: string) {
    return this.retryWithBackoff(() => 
      this.stockxClient.getPrices(itemId)
    )
  }
  
  async fetchGOATPrices(itemId: string) {
    return this.apifyClient.run('goat-scraper', { itemId })
  }
}
```

### Rate Limiting & Compliance
- **StockX API**: Respect official rate limits with exponential backoff
- **Scraping**: Rotate proxies, respect robots.txt
- **Data Retention**: GDPR-compliant deletion policies
- **Legal Notices**: Platform trademark attribution

### Monitoring & Observability
- **Vercel Analytics**: Performance and usage tracking
- **Sentry**: Error tracking and performance monitoring
- **Custom Metrics**: Data freshness, scraping success rates
- **Health Checks**: API endpoint availability monitoring

## Security Patterns

### Authentication & Authorization
- **Supabase Auth**: Secure user management
- **JWT Tokens**: Stateless session management
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: All user inputs sanitized

### Data Protection
- **API Key Management**: Environment variables only
- **HTTPS Everywhere**: Force SSL for all endpoints
- **CORS Configuration**: Restrict origin access
- **SQL Injection Prevention**: Parameterized queries only

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side sessions
- **Database Scaling**: Read replicas for query distribution
- **CDN Distribution**: Global edge caching
- **Background Jobs**: Queue-based processing

### Performance Thresholds
- **Response Time**: <200ms for cached, <2s for fresh data
- **Throughput**: 1000+ concurrent users
- **Data Freshness**: Price updates within 15-30 minutes
- **Uptime**: 99.9% availability target

### Future Architecture Evolution
- **Microservices**: Split heavy scraping into separate services
- **Event-Driven**: Publish price changes to message queues
- **ML Pipeline**: Separate prediction service deployment
- **Multi-Region**: Deploy closer to user concentrations 