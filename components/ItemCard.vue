<template>
  <div 
    v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    class="lg-surface lg-elevation-2 lg-edge lg-pressable rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
  >
    <!-- Item Image -->
    <div class="aspect-square relative overflow-hidden">
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        :alt="item.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
        loading="lazy"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gray-500/10">
        📦
      </div>
      
      <!-- Gradient overlay for text protection -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      <!-- Best Price Bubble -->
      <PriceBubble
        v-if="bestPrice"
        :price="bestPrice.price"
        :platform="bestPrice.platform.toLowerCase()"
        size="sm"
        :animated="true"
        class="absolute top-3 right-3"
      />
    </div>

    <!-- Item Content -->
    <div class="p-4 relative">
      <!-- Item Name -->
      <h3 class="font-bold text-gray-900 dark:text-white mb-2 pr-10 line-clamp-2 leading-tight">
        {{ item.title }}
      </h3>
      
      <!-- Season Tag -->
      <p v-if="item.season" class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
        {{ item.season }}
      </p>

      <!-- Action Button -->
      <NuxtLink 
        :to="`/items/${item.id}`"
        class="absolute bottom-4 right-4 h-12 w-12 bg-supreme-red text-white rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PriceBubble from '~/components/price/PriceBubble.vue'

interface Price {
  platform: string
  price_usd: number
}

interface Variant {
  id: string
  size?: string
  prices?: Price[]
}

interface Item {
  id: string | number
  title: string
  image_url?: string
  imageUrl?: string
  images?: { url: string }[]
  season?: string
  variants?: Variant[]
}

const props = defineProps<{ item: Item }>()

const emit = defineEmits<{
  'set-alert': [item: Item]
  'view-details': [item: Item]
}>()

// Normalised image url
const imageUrl = computed(() => {
  return (
    props.item.image_url ||
    props.item.imageUrl ||
    props.item.images?.[0]?.url ||
    '/images/placeholder.png'
  )
})

// Flatten variant prices once
const allPrices = computed(() => {
  return props.item.variants?.flatMap(v => v.prices ?? []) ?? []
})

// Group by platform then find min price
const pricesByPlatform = computed(() => {
  const map: Record<string, number> = {}
  for (const p of allPrices.value) {
    if (p.price_usd == null) continue
    const existing = map[p.platform]
    map[p.platform] = existing != null ? Math.min(existing, p.price_usd) : p.price_usd
  }
  return map
})

const bestPrice = computed(() => {
  const entries = Object.entries(pricesByPlatform.value)
  if (!entries.length) return null
  return entries.reduce((min, curr) => (curr[1] < min[1] ? curr : min))
})

// Handlers
const handleSetAlert = () => emit('set-alert', props.item)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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