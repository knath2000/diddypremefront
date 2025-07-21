<template>
  <div class="flex gap-2">
    <GlassButton
      v-for="option in options"
      :key="option.days"
      :class="selected === option.days ? 'ring-2 ring-accent-blue/60' : ''"
      @click="select(option.days)"
      size="sm"
    >
      {{ option.label }}
    </GlassButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['update:days'])
const options = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
]
const selected = ref(30)

function select(days: number) {
  selected.value = days
  emit('update:days', days)
}
</script> 