import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent, type Component } from 'vue'

// Utility to convert file path to PascalCase component name
function pathToName(path: string) {
  const file = path.split('/').pop() || ''
  return file.replace('.vue', '')
}

export default defineNuxtPlugin((nuxtApp) => {
  const componentModules = {
    ...import.meta.glob<{ default: Component }>('../components/ui/*.vue'),
    ...import.meta.glob<{ default: Component }>(
      '../components/gamification/*.vue'
    ),
    ...import.meta.glob<{ default: Component }>('../components/price/*.vue')
  }

  Object.entries(componentModules).forEach(([path, importFn]) => {
    const name = pathToName(path)
    if (!name) return

    // Register as async component for lazy loading
    nuxtApp.vueApp.component(name, defineAsyncComponent(importFn))
  })

  if (process.dev) {
    nuxtApp.hook('app:mounted', () => {
      // eslint-disable-next-line no-console
      console.log('Registered global components:', Object.keys(componentModules).map(pathToName))
    })
  }
}) 