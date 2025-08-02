import { computed, readonly } from 'vue'
import type { Item } from '~/types'

interface FavoriteItem {
  id: string
  item: Item
  addedAt: Date
}

const STORAGE_KEY = 'supreme-tracker-favorites'

export const useFavorites = () => {
  const favorites = useState<FavoriteItem[]>('favorites', () => [])
  
  // Load favorites from localStorage on client
  onMounted(() => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          favorites.value = parsed.map((fav: any) => ({
            ...fav,
            addedAt: new Date(fav.addedAt)
          }))
        }
      } catch (error) {
        console.error('Failed to load favorites:', error)
      }
    }
  })

  // Persist favorites to localStorage
  const persist = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
      } catch (error) {
        console.error('Failed to save favorites:', error)
      }
    }
  }

  const addFavorite = (item: Item) => {
    const existing = favorites.value.find(fav => fav.id === item.id)
    if (!existing) {
      favorites.value.push({
        id: item.id,
        item,
        addedAt: new Date()
      })
      persist()
    }
  }

  const removeFavorite = (itemId: string) => {
    const index = favorites.value.findIndex(fav => fav.id === itemId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      persist()
    }
  }

  const isFavorite = (itemId: string): boolean => {
    return favorites.value.some(fav => fav.id === itemId)
  }

  const toggleFavorite = (item: Item) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
  }

  const clearFavorites = () => {
    favorites.value = []
    persist()
  }

  const getFavoriteItems = computed(() => 
    favorites.value.map(fav => fav.item)
  )

  const favoriteCount = computed(() => favorites.value.length)

  const sortedFavorites = computed(() => 
    [...favorites.value].sort((a, b) => 
      b.addedAt.getTime() - a.addedAt.getTime()
    )
  )

  return {
    favorites: readonly(favorites),
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoriteItems,
    favoriteCount,
    sortedFavorites
  }
}