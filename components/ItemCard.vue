<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700">
    <!-- Item Image -->
    <div class="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
      <img 
        v-if="item.image_url" 
        :src="item.image_url" 
        :alt="item.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        loading="lazy"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
        📦
      </div>
      
      <!-- Supreme Logo Overlay -->
      <div class="absolute top-2 left-2">
        <div class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
          SUPREME
        </div>
      </div>
      
      <!-- Watchlist Heart (TODO: implement functionality) -->
      <button 
        class="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        aria-label="Add to watchlist"
      >
        <svg class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Item Content -->
    <div class="p-4">
      <!-- Item Name -->
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {{ item.name }}
      </h3>
      
      <!-- Item Details -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ item.category || 'Apparel' }}
        </span>
        <span v-if="item.season" class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
          {{ item.season }}
        </span>
      </div>

      <!-- Platform Prices -->
      <div class="space-y-2 mb-4">
        <div v-if="stockxPrice" class="flex items-center justify-between">
          <span class="platform-badge platform-stockx">StockX</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            ${{ stockxPrice.toLocaleString() }}
          </span>
        </div>
        
        <div v-if="goatPrice" class="flex items-center justify-between">
          <span class="platform-badge platform-goat">GOAT</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            ${{ goatPrice.toLocaleString() }}
          </span>
        </div>
        
        <div v-if="grailedPrice" class="flex items-center justify-between">
          <span class="platform-badge platform-grailed">Grailed</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            ${{ grailedPrice.toLocaleString() }}
          </span>
        </div>
      </div>

      <!-- Best Price Highlight -->
      <div v-if="bestPrice" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-green-800 dark:text-green-300">
            Best Price
          </span>
          <span class="font-bold text-green-900 dark:text-green-100">
            ${{ bestPrice.price.toLocaleString() }}
          </span>
        </div>
        <div class="text-xs text-green-700 dark:text-green-400 mt-1">
          on {{ bestPrice.platform }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <NuxtLink 
          :to="`/items/${item.id}`"
          class="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors text-center"
        >
          View Details
        </NuxtLink>
        <button 
          @click="handleSetAlert"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Set price alert"
        >
          🔔
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Computed properties for platform prices
const stockxPrice = computed(() => {
  const price = props.item.prices?.find(p => p.platform === 'stockx')
  return price?.current_price
})

const goatPrice = computed(() => {
  const price = props.item.prices?.find(p => p.platform === 'goat')
  return price?.current_price
})

const grailedPrice = computed(() => {
  const price = props.item.prices?.find(p => p.platform === 'grailed')
  return price?.current_price
})

// Find the best (lowest) price across all platforms
const bestPrice = computed(() => {
  const prices = []
  
  if (stockxPrice.value) {
    prices.push({ platform: 'StockX', price: stockxPrice.value })
  }
  if (goatPrice.value) {
    prices.push({ platform: 'GOAT', price: goatPrice.value })
  }
  if (grailedPrice.value) {
    prices.push({ platform: 'Grailed', price: grailedPrice.value })
  }
  
  if (prices.length === 0) return null
  
  return prices.reduce((min, current) => 
    current.price < min.price ? current : min
  )
})

// Handle setting price alert
const handleSetAlert = () => {
  // TODO: Implement price alert functionality
  console.log('Set alert for:', props.item.name)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.platform-badge {
  @apply inline-block px-2 py-1 text-xs font-semibold rounded border;
}

.platform-stockx {
  background-color: var(--color-stockx-50);
  color: var(--color-stockx-900);
  border-color: var(--color-stockx-500);
}

.platform-goat {
  background-color: var(--color-goat-50);
  color: var(--color-goat-900);
  border-color: var(--color-goat-500);
}

.platform-grailed {
  background-color: var(--color-grailed-50);
  color: var(--color-grailed-900);
  border-color: var(--color-grailed-500);
}
</style> 