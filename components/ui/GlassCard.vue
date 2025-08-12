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
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: var(--glass-white);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card--interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
}
</style> 