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
  @apply h-8 px-3 text-xs gap-1;
}

.price-bubble--md {
  @apply h-10 px-4 text-sm gap-1.5;
}

.price-bubble--lg {
  @apply h-14 px-6 text-lg gap-2;
}

/* Platform variants */
.price-bubble--stockx {
  @apply ring-1 ring-green-400/40;
}

.price-bubble--goat {
  @apply ring-1 ring-blue-400/40;
}

.price-bubble--grailed {
  @apply ring-1 ring-purple-400/40;
}

/* Trend variants */
.price-bubble--up {
  @apply ring-2 ring-emerald-400/40;
}

.price-bubble--down {
  @apply ring-2 ring-rose-400/40;
}

.price-bubble--neutral {
  @apply ring-1 ring-gray-400/40;
}

/* Hover effects */
.price-bubble:hover {
  @apply scale-105 shadow-xl;
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