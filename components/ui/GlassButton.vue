<template>
  <button
    :class="[
      'glass-btn group relative inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold focus:outline-none',
      'lg-surface lg-elevation-2 lg-edge lg-pressable',
      variant === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'
    ]"
    @click="$emit('click')"
  >
    <span class="z-10"><slot /></span>
    <!-- Glow Layer -->
    <span class="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-60 blur-lg group-hover:opacity-100 transition-opacity" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ variant?: 'primary' | 'secondary' }>()
const variant = computed(() => props.variant ?? 'primary')
</script>

<style scoped>
.glass-btn {
  position: relative;
  overflow: hidden;
}
.glass-btn:hover {
  animation: glow-pulse 2s ease-in-out infinite alternate;
}
</style> 