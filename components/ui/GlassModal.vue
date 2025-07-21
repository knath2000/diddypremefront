<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <!-- Modal Content -->
      <div class="relative z-10 w-full max-w-lg p-6 glass-card">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 