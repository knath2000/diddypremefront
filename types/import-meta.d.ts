/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly NUXT_PUBLIC_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob<T = { default: any }>(
    pattern: string,
    options?: {
      eager?: boolean
      import?: string
      query?: string | Record<string, string>
      exhaustive?: boolean
    }
  ): Record<string, T | (() => Promise<T>)>
}