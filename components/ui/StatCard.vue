<template>
  <GlassCard class="w-full text-center py-6 animate-float">
    <div class="text-3xl lg:text-4xl font-bold text-white mb-1">{{ value }}</div>
    <div class="text-sm lg:text-base text-gray-200 opacity-80">{{ title }}</div>
  </GlassCard>
</template>
<script setup lang="ts">
defineProps<{ title: string; value: string | number }>()
</script> 