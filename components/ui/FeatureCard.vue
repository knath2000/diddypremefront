<template>
  <GlassCard :class="['lg-edge glass-sheen', 'border', `border-${color}-500`]">
    <div class="flex items-start space-x-3">
      <div v-if="icon" class="text-3xl">
        {{ icon }}
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white mb-1">{{ title }}</h3>
        <p class="text-gray-300 mb-2">{{ description }}</p>
        <ul class="text-sm text-gray-400 space-y-1">
          <li v-for="item in benefits" :key="item">✓ {{ item }}</li>
        </ul>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from '~/components/ui/GlassCard.vue'

interface Props {
  title: string
  description: string
  benefits: string[]
  icon?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'red'
})
</script>