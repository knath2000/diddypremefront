import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Use lazy loading instead of eager
  const componentModules = {
    // UI Components
    ...import.meta.glob<{ default: Component }>('../components/ui/*.vue'),
    // Gamification Components  
    ...import.meta.glob<{ default: Component }>('../components/gamification/*.vue'),
    // Price Components
    ...import.meta.glob<{ default: Component }>('../components/price/*.vue'),
  }

  // Register components with proper typing
  Object.entries(componentModules).forEach(([path, importFn]) => {
    const name = path.split('/').pop()?.replace('.vue', '')
    
    if (!name) {
      console.warn(`Failed to extract component name from path: ${path}`)
      return
    }

    // Lazy load components
    nuxtApp.vueApp.component(name, defineAsyncComponent(importFn as any))
  })

  // Optional: Add development-only validation
  if (process.dev) {
    nuxtApp.hook('app:mounted', () => {
      console.log('Registered global components:', Object.keys(componentModules))
    })
  }
}) 