import type { Platform } from '~/types/price'

interface PlatformConfig {
  name: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  url: string
}

const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  stockx: {
    name: 'StockX',
    icon: '/icons/stockx.svg',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    url: 'https://stockx.com'
  },
  goat: {
    name: 'GOAT',
    icon: '/icons/goat.svg',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    url: 'https://goat.com'
  },
  grailed: {
    name: 'Grailed',
    icon: '/icons/grailed.svg',
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    url: 'https://grailed.com'
  }
}

export const usePlatformConfig = () => {
  const getPlatformConfig = (platform: Platform): PlatformConfig => {
    return PLATFORM_CONFIGS[platform]
  }

  const getPlatformIcon = (platform: Platform): string => {
    return PLATFORM_CONFIGS[platform].icon
  }

  const getPlatformColor = (platform: Platform): string => {
    return PLATFORM_CONFIGS[platform].color
  }

  const getPlatformName = (platform: Platform): string => {
    return PLATFORM_CONFIGS[platform].name
  }

  const getPlatformUrl = (platform: Platform): string => {
    return PLATFORM_CONFIGS[platform].url
  }

  const getAllPlatforms = (): Platform[] => {
    return Object.keys(PLATFORM_CONFIGS) as Platform[]
  }

  const getPlatformClasses = (platform: Platform) => {
    const config = PLATFORM_CONFIGS[platform]
    return {
      bg: config.bgColor,
      border: config.borderColor,
      text: `text-${config.color}-900 dark:text-${config.color}-100`
    }
  }

  return {
    getPlatformConfig,
    getPlatformIcon,
    getPlatformColor,
    getPlatformName,
    getPlatformUrl,
    getAllPlatforms,
    getPlatformClasses,
    PLATFORM_CONFIGS
  }
}