<template>
  <div class="error-state text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
      <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {{ description }}
    </p>
    
    <div class="flex justify-center gap-4">
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        Try Again
      </button>
      
      <NuxtLink
        v-if="showHome"
        to="/"
        class="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        Go Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: any
  title?: string
  description?: string
  showRetry?: boolean
  showHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  description: 'An error occurred while loading the data. Please try again.',
  showRetry: true,
  showHome: true
})

const emit = defineEmits<{
  retry: []
}>()

// Log error for debugging
if (props.error) {
  console.error('ErrorState:', props.error)
}
</script>