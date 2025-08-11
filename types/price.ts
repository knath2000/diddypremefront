export type Platform = 'stockx' | 'goat' | 'grailed'
export type PriceSize = 'sm' | 'md' | 'lg'
export type PriceTrend = 'up' | 'down' | 'neutral'

export interface Price {
  id: string
  price_usd: number
  currency: string
  platform: Platform
  captured_at: string
  variant_id: string
  ask_or_bid: 'ask' | 'bid' | 'last'
}

export interface PriceHistory {
  current: number
  previous?: number
  high24h?: number
  low24h?: number
  change24h?: number
  changePercent24h?: number
}

export interface PriceAlert {
  id: string
  item_id: string
  variant_id?: string
  target_price: number
  alert_type: 'below' | 'above'
  platform?: Platform
  active: boolean
  created_at: string
  triggered_at?: string
}