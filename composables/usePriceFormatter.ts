interface FormatOptions {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  notation?: 'standard' | 'compact'
}

export const usePriceFormatter = () => {
  const formatPrice = (
    value: number,
    options: FormatOptions = {}
  ): string => {
    const {
      currency = 'USD',
      locale = 'en-US',
      minimumFractionDigits = 0,
      maximumFractionDigits = 0,
      notation = 'standard'
    } = options

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
        notation
      }).format(value)
    } catch (error) {
      console.error('Error formatting price:', error)
      // Fallback formatting
      return `$${value.toLocaleString()}`
    }
  }

  const formatPriceChange = (
    current: number,
    previous: number,
    options: FormatOptions = {}
  ) => {
    const change = current - previous
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0
    
    return {
      absolute: formatPrice(Math.abs(change), options),
      percentage: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      isPositive: change >= 0
    }
  }

  const formatCompactPrice = (value: number, options: FormatOptions = {}) => {
    return formatPrice(value, {
      ...options,
      notation: 'compact',
      maximumFractionDigits: 1
    })
  }

  return {
    formatPrice,
    formatPriceChange,
    formatCompactPrice
  }
}