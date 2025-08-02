/// <reference types="nuxt" />

declare module '#app' {
  interface NuxtApp {
    $api: any // You can define your API interface here
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: any // You can define your API interface here
  }
}

// Declare global Nuxt composables
declare global {
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig']
  const defineNuxtConfig: typeof import('nuxt/config')['defineNuxtConfig']
  const useHead: typeof import('#app')['useHead']
  const useFetch: typeof import('#app')['useFetch']
  const useAsyncData: typeof import('#app')['useAsyncData']
  const useRouter: typeof import('#app')['useRouter']
  const useRoute: typeof import('#app')['useRoute']
  const useState: typeof import('#app')['useState']
  const useNuxtData: typeof import('#app')['useNuxtData']
  const useLazyFetch: typeof import('#app')['useLazyFetch']
  const useLazyAsyncData: typeof import('#app')['useLazyAsyncData']
  const definePageMeta: typeof import('#app')['definePageMeta']
  const navigateTo: typeof import('#app')['navigateTo']
  const abortNavigation: typeof import('#app')['abortNavigation']
  const defineNuxtPlugin: typeof import('#app')['defineNuxtPlugin']
  const defineNuxtRouteMiddleware: typeof import('#app')['defineNuxtRouteMiddleware']
  const setPageLayout: typeof import('#app')['setPageLayout']
  const defineNuxtComponent: typeof import('#app')['defineNuxtComponent']
  const useRequestHeaders: typeof import('#app')['useRequestHeaders']
  const useRequestEvent: typeof import('#app')['useRequestEvent']
  const setResponseStatus: typeof import('#app')['setResponseStatus']
  const defineEventHandler: typeof import('h3')['defineEventHandler']
  const getCookie: typeof import('h3')['getCookie']
  const setCookie: typeof import('h3')['setCookie']
  const deleteCookie: typeof import('h3')['deleteCookie']
  const createError: typeof import('#app')['createError']
  const clearError: typeof import('#app')['clearError']
  const clearNuxtData: typeof import('#app')['clearNuxtData']
  const refreshNuxtData: typeof import('#app')['refreshNuxtData']
  const preloadComponents: typeof import('#app')['preloadComponents']
  const prefetchComponents: typeof import('#app')['prefetchComponents']
  const preloadRouteComponents: typeof import('#app')['preloadRouteComponents']
}

export {}