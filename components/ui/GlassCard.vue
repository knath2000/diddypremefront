<template>
  <div class="glass-card bg-blur p-6 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
    <slot />
  </div>
</template>

<script setup lang="ts">
// A lightweight wrapper component for glassmorphic containers.
</script>

<style scoped>
.glass-card {
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
}
</style> 