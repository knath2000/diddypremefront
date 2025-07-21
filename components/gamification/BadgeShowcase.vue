<template>
  <GlassCard class="p-6">
    <h3 class="text-lg font-semibold mb-4 text-white">Achievements</h3>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      <AchievementBadge
        v-for="badge in badges"
        :key="badge.title"
        :title="badge.title"
        :unlocked="badge.unlocked"
        :rare="badge.rare"
      />
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'

const props = defineProps<{ badges: { title: string; rare?: boolean }[] }>()
const user = useUserStore()

const augmented = computed(() =>
  props.badges.map((b) => ({ ...b, unlocked: user.achievements.includes(b.title) }))
)
const badges = augmented
</script> 