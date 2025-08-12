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
.trend-indicator { display: inline-flex; align-items: center; gap: 0.125rem; }

.trend-indicator--sm { font-size: 0.75rem; }

.trend-indicator--md { font-size: 0.875rem; }

.trend-indicator--lg { font-size: 1rem; }

.trend-arrow { transition: color 200ms ease; }

.trend-arrow--up { color: #34d399; }

.trend-arrow--down { color: #fb7185; }

.trend-arrow--neutral { color: #9ca3af; }

/* Size variants for arrows */
.trend-indicator--sm .trend-arrow { height: 0.75rem; width: 0.75rem; }

.trend-indicator--md .trend-arrow { height: 1rem; width: 1rem; }

.trend-indicator--lg .trend-arrow { height: 1.25rem; width: 1.25rem; }

.trend-percentage { font-weight: 500; }
</style>