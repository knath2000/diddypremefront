<template>
  <div class="relative inline-flex items-center justify-center">
    <svg :width="size" :height="size" class="transform -rotate-90">
      <circle
        :r="radius"
        :cx="center"
        :cy="center"
        stroke="rgba(255,255,255,0.2)"
        stroke-width="6"
        fill="transparent"
      />
      <circle
        :r="radius"
        :cx="center"
        :cy="center"
        stroke="url(#grad)"
        stroke-width="6"
        stroke-dasharray="{circumference}"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        fill="transparent"
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
    <span class="absolute text-sm text-white font-semibold">{{ percent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  percent: number
  size?: number
}
const props = withDefaults(defineProps<Props>(), {
  size: 64,
})

const radius = computed(() => props.size / 2 - 6)
const center = computed(() => props.size / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - props.percent / 100))
</script> 