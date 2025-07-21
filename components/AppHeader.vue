<template>
  <header class="bg-blur backdrop-blur-md shadow-lg border-b border-white/10 dark:border-white/10">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="font-bold text-xl text-gray-900 dark:text-white">
              Supreme Tracker
            </span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink 
            to="/" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-red-600 dark:text-red-400 font-medium"
          >
            Browse
          </NuxtLink>
          <NuxtLink 
            to="/trending" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-red-600 dark:text-red-400 font-medium"
          >
            Trending
          </NuxtLink>
          <NuxtLink 
            to="/alerts" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-red-600 dark:text-red-400 font-medium"
          >
            Alerts
          </NuxtLink>
        </nav>

        <!-- Search Bar -->
        <div class="hidden lg:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search Supreme items..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              @keyup.enter="handleSearch"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- XP Counter -->
        <GlassButton
          class="hidden md:inline-flex bg-blur shadow-inner px-4 py-2 mr-4 cursor-pointer animate-glow-pulse"
          @click="user.addXp(10)"
        >
          💎 {{ user.xp }} XP
        </GlassButton>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Toggle dark mode"
          >
            <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Account Button -->
          <button 
            @click="handleAccountClick" 
            class="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            Account
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-500 dark:text-gray-400"
            aria-label="Toggle mobile menu"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
        <!-- Mobile Search -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Supreme items..."
            class="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @keyup.enter="handleSearch"
          >
        </div>

        <!-- Mobile Navigation -->
        <nav class="space-y-2">
          <NuxtLink 
            to="/" 
            class="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            Browse
          </NuxtLink>
          <NuxtLink 
            to="/trending" 
            class="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            Trending
          </NuxtLink>
          <NuxtLink 
            to="/alerts" 
            class="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            @click="mobileMenuOpen = false"
          >
            Alerts
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
const router = useRouter()

// Reactive state
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const isDark = ref(false)
// User store for XP/levels
const user = useUserStore()

// Initialize dark mode state from localStorage on client side
onMounted(() => {
  if (process.client) {
    isDark.value = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    updateDarkMode()
  }
})

// Toggle dark mode
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  updateDarkMode()
  if (process.client) {
    localStorage.setItem('darkMode', isDark.value.toString())
  }
}

// Update DOM dark mode class
const updateDarkMode = () => {
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    mobileMenuOpen.value = false
  }
}

// Handle account click
const handleAccountClick = () => {
  // TODO: Implement authentication or account management
  router.push('/account')
}

// Close mobile menu on route change
watch(() => router.currentRoute.value.path, () => {
  mobileMenuOpen.value = false
})
</script> 