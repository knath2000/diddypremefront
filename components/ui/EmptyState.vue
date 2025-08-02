<template>
  <div class="empty-state text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
      <slot name="icon">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {{ description }}
    </p>
    
    <div v-if="showAction" class="flex justify-center">
      <NuxtLink
        v-if="actionLink"
        :to="actionLink"
        class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
      >
        {{ actionText }}
      </NuxtLink>
      
      <button
        v-else
        @click="$emit('action')"
        class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
      >
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  showAction?: boolean
  actionText?: string
  actionLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  showAction: false,
  actionText: 'Take Action'
})

const emit = defineEmits<{
  action: []
}>()
</script>