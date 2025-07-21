<template>
  <div
    :class="[
      'relative flex flex-col items-center justify-center p-4 rounded-xl transition transform hover:scale-105',
      unlocked ? 'opacity-100' : 'opacity-30 grayscale',
      rare ? 'badge-rare' : 'bg-blur backdrop-blur-md'
    ]"
  >
    <!-- Icon slot or default trophy -->
    <slot>
      <svg class="h-10 w-10 text-yellow-400 drop-shadow" v-if="unlocked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v2a7 7 0 01-6 6.92V14h3a1 1 0 110 2H9a1 1 0 110-2h3v-1.08A7 7 0 016 6V4z" />
      </svg>
    </slot>
    <p class="mt-2 text-center text-xs text-white whitespace-pre-line">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  unlocked?: boolean
  rare?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  unlocked: false,
  rare: false,
})
</script>

<style scoped>
.badge-rare {
  background: linear-gradient(135deg, rgba(255,0,200,0.4), rgba(0,200,255,0.4));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  animation: shimmer 2.5s infinite;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style> 