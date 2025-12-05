// Core types for Digitaliza platform

export type CuisineType = 'general' | 'italian' | 'japanese' | 'mexican' | 'coffee' | 'barber'

export type BusinessMode = 'restaurant' | 'services' | 'store' | 'mixed'

export interface Restaurant {
  id: string
  slug: string
  name: string
  phone: string
  whatsapp: string
  email?: string
  address: string
  hours: Record<string, string>
  theme: CuisineType
  businessMode: BusinessMode
  password?: string
  logoUrl?: string
  description?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface MenuItem {
  id: string
  name: string
  price: string | number
  category: string
  description?: string | undefined
  available: boolean
  imageUrl?: string | undefined
  order: number
  restaurantId: string
  duration?: string
  size?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
}

export interface TemplateProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
  isAdmin?: boolean
}

export interface OrderItem {
  id: string
  name: string
  price: string
  quantity: number
  total: string
}

export interface Order {
  customerName: string
  customerPhone: string
  items: OrderItem[]
  total: string
  deliveryType: 'pickup' | 'delivery'
  preferredTime?: string
  notes?: string
}

export interface ReservationForm {
  customerName: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  notes?: string
}

// Database model types
export interface Link {
  id: string
  title: string
  url: string
  icon: string
  order: number
  isActive: boolean
  clicks: number
  restaurantId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Reservation {
  id: string
  name: string
  phone: string
  email?: string
  date: Date | string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  restaurantId: string
  createdAt?: Date
  updatedAt?: Date
}

// Template configuration types
export interface TemplateConfig {
  cuisineType: CuisineType
  colorScheme: ThemeColors
  defaultLogo: string
  backgroundPattern?: string
  animations: string[]
}

// Form types
export interface RegistrationData {
  name: string
  phone: string
  whatsapp: string
  address: string
  hours: string
  cuisineType?: CuisineType
  description?: string
  logoUrl?: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Menu management types
export interface MenuCategory {
  name: string
  items: MenuItem[]
  order: number
}

// Admin panel types
export interface AdminStats {
  totalMenuItems: number
  availableItems: number
  totalOrders: number
  totalViews: number
}

// WhatsApp integration types
export interface WhatsAppMessage {
  to: string
  message: string
  type: 'text' | 'order' | 'reservation'
}

// Performance monitoring types
export interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  loadTime: number
  bundleSize: number
}
