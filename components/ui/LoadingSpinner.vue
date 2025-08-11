<template>
  <div class="loading-spinner" :class="`loading-spinner--${size}`">
    <div class="spinner" :style="{ borderTopColor: color }" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'var(--color-supreme-red)'
})
</script>

<style scoped>
.loading-spinner {
  @apply inline-flex items-center justify-center;
}

.spinner {
  @apply border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin;
  border-top-color: var(--color-supreme-red);
}

/* Size variants */
.loading-spinner--sm .spinner {
  @apply w-6 h-6;
}

.loading-spinner--md .spinner {
  @apply w-10 h-10;
}

.loading-spinner--lg .spinner {
  @apply w-16 h-16;
}
</style>