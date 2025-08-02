<template>
  <div class="trend-indicator" :class="`trend-indicator--${size}`">
    <svg
      :class="['trend-arrow', `trend-arrow--${trend}`]"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        v-if="trend === 'up'"
        fill-rule="evenodd"
        d="M5 10l5-5 5 5H9v5H7v-5H5z"
        clip-rule="evenodd"
      />
      <path
        v-else-if="trend === 'down'"
        fill-rule="evenodd"
        d="M15 10l-5 5-5-5h6V5h2v5h2z"
        clip-rule="evenodd"
      />
      <path
        v-else
        d="M4 10h12"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
    </svg>
    <span v-if="showPercentage && percentage !== 0" class="trend-percentage">
      {{ formattedPercentage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PriceTrend, PriceSize } from '~/types/price'

interface Props {
  trend: PriceTrend | null
  percentage?: number
  size?: PriceSize
  showPercentage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0,
  size: 'md',
  showPercentage: true
})

const formattedPercentage = computed(() => {
  const abs = Math.abs(props.percentage)
  return `${abs.toFixed(1)}%`
})
</script>

<style scoped>
.trend-indicator {
  @apply inline-flex items-center gap-0.5;
}

.trend-indicator--sm {
  @apply text-xs;
}

.trend-indicator--md {
  @apply text-sm;
}

.trend-indicator--lg {
  @apply text-base;
}

.trend-arrow {
  @apply transition-colors duration-200;
}

.trend-arrow--up {
  @apply text-emerald-400;
}

.trend-arrow--down {
  @apply text-rose-400;
}

.trend-arrow--neutral {
  @apply text-gray-400;
}

/* Size variants for arrows */
.trend-indicator--sm .trend-arrow {
  @apply h-3 w-3;
}

.trend-indicator--md .trend-arrow {
  @apply h-4 w-4;
}

.trend-indicator--lg .trend-arrow {
  @apply h-5 w-5;
}

.trend-percentage {
  @apply font-medium;
}
</style>