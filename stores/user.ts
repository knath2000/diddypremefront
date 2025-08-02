import { defineStore } from 'pinia'
import { reactive, computed, watch, onMounted, toRefs } from 'vue'

interface Achievement {
  id: string
  unlockedAt: Date
  progress: number // 0–100
}

interface UserState {
  xp: number
  level: number
  achievements: Achievement[]
  levelJustIncreased: boolean
  settings: {
    enableAnimations: boolean
    enableNotifications: boolean
  }
}

export const useUserStore = defineStore('user', () => {
  // -------------------- state -------------------- //
  const state = reactive<UserState>({
    xp: 0,
    level: 1,
    achievements: [],
    levelJustIncreased: false,
    settings: {
      enableAnimations: true,
      enableNotifications: true
    }
  })

  // ------------------ computed ------------------- //
  const nextLevelXp = computed(() => calculateXpForLevel(state.level + 1))
  const currentLevelXp = computed(() => calculateXpForLevel(state.level))
  const xpProgressPct = computed(() => {
    const current = state.xp - currentLevelXp.value
    const required = nextLevelXp.value - currentLevelXp.value
    return Math.min(100, (current / required) * 100)
  })

  // ------------------- actions ------------------- //
  const addXp = (amount: number) => {
    if (amount <= 0) return

    state.xp += amount

    while (state.xp >= nextLevelXp.value) {
      state.level += 1
      state.levelJustIncreased = true

      // Notify outside world – let a plugin / component listen
      if (process.client) {
        window.dispatchEvent(
          new CustomEvent('user:levelup', { detail: { level: state.level } })
        )
      }
    }
  }

  const clearLevelFlag = () => {
    state.levelJustIncreased = false
  }

  const unlockAchievement = (id: string, progress = 100) => {
    const existing = state.achievements.find((a) => a.id === id)

    if (existing) {
      existing.progress = Math.min(100, progress)
    } else {
      state.achievements.push({
        id,
        unlockedAt: new Date(),
        progress: Math.min(100, progress)
      })
    }
  }

  const hasAchievement = (id: string) => {
    return state.achievements.some((a) => a.id === id && a.progress === 100)
  }

  const getAchievementProgress = (id: string) => {
    return state.achievements.find((a) => a.id === id)?.progress || 0
  }

  // ----------------- persistence ----------------- //
  const hydrate = () => {
    if (process.client) {
      const saved = localStorage.getItem('user-store')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          Object.assign(state, parsed)
        } catch (e) {
          console.error('Failed to hydrate user store:', e)
        }
      }
    }
  }

  const persist = () => {
    if (process.client) {
      localStorage.setItem('user-store', JSON.stringify(state))
    }
  }

  // Hydrate on mount
  onMounted(hydrate)

  // Auto-persist
  watch(state, persist, { deep: true })

  return {
    ...toRefs(state),
    nextLevelXp,
    xpProgressPct,
    addXp,
    clearLevelFlag,
    unlockAchievement,
    hasAchievement,
    getAchievementProgress
  }
})

function calculateXpForLevel(level: number): number {
  // Exponential formula gives increasing XP requirement per level
  return Math.floor(100 * Math.pow(1.5, level - 1))
} 