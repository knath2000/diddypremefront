import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Auto register glass UI primitives
  const components = {
    ...import.meta.glob('../components/ui/*.vue', { eager: true }),
    ...import.meta.glob('../components/gamification/*.vue', { eager: true })
  }

  Object.entries(components).forEach(([path, definition]: any) => {
    const name = path.split('/').pop()?.replace('.vue', '') || ''
    nuxtApp.vueApp.component(name, (definition as any).default)
  })
}) 