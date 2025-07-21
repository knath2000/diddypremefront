<template>
  <div
    v-motion
    :initial="animated ? { scale: 0, opacity: 0 } : null"
    :enter="animated ? { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 12 } } : null"
    :class="[
      'relative flex items-center justify-center rounded-full shadow-lg select-none cursor-default',
      sizeClass,
      trendColor,
      'bg-blur backdrop-blur-md'
    ]"
  >
    <!-- Platform badge -->
    <img
      v-if="platformIcon"
      :src="platformIcon"
      :alt="platform"
      class="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-white p-0.5 shadow"
    />

    <!-- Price text -->
    <span class="font-semibold text-white">
      ${{ price.toLocaleString() }}
    </span>

    <!-- Trend arrow -->
    <svg
      v-if="previousPrice !== undefined"
      :class="['h-3 w-3 ml-1', trend === 'up' ? 'text-emerald-400' : 'text-rose-400']"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        v-if="trend === 'up'"
        fill-rule="evenodd"
        d="M5 10l5-5 5 5H9v5H7v-5H5z"
        clip-rule="evenodd"
      />
      <path
        v-else
        fill-rule="evenodd"
        d="M15 10l-5 5-5-5h6V5h2v5h2z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMotion } from '@vueuse/motion'

interface PriceBubbleProps {
  price: number
  previousPrice?: number
  platform: 'stockx' | 'goat' | 'grailed'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<PriceBubbleProps>(), {
  size: 'md',
  animated: false,
})

const trend = computed(() => {
  if (props.previousPrice === undefined) return undefined
  return props.price >= props.previousPrice ? 'up' : 'down'
})

const trendColor = computed(() => {
  if (!trend.value) return ''
  return trend.value === 'up' ? 'ring-2 ring-emerald-400/40' : 'ring-2 ring-rose-400/40'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs'
    case 'lg':
      return 'h-14 px-6 text-lg'
    default:
      return 'h-10 px-4 text-sm'
  }
})

const platformIcon = computed(() => {
  switch (props.platform) {
    case 'stockx':
      return '/icons/stockx.svg'
    case 'goat':
      return '/icons/goat.svg'
    case 'grailed':
      return '/icons/grailed.svg'
    default:
      return undefined
  }
})
</script> 