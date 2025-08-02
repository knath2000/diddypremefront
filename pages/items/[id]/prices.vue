<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading price history...</p>
    </div>

    <!-- Error State -->
    <ErrorState 
      v-else-if="error" 
      :error="error"
      @retry="refresh"
    />

    <!-- Price History -->
    <div v-else-if="prices.length > 0">
      <PriceHistoryHeader 
        :item-id="itemId"
        :platform="selectedPlatform"
        :total-records="prices.length"
      />

      <!-- Platform Filter -->
      <div class="mb-6">
        <label for="platform-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Platform:
        </label>
        <PlatformSelect
          id="platform-select"
          v-model="selectedPlatform"
          :include-all="true"
          @change="handlePlatformChange"
        />
      </div>

      <!-- Price Table -->
      <PriceHistoryTable 
        :prices="prices"
        :loading="pending"
      />

      <!-- Export Options -->
      <div class="mt-6 flex justify-end gap-4">
        <ExportButton 
          :data="prices"
          format="csv"
          :filename="`price-history-${itemId}`"
        />
        <ExportButton 
          :data="prices"
          format="json"
          :filename="`price-history-${itemId}`"
        />
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState 
      v-else
      title="No price history found"
      description="There is no price data available for this item or variant yet."
      :show-action="true"
      action-text="Back to Item Details"
      :action-link="`/items/${itemId}`"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Platform, Price } from '~/types/price'

// Components
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import PriceHistoryHeader from '~/components/price/PriceHistoryHeader.vue'
import PlatformSelect from '~/components/price/PlatformSelect.vue'
import PriceHistoryTable from '~/components/price/PriceHistoryTable.vue'
import ExportButton from '~/components/ui/ExportButton.vue'

// Route and config
const route = useRoute()
const config = useRuntimeConfig()

// Extract params with type safety
const itemId = computed(() => String(route.params.id))
const variantId = computed(() => {
  const id = route.query.variantId
  return typeof id === 'string' ? id : undefined
})

// State
const selectedPlatform = ref<Platform | ''>(
  route.query.platform && typeof route.query.platform === 'string' 
    ? route.query.platform as Platform 
    : ''
)

// Composables
const { formatPrice } = usePriceFormatter()
const { trackEvent } = useAnalytics()

// Build fetch URL
const fetchUrl = computed(() => {
  // StockX uses separate endpoint
  if (selectedPlatform.value === 'stockx') {
    return `${config.public.apiBase}/items/${itemId.value}/stockx/history?type=lastSale&days=90`
  }
  
  // Regular price endpoint
  const url = new URL(`${config.public.apiBase}/items/${itemId.value}/prices`)
  
  if (variantId.value) {
    url.searchParams.append('variantId', variantId.value)
  }
  
  if (selectedPlatform.value) {
    url.searchParams.append('platform', selectedPlatform.value)
  }
  
  return url.toString()
})

// Fetch data
const { 
  data: pricesResponse, 
  pending, 
  error,
  refresh 
} = await useFetch<{ data: Price[] }>(fetchUrl, {
  lazy: true,
  server: false,
  onResponse({ response }) {
    // Track successful data fetch
    trackEvent('price_history_viewed', {
      item_id: itemId.value,
      platform: selectedPlatform.value || 'all',
      record_count: response._data?.data?.length || 0
    })
  },
  onResponseError({ response }) {
    console.error('Failed to fetch price history:', response._data)
  }
})

// Transform prices based on platform
const prices = computed<Price[]>(() => {
  if (!pricesResponse.value?.data) return []
  
  // StockX history needs transformation
  if (selectedPlatform.value === 'stockx') {
    const stockxData = pricesResponse.value.data as any[]
    return stockxData.map(item => ({
      id: `stockx-${item.fetchedAt}`,
      platform: 'stockx' as Platform,
      price_usd: item.price,
      currency: 'USD',
      ask_or_bid: item.type || 'last',
      captured_at: item.fetchedAt,
      variant_id: variantId.value || ''
    }))
  }
  
  return pricesResponse.value.data
})

// Handle platform change
const handlePlatformChange = () => {
  // Update URL query params
  const query: Record<string, string> = {}
  
  if (selectedPlatform.value) {
    query.platform = selectedPlatform.value
  }
  
  if (variantId.value) {
    query.variantId = variantId.value
  }
  
  navigateTo({
    path: route.path,
    query
  })
  
  // Track filter change
  trackEvent('price_filter_changed', {
    platform: selectedPlatform.value || 'all'
  })
}

// SEO
useHead({
  title: computed(() => `Price History - Item ${itemId.value}`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        `Historical price data for Supreme item ${itemId.value} across multiple platforms.`
      )
    },
    {
      name: 'robots',
      content: 'noindex, follow' // Don't index price history pages
    }
  ]
})
</script> 