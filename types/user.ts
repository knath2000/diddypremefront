export interface User {
  id: string
  email: string
  username?: string
  avatar?: string
  created_at: string
  updated_at?: string
  preferences?: UserPreferences
  gamification?: UserGamification
}

export interface UserPreferences {
  currency: string
  locale: string
  notifications: NotificationPreferences
  theme: 'light' | 'dark' | 'system'
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  priceDrops: boolean
  restocks: boolean
  newItems: boolean
}

export interface UserGamification {
  xp: number
  level: number
  achievements: Achievement[]
  streakDays: number
  totalItemsTracked: number
  totalAlertsCreated: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
  unlockedAt: Date
  progress: number
  category: 'trading' | 'collection' | 'social' | 'special'
  rare?: boolean
}