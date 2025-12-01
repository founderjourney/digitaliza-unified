// Utility functions for Digitaliza

// Simple class merger (simplified version without clsx dependency)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Format phone number for WhatsApp
export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

// Generate WhatsApp URL with message
export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppNumber(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

// Generate slug from restaurant name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Format hours object to string
export function formatHours(hours: Record<string, string> | string | null | undefined): string {
  if (!hours) return 'Horario no disponible'
  if (typeof hours === 'string') return hours
  const dayNames: Record<string, string> = {
    mon: 'Lun', tue: 'Mar', wed: 'Mie', thu: 'Jue', fri: 'Vie', sat: 'Sab', sun: 'Dom'
  }
  const entries = Object.entries(hours)
  if (entries.length === 0) return 'Horario no disponible'
  return entries.map(([day, time]) => `${dayNames[day] || day}: ${time}`).join(' | ')
}

// Format price for display
export function formatPrice(price: string | number): string {
  if (typeof price === 'number') {
    return `€${price.toFixed(2)}`
  }
  // If already includes currency symbol, return as is
  if (price.includes('€') || price.includes('$')) {
    return price
  }
  return `€${price}`
}

// Detect cuisine type from restaurant name
export function detectCuisineType(name: string): 'japanese' | 'italian' | 'mexican' | 'coffee' | 'general' {
  const lowerName = name.toLowerCase()

  // Japanese keywords
  if (lowerName.match(/sushi|sakura|tokyo|ramen|bento|ninja|samurai|zen|wa|miso|tempura/)) {
    return 'japanese'
  }

  // Italian keywords
  if (lowerName.match(/pizza|pasta|nonna|romano|bella|italia|trattoria|osteria|ristorante/)) {
    return 'italian'
  }

  // Mexican keywords
  if (lowerName.match(/taco|mariachi|azteca|maya|cantina|mexico|burrito|quesadilla/)) {
    return 'mexican'
  }

  // Coffee keywords
  if (lowerName.match(/café|coffee|brew|roast|beans|espresso|latte|cappuccino/)) {
    return 'coffee'
  }

  return 'general'
}

// Generate theme colors based on cuisine type
export function generateThemeColors(cuisineType: 'japanese' | 'italian' | 'mexican' | 'coffee' | 'general') {
  const colorSchemes = {
    japanese: {
      primary: '#C41E3A',
      secondary: '#2C1810',
      accent: '#FFB7C5',
      background: '#FFF9F9'
    },
    italian: {
      primary: '#228B22',
      secondary: '#DC143C',
      accent: '#FFD700',
      background: '#FFFAF0'
    },
    mexican: {
      primary: '#FF6B35',
      secondary: '#004225',
      accent: '#F7931E',
      background: '#FFF8DC'
    },
    coffee: {
      primary: '#8B4513',
      secondary: '#2F1B14',
      accent: '#D2691E',
      background: '#FDF5E6'
    },
    general: {
      primary: '#6366f1',
      secondary: '#1e293b',
      accent: '#f59e0b',
      background: '#f8fafc'
    }
  }

  return colorSchemes[cuisineType]
}

// Performance monitoring
export function trackPerformance(metricName: string, value: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metricName}: ${value}ms`)
      }

      // Could integrate with analytics service here
      // analytics.track(metricName, { value, timestamp: Date.now() })
    } catch (error) {
      console.warn('Performance tracking failed:', error)
    }
  }
}

// Debounce function for search/input
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return window.innerWidth < 768 ||
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }
}
