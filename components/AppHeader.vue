<template>
  <header class="app-header" role="banner">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <Logo />

        <!-- Desktop Navigation -->
        <DesktopNav 
          :nav-items="navItems"
          :current-path="currentPath"
          class="hidden md:flex"
        />

        <!-- Search Bar -->
        <SearchBar 
          v-model="searchQuery"
          @search="handleSearch"
          class="hidden lg:flex flex-1 max-w-md mx-8"
        />

        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <!-- XP Counter -->
          <XPCounter 
            :xp="userXp"
            :level="userLevel"
            class="hidden md:flex"
            @click="handleXPClick"
          />

          <!-- Quick Actions -->
          <QuickActions 
            :is-dark="isDark"
            :is-authenticated="isAuthenticated"
            @toggle-dark="toggleDark"
            @account-click="handleAccountClick"
          />

          <!-- Mobile Menu Toggle -->
          <MobileMenuToggle 
            v-model="mobileMenuOpen"
            class="md:hidden"
          />
        </div>
      </div>

      <!-- Mobile Menu -->
      <MobileMenu 
        v-if="mobileMenuOpen"
        v-model:search-query="searchQuery"
        :nav-items="navItems"
        :current-path="currentPath"
        @search="handleSearch"
        @navigate="handleMobileNavigate"
      />
    </div>

    <!-- Progress Bar -->
    <NavigationProgress v-if="navigationLoading" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useEventListener } from '@vueuse/core'

// Components (commented out until created)
// import Logo from './header/Logo.vue'
// import DesktopNav from './header/DesktopNav.vue'
// import SearchBar from './header/SearchBar.vue'
// import XPCounter from './header/XPCounter.vue'
// import QuickActions from './header/QuickActions.vue'
// import MobileMenuToggle from './header/MobileMenuToggle.vue'
// import MobileMenu from './header/MobileMenu.vue'
// import NavigationProgress from './header/NavigationProgress.vue'

// Composables
const router = useRouter()
const route = useRoute()
const { user, isAuthenticated } = useAuth()
const { trackEvent } = useAnalytics()
const { showNotification } = useNotifications()

// Types
interface NavItem {
  path: string
  label: string
  icon?: string
  badge?: number | string
}

// State
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const navigationLoading = ref(false)

// Dark mode with VueUse
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})
const toggleDark = useToggle(isDark)

// User XP and level (safe access)
const userXp = computed(() => (user.value as any)?.xp || user.value?.gamification?.xp || 0)
const userLevel = computed(() => (user.value as any)?.level || user.value?.gamification?.level || 1)
const alertCount = computed(() => (user.value as any)?.alertCount || 0)

// Navigation items
const navItems = computed<NavItem[]>(() => [
  { 
    path: '/', 
    label: 'Browse', 
    icon: 'grid' 
  },
  { 
    path: '/trending', 
    label: 'Trending', 
    icon: 'trending',
    badge: 'NEW'
  },
  { 
    path: '/alerts', 
    label: 'Alerts', 
    icon: 'bell',
    badge: alertCount.value || undefined
  }
])

const currentPath = computed(() => route.path)

// Methods
const handleSearch = (query?: string) => {
  const searchTerm = query || searchQuery.value.trim()
  
  if (!searchTerm) {
    showNotification({
      type: 'warning',
      message: 'Please enter a search term'
    })
    return
  }
  
  // Track search
  trackEvent('search_performed', {
    query: searchTerm,
    source: 'header'
  })
  
  // Navigate to search results
  router.push({
    path: '/search',
    query: { q: searchTerm }
  })
  
  // Close mobile menu
  mobileMenuOpen.value = false
  
  // Clear search on navigation
  searchQuery.value = ''
}

const handleAccountClick = () => {
  if (isAuthenticated.value) {
    router.push('/account')
  } else {
    router.push('/auth/login')
  }
  
  trackEvent('account_clicked', {
    authenticated: isAuthenticated.value
  })
}

const handleXPClick = () => {
  // Easter egg: Add bonus XP
  if (user.value && typeof (user.value as any).addXp === 'function') {
    (user.value as any).addXp(10)
    showNotification({
      type: 'success',
      message: '+10 XP! Keep exploring!'
    })
    
    trackEvent('xp_easter_egg_triggered')
  }
}

const handleMobileNavigate = () => {
  mobileMenuOpen.value = false
}

// Keyboard shortcuts
useEventListener('keydown', (e: KeyboardEvent) => {
  // Cmd/Ctrl + K for search focus
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector<HTMLInputElement>('.search-input')
    searchInput?.focus()
    
    trackEvent('keyboard_shortcut_used', {
      shortcut: 'cmd_k_search'
    })
  }
  
  // Escape to close mobile menu
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
})

// Navigation loading indicator
router.beforeEach(() => {
  navigationLoading.value = true
})

router.afterEach(() => {
  navigationLoading.value = false
  mobileMenuOpen.value = false
})

// Persist dark mode preference
watch(isDark, (value) => {
  trackEvent('theme_changed', {
    theme: value ? 'dark' : 'light'
  })
})

// Accessibility: Trap focus in mobile menu
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

// Cleanup
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.app-header {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky;
  top: 0;
  z-index: 40;
}

/* Smooth transitions */
.app-header :deep(*) {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 200ms;
}
</style> 