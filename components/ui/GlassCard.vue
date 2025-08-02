<template>
  <component
    :is="tag"
    class="glass-card"
    :class="[sizeClass, { 'glass-card--interactive': interactive }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  tag?: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  size: 'md',
  interactive: true
})

const sizeClass = computed(() => {
  return {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[props.size]
})
</script>

<style scoped>
.glass-card {
  @apply rounded-2xl border border-white/20 backdrop-blur-md shadow-xl;
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card--interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
}
</style> 