<template>
  <GlassCard
    class="w-full text-center py-6 animate-float"
    role="region"
    :aria-label="`${title}: ${formattedValue}`"
  >
    <div class="text-3xl lg:text-4xl font-bold text-white mb-1">
      {{ formattedValue }}
    </div>
    <div class="text-sm lg:text-base text-gray-200 opacity-80">
      {{ title }}
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  format?: 'number' | 'currency' | 'percent'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    switch (props.format) {
      case 'currency':
        return `$${props.value.toLocaleString()}`
      case 'percent':
        return `${props.value}%`
      default:
        return props.value.toLocaleString()
    }
  }
  return props.value
})
</script> 