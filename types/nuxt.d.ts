/// <reference types="nuxt" />

// Extend Nuxt's auto-imports
declare module '#app' {
  interface NuxtApp {
    $api: any // You can define your API interface here
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: any
  }
}

// Global composables
declare global {
  // Nuxt composables
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig']
  const defineNuxtConfig: typeof import('nuxt/config')['defineNuxtConfig']
  const defineNuxtPlugin: typeof import('#app')['defineNuxtPlugin']
  const definePageMeta: typeof import('#app')['definePageMeta']
  const defineRouteRules: typeof import('#app')['defineRouteRules']
  const useAsyncData: typeof import('#app')['useAsyncData']
  const useLazyAsyncData: typeof import('#app')['useLazyAsyncData']
  const useFetch: typeof import('#app')['useFetch']
  const useLazyFetch: typeof import('#app')['useLazyFetch']
  const useError: typeof import('#app')['useError']
  const useState: typeof import('#app')['useState']
  const useCookie: typeof import('#app')['useCookie']
  const useRequestHeaders: typeof import('#app')['useRequestHeaders']
  const useRequestEvent: typeof import('#app')['useRequestEvent']
  const useRouter: typeof import('#app')['useRouter']
  const useRoute: typeof import('#app')['useRoute']
  const useActiveRoute: typeof import('#app')['useActiveRoute']
  const navigateTo: typeof import('#app')['navigateTo']
  const abortNavigation: typeof import('#app')['abortNavigation']
  const setPageLayout: typeof import('#app')['setPageLayout']
  const setResponseStatus: typeof import('#app')['setResponseStatus']
  const useHead: typeof import('#app')['useHead']
  const useSeoMeta: typeof import('#app')['useSeoMeta']
  const useServerSeoMeta: typeof import('#app')['useServerSeoMeta']
  const createError: typeof import('#app')['createError']
  const showError: typeof import('#app')['showError']
  const clearError: typeof import('#app')['clearError']
  const isNuxtError: typeof import('#app')['isNuxtError']
  const useNuxtApp: typeof import('#app')['useNuxtApp']
  const useNuxtData: typeof import('#app')['useNuxtData']
  const refreshNuxtData: typeof import('#app')['refreshNuxtData']
  const clearNuxtData: typeof import('#app')['clearNuxtData']
  const preloadComponents: typeof import('#app')['preloadComponents']
  const prefetchComponents: typeof import('#app')['prefetchComponents']
  const loadPayload: typeof import('#app')['loadPayload']
  const preloadPayload: typeof import('#app')['preloadPayload']
  const isPrerendered: typeof import('#app')['isPrerendered']
  const defineNuxtComponent: typeof import('#app')['defineNuxtComponent']
  const useHydration: typeof import('#app')['useHydration']
  const callOnce: typeof import('#app')['callOnce']
  
  // Vue lifecycle hooks
  const onMounted: typeof import('vue')['onMounted']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onUpdated: typeof import('vue')['onUpdated']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onActivated: typeof import('vue')['onActivated']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  
  // Custom composables
  const useAuth: typeof import('~/composables/useAuth')['useAuth']
  const useAnalytics: typeof import('~/composables/useAnalytics')['useAnalytics']
  const useNotifications: typeof import('~/composables/useNotifications')['useNotifications']
  const useFavorites: typeof import('~/composables/useFavorites')['useFavorites']
  const usePriceFormatter: typeof import('~/composables/usePriceFormatter')['usePriceFormatter']
  const usePlatformConfig: typeof import('~/composables/usePlatformConfig')['usePlatformConfig']
}

export {}