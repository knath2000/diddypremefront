<template>
  <div>
    <!-- Hero Section -->
    <section class="pt-20 pb-28 relative overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 blur-3xl animate-float" />
      <div class="absolute -bottom-40 right-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-500/30 to-green-400/30 blur-3xl animate-float" />

      <div class="container mx-auto px-4 text-center">
        <div class="mx-auto max-w-4xl lg-surface lg-elevation-3 lg-edge lg-pressable p-8 rounded-2xl">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent" style="background-image: var(--gradient-primary)">
            Supreme Price Tracker
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Real-time pricing across StockX, GOAT & Grailed. Earn hype points while you hunt deals.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <GlassButton @click="scrollToItems">Browse Items</GlassButton>
            <GlassButton variant="secondary" @click="$router.push('/trending')">View Trending</GlassButton>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Items" value="10K+" />
            <StatCard title="Platforms" value="3" />
            <StatCard title="Updates" value="15m" />
            <StatCard title="Uptime" value="99.9%" />
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="py-12 -mt-8 relative z-10">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <GlassCard class="p-8">
            <h2 class="text-2xl font-bold text-center mb-6 text-gray-100">
              Search Supreme Items
            </h2>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="hoodies, tees, accessories..."
                class="w-full pl-12 pr-4 py-4 text-lg rounded-xl focus:ring-2 focus:ring-accent-green bg-glass-dark text-white placeholder-gray-300 border border-white/20 backdrop-blur-sm"
                @keyup.enter="handleSearch"
              >
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <GlassButton 
                @click="handleSearch"
                class="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Search
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- Featured Items Section -->
    <section id="items" class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Featured Items
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trending Supreme pieces with the latest price data from all major platforms
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid grid-auto-fit-md gap-6">
          <div v-for="i in 8" :key="i" class="item-card p-6">
            <div class="skeleton h-48 mb-4"></div>
            <div class="skeleton h-4 mb-2"></div>
            <div class="skeleton h-4 w-3/4 mb-4"></div>
            <div class="flex justify-between">
              <div class="skeleton h-6 w-20"></div>
              <div class="skeleton h-6 w-16"></div>
            </div>
          </div>
        </div>

        <!-- Items Grid -->
        <div v-else-if="featuredItems?.length" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ItemCard 
            v-for="item in featuredItems" 
            :key="item.id" 
            :item="item"
            class="item-card"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="h-16 w-16 text-gray-400 mx-auto mb-4 text-6xl">📦</div>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No items available yet
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            We're currently setting up our item catalog. Check back soon!
          </p>
          <button 
            @click="$router.push('/about')"
            class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            Learn More
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="featuredItems?.length && !pending" class="text-center mt-12">
          <button 
            @click="$router.push('/browse')"
            class="px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 text-lg"
          >
            Browse All Items
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose Supreme Tracker?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get the edge you need in the streetwear market
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Real-time Data -->
          <div class="text-center">
            <div class="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="h-8 w-8 text-red-600 dark:text-red-400 text-2xl">⏰</div>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Real-time Updates
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Price data updated every 15-30 minutes across all platforms for the freshest market information.
            </p>
          </div>

          <!-- Price Alerts -->
          <div class="text-center">
            <div class="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="h-8 w-8 text-blue-600 dark:text-blue-400 text-2xl">🔔</div>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Smart Alerts
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Set custom price alerts and get notified instantly when your watched items hit your target price.
            </p>
          </div>

          <!-- Historical Data -->
          <div class="text-center">
            <div class="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div class="h-8 w-8 text-green-600 dark:text-green-400 text-2xl">📊</div>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Historical Charts
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Comprehensive price history and trend analysis to help you make informed buying decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Meta tags for SEO
useHead({
  title: 'Supreme Price Tracker - Real-time Streetwear Pricing',
  meta: [
    {
      name: 'description',
      content: 'Track Supreme prices in real-time across StockX, GOAT, and Grailed. Get price alerts, historical data, and never overpay for streetwear again.'
    },
    {
      name: 'keywords',
      content: 'supreme price tracker, supreme prices, stockx supreme, goat supreme, grailed supreme, streetwear prices'
    },
    {
      property: 'og:title',
      content: 'Supreme Price Tracker - Real-time Streetwear Pricing'
    },
    {
      property: 'og:description',
      content: 'Track Supreme prices in real-time across StockX, GOAT, and Grailed. Get price alerts, historical data, and never overpay for streetwear again.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Reactive state
const searchQuery = ref('')
const router = useRouter()
const config = useRuntimeConfig()

// Fetch featured items
const { data: featuredItemsResponse, pending } = await useFetch(() => `${config.public.apiBase}/items?limit=8`, {
  lazy: true,
  timeout: 15000,
  onRequestError: () => { pending.value = false }
})

const featuredItems = computed(() => featuredItemsResponse.value?.data || [])

// Search functionality
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Scroll to items section
const scrollToItems = () => {
  const element = document.getElementById('items')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script> 