import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    xp: 0,
    level: 1,
    achievements: [] as string[],
    levelJustIncreased: false,
  }),
  getters: {
    nextLevelXp: (state) => state.level * 100,
    xpProgressPct: (state): number => (state.xp / (state.level * 100)) * 100,
  },
  actions: {
    addXp(amount: number) {
      this.xp += amount
      // Level up logic
      while (this.xp >= this.nextLevelXp) {
        const requiredXp = this.nextLevelXp
        this.xp -= requiredXp
        this.level++
        this.levelJustIncreased = true
        this.$notifyLevelUp()
      }
    },
    clearLevelFlag() {
      this.levelJustIncreased = false
    },
    unlockAchievement(title: string) {
      if (!this.achievements.includes(title)) {
        this.achievements.push(title)
      }
    },
    $notifyLevelUp() {
      // Emit event for components or trigger confetti
      if (process.client) {
        // Lazy import confetti to avoid SSR issues
        import('canvas-confetti').then((module) => {
          const confetti = module.default
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          })
        })
      }
    },
  },
}) 