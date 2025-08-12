<template>
  <div
    v-motion
    :initial="motionInitial"
    :enter="motionEnter"
    :class="bubbleClasses"
    :aria-label="ariaLabel"
    role="status"
  >
    <!-- Platform badge -->
    <img
      v-if="platformIcon"
      :src="platformIcon"
      :alt="`${platform} logo`"
      class="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-white p-0.5 shadow"
      loading="lazy"
    />

    <!-- Price text -->
    <span class="font-semibold text-white">
      {{ formattedPrice }}
    </span>

    <!-- Trend arrow -->
    <TrendIndicator 
      v-if="showTrend"
      :trend="trend"
      :percentage="trendPercentage"
      size="sm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMotion } from '@vueuse/motion'
import type { Platform, PriceSize, PriceTrend } from '~/types/price'

// Sub-component for trend indicator
import TrendIndicator from './TrendIndicator.vue'

interface PriceBubbleProps {
  price: number
  previousPrice?: number
  platform: Platform
  size?: PriceSize
  animated?: boolean
  showTrend?: boolean
  currency?: string
  locale?: string
}

const props = withDefaults(defineProps<PriceBubbleProps>(), {
  size: 'md',
  animated: false,
  showTrend: true,
  currency: 'USD',
  locale: 'en-US'
})

// Composables
const { formatPrice } = usePriceFormatter()
const { getPlatformIcon, getPlatformColor } = usePlatformConfig()

// Computed properties
const formattedPrice = computed(() => 
  formatPrice(props.price, {
    currency: props.currency,
    locale: props.locale
  })
)

const trend = computed<PriceTrend | null>(() => {
  if (props.previousPrice === undefined) return null
  if (props.price === props.previousPrice) return 'neutral'
  return props.price > props.previousPrice ? 'up' : 'down'
})

const trendPercentage = computed(() => {
  if (!props.previousPrice || props.previousPrice === 0) return 0
  return ((props.price - props.previousPrice) / props.previousPrice) * 100
})

const platformIcon = computed(() => getPlatformIcon(props.platform))

const bubbleClasses = computed(() => [
  'price-bubble',
  `price-bubble--${props.size}`,
  `price-bubble--${props.platform}`,
  {
    [`price-bubble--${trend.value}`]: trend.value,
    'price-bubble--animated': props.animated
  }
])

const ariaLabel = computed(() => {
  let label = `${props.platform} price: ${formattedPrice.value}`
  if (trend.value && props.showTrend) {
    const direction = trend.value === 'up' ? 'increased' : 'decreased'
    label += `, ${direction} by ${Math.abs(trendPercentage.value).toFixed(1)}%`
  }
  return label
})

// Motion configuration
const motionInitial = computed(() => 
  props.animated ? { scale: 0, opacity: 0 } : null
)

const motionEnter = computed(() => 
  props.animated ? {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 12
    }
  } : null
)
</script>

<style scoped>
.price-bubble {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  user-select: none;
  cursor: default;
  background: rgba(17, 24, 39, 0.35);
  transition: all 200ms ease;
}

/* Size variants */
.price-bubble--sm {
  height: 2rem;            /* h-8 */
  padding-left: 0.75rem;   /* px-3 */
  padding-right: 0.75rem;
  font-size: 0.75rem;      /* text-xs */
  gap: 0.25rem;            /* gap-1 */
}

.price-bubble--md {
  height: 2.5rem;          /* h-10 */
  padding-left: 1rem;      /* px-4 */
  padding-right: 1rem;
  font-size: 0.875rem;     /* text-sm */
  gap: 0.375rem;           /* gap-1.5 */
}

.price-bubble--lg {
  height: 3.5rem;          /* h-14 */
  padding-left: 1.5rem;    /* px-6 */
  padding-right: 1.5rem;
  font-size: 1.125rem;     /* text-lg */
  gap: 0.5rem;             /* gap-2 */
}

/* Platform variants (outline to emulate ring) */
.price-bubble--stockx { outline: 1px solid rgba(74, 222, 128, 0.4); }   /* green-400/40 */
.price-bubble--goat   { outline: 1px solid rgba(96, 165, 250, 0.4); }   /* blue-400/40 */
.price-bubble--grailed{ outline: 1px solid rgba(168, 85, 247, 0.4); }   /* purple-400/40 */

/* Trend variants */
.price-bubble--up      { outline: 2px solid rgba(52, 211, 153, 0.4); }   /* emerald-400/40 */
.price-bubble--down    { outline: 2px solid rgba(251, 113, 133, 0.4); }  /* rose-400/40 */
.price-bubble--neutral { outline: 1px solid rgba(156, 163, 175, 0.4); }  /* gray-400/40 */

/* Hover effects */
.price-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
}

/* Animation */
.price-bubble--animated {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style> 