import { ref, computed, readonly } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { User } from '~/types'

interface AuthState {
  user: Ref<User | null>
  isAuthenticated: ComputedRef<boolean>
  isLoading: Ref<boolean>
}

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  username: 'supremefan',
  avatar: '/images/avatar-placeholder.png',
  created_at: new Date().toISOString(),
  preferences: {
    currency: 'USD',
    locale: 'en-US',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      priceDrops: true,
      restocks: true,
      newItems: true
    }
  },
  gamification: {
    xp: 1250,
    level: 5,
    achievements: [],
    streakDays: 7,
    totalItemsTracked: 42,
    totalAlertsCreated: 15
  }
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const isLoading = useState('auth.loading', () => false)
  
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (email: string, password: string) => {
    isLoading.value = true
    
    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, this would make an API call
      user.value = {
        ...mockUser,
        email,
        xp: mockUser.gamification?.xp || 0,
        level: mockUser.gamification?.level || 1,
        alertCount: 3,
        addXp: (amount: number) => {
          if (user.value && user.value.gamification) {
            user.value.gamification.xp += amount
            // Check for level up
            const newLevel = Math.floor(user.value.gamification.xp / 1000) + 1
            if (newLevel > user.value.gamification.level) {
              user.value.gamification.level = newLevel
              // Show level up notification
              const { showNotification } = useNotifications()
              showNotification({
                type: 'success',
                message: `Level up! You're now level ${newLevel}!`
              })
            }
          }
        }
      } as any
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: 'Invalid credentials' 
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    isLoading.value = true
    
    try {
      // Mock logout
      await new Promise(resolve => setTimeout(resolve, 500))
      user.value = null
      
      // Clear any auth tokens
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
      
      // Redirect to home
      await navigateTo('/')
    } finally {
      isLoading.value = false
    }
  }
  
  const register = async (email: string, password: string, username?: string) => {
    isLoading.value = true
    
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      user.value = {
        ...mockUser,
        id: Date.now().toString(),
        email,
        username: username || email.split('@')[0],
        created_at: new Date().toISOString()
      } as any
      
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: 'Registration failed' 
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return { success: false, error: 'Not authenticated' }
    
    isLoading.value = true
    
    try {
      // Mock profile update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = {
        ...user.value,
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      return { success: true }
    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: 'Failed to update profile' 
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const checkAuth = async () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // In production, validate token with API
        user.value = mockUser as any
      }
    }
  }
  
  // Check auth on mount
  onMounted(() => {
    checkAuth()
  })
  
  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    register,
    updateProfile,
    checkAuth
  }
}