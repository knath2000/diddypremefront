<template>
  <article 
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    class="item-card"
    :aria-label="`${item.title} - ${bestPriceLabel}`"
  >
    <!-- Item Image -->
    <div class="item-card__image-container">
      <ItemImage 
        :src="primaryImage"
        :alt="item.title"
        :loading="loading"
        @error="handleImageError"
      />
      
      <!-- Best Price Bubble -->
      <PriceBubble
        v-if="bestPrice"
        :price="bestPrice.price"
        :platform="bestPrice.platform"
        size="sm"
        :animated="true"
        class="absolute top-3 right-3"
      />
    </div>

    <!-- Item Content -->
    <div class="item-card__content">
      <!-- Item Name -->
      <h3 class="item-card__title">
        {{ item.title }}
      </h3>
      
      <!-- Item Metadata -->
      <ItemMetadata 
        :season="item.season"
        :brand="item.brand"
        :style-code="item.styleCode"
      />

      <!-- Quick Actions -->
      <div class="item-card__actions">
        <QuickPriceView 
          v-if="showQuickPrices"
          :prices="platformPrices"
        />
        
        <NuxtLink 
          :to="`/items/${item.id}`"
          class="item-card__cta"
          :aria-label="`View details for ${item.title}`"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Item, Price, Platform } from '~/types'
import PriceBubble from '~/components/price/PriceBubble.vue'
import ItemImage from './item/ItemImage.vue'
import ItemMetadata from './item/ItemMetadata.vue'
import QuickPriceView from './item/QuickPriceView.vue'

interface Props {
  item: Item
  loading?: boolean
  showQuickPrices?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showQuickPrices: false
})

const emit = defineEmits<{
  'image-error': [error: Event]
}>()

// Composables
const { formatPrice } = usePriceFormatter()
const { trackEvent } = useAnalytics()

// State
const imageError = ref(false)

// Computed properties
const primaryImage = computed(() => 
  item.value.imageUrl || 
  item.value.image_url || 
  item.value.images?.[0]?.url ||
  '/images/placeholder.png'
)

const item = computed(() => props.item)

// Extract all prices from variants
const allPrices = computed<Price[]>(() => {
  if (!item.value.variants?.length) return []
  
  return item.value.variants.flatMap(variant => 
    variant.prices || []
  ).filter(Boolean)
})

// Get lowest price for each platform
const platformPrices = computed(() => {
  const priceMap = new Map<Platform, number>()
  
  allPrices.value.forEach(price => {
    const current = priceMap.get(price.platform)
    if (!current || price.price_usd < current) {
      priceMap.set(price.platform, price.price_usd)
    }
  })
  
  return Array.from(priceMap.entries()).map(([platform, price]) => ({
    platform,
    price
  }))
})

// Find the best (lowest) price
const bestPrice = computed(() => {
  if (platformPrices.value.length === 0) return null
  
  return platformPrices.value.reduce((best, current) => 
    current.price < best.price ? current : best
  )
})

const bestPriceLabel = computed(() => 
  bestPrice.value 
    ? `Best price: ${formatPrice(bestPrice.value.price)} on ${bestPrice.value.platform}`
    : 'Price unavailable'
)

// Methods
const handleImageError = (error: Event) => {
  imageError.value = true
  emit('image-error', error)
  
  // Track image load failure
  trackEvent('item_image_error', {
    item_id: item.value.id,
    image_url: primaryImage.value
  })
}

// Track item view
onMounted(() => {
  trackEvent('item_card_viewed', {
    item_id: item.value.id,
    item_title: item.value.title,
    has_price: !!bestPrice.value,
    best_price: bestPrice.value?.price,
    platform: bestPrice.value?.platform
  })
})
</script>

<style scoped>
.item-card {
  @apply bg-blur rounded-2xl overflow-hidden group;
  @apply transform hover:-translate-y-2 transition-all duration-300;
  @apply border border-white/20 backdrop-blur-md shadow-xl;
}

.item-card__image-container {
  @apply aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800;
}

.item-card__content {
  @apply p-4 relative;
}

.item-card__title {
  @apply font-bold text-gray-900 dark:text-white mb-2;
  @apply line-clamp-2 leading-tight;
}

.item-card__actions {
  @apply flex items-center justify-between mt-4;
}

.item-card__cta {
  @apply h-12 w-12 bg-supreme-red text-white rounded-full;
  @apply flex items-center justify-center shadow-lg;
  @apply transform group-hover:scale-110 group-hover:rotate-12;
  @apply transition-all duration-300 ease-in-out hover:shadow-xl;
}

/* Utility class for line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 