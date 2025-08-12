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
.loading-spinner { display: inline-flex; align-items: center; justify-content: center; }

.spinner { border-width: 4px; border-style: solid; border-color: #e5e7eb; border-top-color: var(--color-supreme-red); border-radius: 9999px; animation: spin 1s linear infinite; }

/* Size variants */
.loading-spinner--sm .spinner {
  width: 1.5rem;  /* w-6 */
  height: 1.5rem; /* h-6 */
}

.loading-spinner--md .spinner {
  width: 2.5rem;  /* w-10 */
  height: 2.5rem; /* h-10 */
}

.loading-spinner--lg .spinner {
  width: 4rem;  /* w-16 */
  height: 4rem; /* h-16 */
}
</style>