import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock ref function for tests
const mockRef = (value: any) => ({ value })

// Add to global for tests
;(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiBase: 'http://localhost:8080',
    vercelEnv: 'test'
  }
})

;(globalThis as any).useFetch = vi.fn(() => ({
  data: mockRef(null),
  pending: mockRef(false),
  refresh: vi.fn(),
  error: mockRef(null)
}))

;(globalThis as any).useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  currentRoute: { value: { path: '/' } }
})

;(globalThis as any).useRoute = () => ({
  params: {},
  query: {},
  path: '/'
})

// Configure Vue Test Utils
config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>'
  },
  NuxtPage: {
    template: '<div><slot /></div>'
  },
  ClientOnly: {
    template: '<div><slot /></div>'
  },
  Teleport: {
    template: '<div><slot /></div>'
  }
}