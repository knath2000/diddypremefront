<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Price Alerts
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Set intelligent price alerts and never miss a deal on your favorite Supreme items
        </p>
      </div>

      <!-- Coming Soon Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
        <div class="text-6xl mb-4">🔔</div>
        <h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
          Smart Alerts Coming Soon
        </h2>
        <p class="text-blue-700 dark:text-blue-300 mb-6">
          We're building an intelligent alert system that will notify you when prices hit your target ranges.
        </p>
        <div class="space-y-2 text-sm text-blue-600 dark:text-blue-400">
          <p v-for="item in bannerBenefits" :key="item">{{ item }}</p>
        </div>
      </div>

      <!-- Features Preview -->
      <div class="grid md:grid-cols-2 gap-8 mt-12">
        <FeatureCard
          v-for="feature in alertFeatures"
          :key="feature.title"
          v-bind="feature"
        />
      </div>

      <!-- Back to Browse -->
      <div class="text-center mt-8">
        <NuxtLink 
          to="/"
          class="inline-flex items-center px-6 py-3 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          ← Back to Browse
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '~/components/ui/FeatureCard.vue'

interface Feature {
  title: string
  description: string
  benefits: string[]
  icon?: string
  color?: string
}

const bannerBenefits = [
  '🎯 Custom price targets',
  '📱 Instant notifications',
  '📊 Historical price context',
  '🤖 AI-powered recommendations'
]

const alertFeatures: Feature[] = [
  {
    title: 'Price Drop Alerts',
    description: 'Get notified when items drop below your target price across all platforms.',
    benefits: [
      'Multi-platform monitoring',
      'Percentage-based thresholds',
      'Historical price context'
    ],
    icon: '📉',
    color: 'blue'
  },
  {
    title: 'Restock Notifications',
    description: 'Know immediately when sold-out items become available again.',
    benefits: [
      'Real-time availability tracking',
      'Size-specific alerts',
      'Platform preference settings'
    ],
    icon: '🔄',
    color: 'green'
  }
]

// Meta tags for SEO
useHead({
  title: 'Price Alerts - Supreme Price Tracker',
  meta: [
    {
      name: 'description',
      content: 'Set intelligent price alerts for Supreme items. Get notified when prices drop or items restock.'
    }
  ]
})
</script> 