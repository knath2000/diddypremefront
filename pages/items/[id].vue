<template>
  <div class="item-detail-page">
    <!-- Loading State -->
    <ItemDetailSkeleton v-if="pending" />

    <!-- Error State -->
    <ErrorState 
      v-else-if="error || !item"
      :error="error"
      title="Item not found"
      description="The item you are looking for does not exist or has been removed."
      :show-retry="!!error"
      @retry="refresh"
    />

    <!-- Item Details -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Breadcrumbs -->
      <Breadcrumbs :items="breadcrumbs" class="mb-6" />

      <!-- Item Header -->
      <ItemDetailHeader 
        :item="item"
        :best-price="bestPrice"
        @share="handleShare"
        @favorite="handleFavorite"
      />

      <!-- Image Gallery -->
      <ItemImageGallery 
        :images="itemImages"
        :title="item.title"
        class="mb-8"
      />

      <!-- Price Overview -->
      <PriceOverview 
        v-if="hasPrices"
        :best-price="bestPrice"
        :price-summary="priceSummary"
        :last-updated="lastPriceUpdate"
        class="mb-8"
      />

      <!-- Variants Section -->
      <VariantsSection 
        v-if="item.variants.length > 0"
        :variants="item.variants"
        :selected-variant="selectedVariant"
        @select="handleVariantSelect"
        class="mb-8"
      />

      <!-- Price History Chart -->
      <PriceHistorySection 
        v-if="selectedVariant"
        :item-id="item.id"
        :variant-id="selectedVariant.id"
        class="mb-8"
      />

      <!-- Related Actions -->
      <ItemActions 
        :item="item"
        :variant="selectedVariant"
        @set-alert="handleSetAlert"
        @view-history="handleViewHistory"
      />

      <!-- Related Items -->
      <RelatedItems 
        v-if="relatedItems.length > 0"
        :items="relatedItems"
        class="mt-12"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Item, Variant, Price } from '~/types'

// Components (commented out until created)
// import ItemDetailSkeleton from '~/components/item/ItemDetailSkeleton.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
// import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
// import ItemDetailHeader from '~/components/item/ItemDetailHeader.vue'
// import ItemImageGallery from '~/components/item/ItemImageGallery.vue'
// import PriceOverview from '~/components/item/PriceOverview.vue'
// import VariantsSection from '~/components/item/VariantsSection.vue'
// import PriceHistorySection from '~/components/item/PriceHistorySection.vue'
// import ItemActions from '~/components/item/ItemActions.vue'
// import RelatedItems from '~/components/item/RelatedItems.vue'

// Composables
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { formatPrice } = usePriceFormatter()
const { trackEvent } = useAnalytics()
const { showNotification } = useNotifications()
const { addFavorite, removeFavorite, isFavorite } = useFavorites()

// Extract item ID
const itemId = computed(() => String(route.params.id))

// Fetch item details
const { 
  data: itemResponse, 
  pending, 
  error,
  refresh 
} = await useAsyncData(
  `item-${itemId.value}`,
  () => $fetch<{ data: Item }>(`${config.public.apiBase}/items/${itemId.value}`),
  {
    transform: (response) => response?.data || null
  }
)

// Fetch StockX data
const { data: stockxData } = await useLazyAsyncData(
  `stockx-${itemId.value}`,
  () => $fetch(`${config.public.apiBase}/items/${itemId.value}/stockx`),
  {
    server: false,
    transform: (response: any) => response?.data || null
  }
)

// Fetch related items
const { data: relatedItems } = await useLazyAsyncData(
  `related-${itemId.value}`,
  () => $fetch<{ data: Item[] }>(`${config.public.apiBase}/items/${itemId.value}/related`),
  {
    server: false,
    default: () => [],
    transform: (response) => response?.data || []
  }
)

// State
const selectedVariant = ref<Variant | null>(null)
const item = computed(() => itemResponse.value)

// Computed properties
const itemImages = computed(() => {
  if (!item.value) return []
  
  const images = []
  
  // Add primary image
  const primaryImage = item.value.imageUrl || item.value.image_url
  if (primaryImage) {
    images.push({ id: '1', url: primaryImage, isPrimary: true })
  }
  
  // Add additional images
  if (item.value.images?.length) {
    images.push(...item.value.images)
  }
  
  return images.length ? images : [{ id: 'placeholder', url: '/images/placeholder.png' }]
})

const breadcrumbs = computed(() => [
  { text: 'Home', to: '/' },
  { text: 'Items', to: '/items' },
  { text: item.value?.title || 'Loading...', to: '' }
])

const hasPrices = computed(() => {
  return item.value?.variants.some(v => v.prices && v.prices.length > 0) || !!stockxData.value
})

const allPrices = computed(() => {
  if (!item.value) return []
  
  const prices: Array<{ price: number; platform: string }> = []
  
  // Collect database prices
  item.value.variants.forEach(variant => {
    variant.prices?.forEach(price => {
      prices.push({ 
        price: price.price_usd, 
        platform: price.platform 
      })
    })
  })
  
  // Add StockX prices
  if (stockxData.value?.lowestAsk?.price) {
    prices.push({ 
      price: stockxData.value.lowestAsk.price, 
      platform: 'stockx' 
    })
  }
  
  return prices
})

const bestPrice = computed(() => {
  if (allPrices.value.length === 0) return null
  return allPrices.value.reduce((best, current) => 
    current.price < best.price ? current : best
  )
})

const priceSummary = computed(() => {
  const prices = allPrices.value
  if (prices.length === 0) return null
  
  const values = prices.map(p => p.price)
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length
  }
})

const lastPriceUpdate = computed(() => {
  // Get most recent price update time
  const times: Date[] = []
  
  item.value?.variants.forEach(variant => {
    variant.prices?.forEach(price => {
      if (price.captured_at) {
        times.push(new Date(price.captured_at))
      }
    })
  })
  
  return times.length > 0 
    ? Math.max(...times.map(t => t.getTime()))
    : null
})

// Methods
const handleVariantSelect = (variant: Variant) => {
  selectedVariant.value = variant
  trackEvent('variant_selected', {
    item_id: item.value?.id,
    variant_id: variant.id,
    size: variant.size,
    color: variant.color
  })
}

const handleShare = async () => {
  if (!item.value) return
  
  try {
    await navigator.share({
      title: item.value.title,
      text: `Check out ${item.value.title} on Supreme Price Tracker`,
      url: window.location.href
    })
    
    trackEvent('item_shared', {
      item_id: item.value.id,
      method: 'native_share'
    })
  } catch (error) {
    // Fallback to clipboard
    await navigator.clipboard.writeText(window.location.href)
    showNotification({
      type: 'success',
      message: 'Link copied to clipboard!'
    })
    
    trackEvent('item_shared', {
      item_id: item.value.id,
      method: 'clipboard'
    })
  }
}

const handleFavorite = () => {
  if (!item.value) return
  
  const favorited = isFavorite(item.value.id)
  
  if (favorited) {
    removeFavorite(item.value.id)
    showNotification({
      type: 'info',
      message: 'Removed from favorites'
    })
  } else {
    addFavorite(item.value)
    showNotification({
      type: 'success',
      message: 'Added to favorites!'
    })
  }
  
  trackEvent(favorited ? 'item_unfavorited' : 'item_favorited', {
    item_id: item.value.id
  })
}

const handleSetAlert = () => {
  router.push({
    path: '/alerts/create',
    query: {
      item_id: item.value?.id,
      variant_id: selectedVariant.value?.id
    }
  })
}

const handleViewHistory = () => {
  router.push({
    path: `/items/${item.value?.id}/prices`,
    query: selectedVariant.value ? { variantId: selectedVariant.value.id } : {}
  })
}

// Initialize
onMounted(() => {
  if (item.value) {
    // Select first variant by default
    if (item.value.variants.length > 0 && !selectedVariant.value) {
      const firstVariant = item.value.variants[0]
      if (firstVariant) {
        selectedVariant.value = firstVariant
      }
    }
    
    // Track page view
    trackEvent('item_detail_viewed', {
      item_id: item.value.id,
      item_title: item.value.title,
      has_prices: hasPrices.value,
      variant_count: item.value.variants.length
    })
  }
})

// SEO
useHead({
  title: computed(() => item.value?.title || 'Loading...'),
  meta: computed(() => [
    {
      name: 'description',
      content: item.value 
        ? `${item.value.title} - Track prices across StockX, GOAT, and Grailed. ${item.value.season || ''}`
        : 'Loading item details...'
    },
    {
      property: 'og:title',
      content: item.value?.title || 'Supreme Item'
    },
    {
      property: 'og:description',
      content: item.value 
        ? `Track ${item.value.title} prices in real-time`
        : 'Real-time price tracking'
    },
    {
      property: 'og:image',
      content: itemImages.value[0]?.url || '/og-image.png'
    },
    {
      property: 'product:price:amount',
      content: bestPrice.value?.price.toString() || ''
    },
    {
      property: 'product:price:currency',
      content: 'USD'
    }
  ])
})
</script>

<style scoped>
.item-detail-page {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}
</style> 