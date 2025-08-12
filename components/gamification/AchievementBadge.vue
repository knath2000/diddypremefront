<template>
  <div
    :class="[
      'achievement-badge',
      `achievement-badge--${size}`,
      {
        'achievement-badge--unlocked': unlocked,
        'achievement-badge--rare': rare,
        'achievement-badge--loading': loading
      }
    ]"
    :title="description || title"
  >
    <!-- Icon -->
    <div class="achievement-badge__icon">
      <component
        v-if="!loading && iconComponent"
        :is="iconComponent"
        class="w-full h-full"
      />
      <div
        v-else-if="loading"
        class="animate-pulse bg-gray-300 rounded-full w-10 h-10"
      />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-10 h-10 text-yellow-400"
      >
        <path
          d="M17 4H7a1 1 0 00-1 1v3a5 5 0 004 4.9V15H7a1 1 0 000 2h10a1 1 0 000-2h-3v-2.1A5 5 0 0018 8V5a1 1 0 00-1-1z"
        />
      </svg>
    </div>

    <!-- Title -->
    <p class="achievement-badge__title">{{ title }}</p>

    <!-- Progress Bar -->
    <div
      v-if="showProgress && progress < 100"
      class="achievement-badge__progress"
    >
      <div
        class="achievement-badge__progress-bar"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

interface Props {
  title: string
  description?: string
  unlocked?: boolean
  rare?: boolean
  icon?: string
  progress?: number
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unlocked: false,
  rare: false,
  progress: 0,
  showProgress: false,
  size: 'md',
  loading: false
})

const iconComponent = computed(() => {
  if (!props.icon) return null
  // Lazy import to reduce bundle size
  return defineAsyncComponent(() =>
    import(`~/components/icons/${props.icon}.vue`).catch(() => null)
  )
})
</script>

<style scoped>
.achievement-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: transform 300ms ease-out;
  padding: 1rem;
  user-select: none;
  background: rgba(17, 24, 39, 0.35);
}

.achievement-badge--loading {
  @apply opacity-50 pointer-events-none;
}

.achievement-badge--unlocked {
  @apply opacity-100 grayscale-0;
}

.achievement-badge--rare {
  background: linear-gradient(135deg, rgba(255,0,200,0.4), rgba(0,200,255,0.4));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  animation: shimmer 2.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.achievement-badge--sm {
  @apply w-16 h-20 text-xs;
}

.achievement-badge--md {
  @apply w-20 h-24 text-sm;
}

.achievement-badge--lg {
  @apply w-24 h-28 text-base;
}

.achievement-badge__icon {
  @apply flex items-center justify-center w-10 h-10;
}

.achievement-badge__title {
  @apply mt-2 text-center text-white whitespace-pre-line leading-tight;
}

.achievement-badge__progress {
  @apply w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1;
}

.achievement-badge__progress-bar {
  @apply h-full bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full transition-all duration-500;
}
</style> 