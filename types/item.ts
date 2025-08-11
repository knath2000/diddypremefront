import type { Price } from './price'

export interface Item {
  id: string
  title: string
  slug: string
  brand: string
  season?: string
  styleCode?: string
  style_code?: string // Legacy field
  imageUrl?: string
  image_url?: string // Legacy field
  images?: ItemImage[]
  variants: Variant[]
  releaseDate?: string
  releaseWeek?: string
  retail?: number
  colors?: string[]
  categories?: string[]
  created_at: string
  updated_at?: string
}

export interface ItemImage {
  id: string
  url: string
  alt?: string
  isPrimary?: boolean
  order?: number
}

export interface Variant {
  id: string
  item_id: string
  size: string
  color: string
  sku?: string
  prices?: Price[]
  stockxPrices?: StockXPrice[]
}

export interface StockXPrice {
  type: 'lowestAsk' | 'highestBid' | 'lastSale'
  price: number
  currency: string
  fetched_at: string
}

export interface ItemSearchResult {
  items: Item[]
  total: number
  page: number
  hasMore: boolean
}