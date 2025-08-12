<template>
  <GlassCard class="p-6">
    <h3 class="text-lg font-semibold mb-4 text-white">Achievements</h3>

    <div :class="['grid gap-4', gridClass]">
      <AchievementBadge
        v-for="badge in badgesWithStatus"
        :key="badge.id || badge.title"
        :title="badge.title"
        :description="badge.description"
        :unlocked="badge.unlocked"
        :rare="badge.rare"
        :icon="badge.icon"
        :progress="Number(badge.progress ?? 0)"
        :show-progress="true"
      />
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'

interface Badge {
  id?: string
  title: string
  description?: string
  icon?: string
  rare?: boolean
  category?: 'trading' | 'collection' | 'social' | 'special'
}

interface Props {
  badges: Badge[]
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 6
})

const user = useUserStore()

// Compute unlocked/progress using store helpers when available
const badgesWithStatus = computed(() => {
  return props.badges.map((badge) => {
    const id = badge.id || badge.title
    const unlocked = typeof user.hasAchievement === 'function'
      ? user.hasAchievement(id)
      : user.achievements?.includes?.(id)

    const progress = typeof user.getAchievementProgress === 'function'
      ? user.getAchievementProgress(id)
      : unlocked ? 100 : 0

    return {
      ...badge,
      unlocked,
      progress
    }
  })
})

// Clamp to max 6 cols to avoid overly wide grids
const gridClass = computed(() => {
  const cols = Math.min(props.columns, 6)
  return `grid-cols-${cols}`
})
</script> 