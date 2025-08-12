<template>
  <component
    :is="tag"
    class="glass-card lg-surface lg-elevation-2 lg-edge"
    :class="[sizeClass, { 'lg-pressable': interactive }]"
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 