'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { CartDrawer, CartButton } from '@/components/client/CartDrawer'
import { AppointmentModal } from '@/components/client/AppointmentModal'
import { CheckoutModal } from '@/components/client/CheckoutModal'

// Types
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  time?: string
  emoji?: string
  image?: string
  available?: boolean
  duration?: number
}

interface BusinessConfig {
  name: string
  tagline?: string
  phone: string
  whatsapp: string
  address: string
  hours?: string
  instagram?: string
  logoEmoji?: string
  logoUrl?: string
  rating?: number
  reviewCount?: number
}

interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  isActive: boolean
  clicks: number
}

const LINK_ICONS: Record<string, { emoji: string; color: string }> = {
  instagram: { emoji: '📸', color: 'from-purple-500 to-pink-500' },
  facebook: { emoji: '📘', color: 'from-blue-600 to-blue-700' },
  tiktok: { emoji: '🎵', color: 'from-gray-900 to-black' },
  whatsapp: { emoji: '💬', color: 'from-green-500 to-green-600' },
  ubereats: { emoji: '🥡', color: 'from-green-600 to-green-700' },
  rappi: { emoji: '🛵', color: 'from-orange-500 to-orange-600' },
  pedidosya: { emoji: '🍔', color: 'from-red-500 to-red-600' },
  menu: { emoji: '📋', color: 'from-amber-500 to-amber-600' },
  reservas: { emoji: '📅', color: 'from-indigo-500 to-indigo-600' },
  web: { emoji: '🌐', color: 'from-slate-600 to-slate-700' },
  link: { emoji: '🔗', color: 'from-gray-500 to-gray-600' },
}

interface ThemeColors {
  primaryDark: string
  secondaryDark: string
  accentGold: string
  accentLight: string
  textLight: string
  textMuted: string
  border: string
}

interface PremiumTemplateProps {
  business: BusinessConfig
  menuItems?: MenuItem[]
  theme?: Partial<ThemeColors>
  links?: LinkItem[]
  slug?: string
  businessMode?: 'restaurant' | 'services' | 'store' | 'mixed'
  restaurantId?: string
  customColors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
}

// Labels según el modo de negocio
const MODE_CONFIG: Record<string, { items: string; reserve: string; reserveTitle: string; showReserve: boolean; showCart: boolean }> = {
  restaurant: { items: 'Menú', reserve: 'Reservar', reserveTitle: 'Reservar Mesa', showReserve: true, showCart: true },
  services: { items: 'Servicios', reserve: 'Agendar', reserveTitle: 'Agendar Cita', showReserve: false, showCart: false },
  store: { items: 'Productos', reserve: 'Pedir', reserveTitle: 'Hacer Pedido', showReserve: false, showCart: true },
  mixed: { items: 'Catálogo', reserve: 'Reservar', reserveTitle: 'Reservar/Agendar', showReserve: true, showCart: true },
}

// Default themes for different business types
export const premiumThemes: Record<string, ThemeColors> = {
  default: {
    primaryDark: '#0a0a0a',
    secondaryDark: '#1a1a1a',
    accentGold: '#d4af37',
    accentLight: '#f5e6d3',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(212, 175, 55, 0.2)'
  },
  italian: {
    primaryDark: '#0a0f0a',
    secondaryDark: '#1a251a',
    accentGold: '#22c55e',
    accentLight: '#dcfce7',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(34, 197, 94, 0.2)'
  },
  mexican: {
    primaryDark: '#0f0a0a',
    secondaryDark: '#251a1a',
    accentGold: '#dc2626',
    accentLight: '#fecaca',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(220, 38, 38, 0.2)'
  },
  hamburguesa: {
    primaryDark: '#0f0c0a',
    secondaryDark: '#251f1a',
    accentGold: '#f97316',
    accentLight: '#fed7aa',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(249, 115, 22, 0.2)'
  },
  barberia: {
    primaryDark: '#0a0a0a',
    secondaryDark: '#1a1a1a',
    accentGold: '#d4a853',
    accentLight: '#fef3c7',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(212, 168, 83, 0.2)'
  },
  spa: {
    primaryDark: '#0a0f0f',
    secondaryDark: '#1a2525',
    accentGold: '#14b8a6',
    accentLight: '#ccfbf1',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(20, 184, 166, 0.2)'
  },
  salon: {
    primaryDark: '#0f0a0d',
    secondaryDark: '#251a20',
    accentGold: '#ec4899',
    accentLight: '#fbcfe8',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(236, 72, 153, 0.2)'
  },
  floreria: {
    primaryDark: '#0f0a0b',
    secondaryDark: '#251a1d',
    accentGold: '#f43f5e',
    accentLight: '#fecdd3',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(244, 63, 94, 0.2)'
  },
  vegetariano: {
    primaryDark: '#0a0f0a',
    secondaryDark: '#1a251a',
    accentGold: '#84cc16',
    accentLight: '#ecfccb',
    textLight: '#e8e8e8',
    textMuted: '#9ca3af',
    border: 'rgba(132, 204, 22, 0.2)'
  }
}

export default function PremiumTemplate({
  business,
  menuItems = [],
  theme = {},
  links = [],
  slug = '',
  businessMode = 'restaurant',
  restaurantId = '',
  customColors
}: PremiumTemplateProps) {
  const modeConfig = MODE_CONFIG[businessMode] || MODE_CONFIG.restaurant
  const [activeSection, setActiveSection] = useState(links.length > 0 ? 'links' : 'menu')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [reservationForm, setReservationForm] = useState({
    name: '',
    phone: '',
    time: '19:00',
    guests: 2
  })
  const [reservationLoading, setReservationLoading] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [reservationError, setReservationError] = useState('')

  // Modal states for new features
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedService, setSelectedService] = useState<MenuItem | null>(null)

  // Cart hook
  const { addItem, openCart, getItemById } = useCart()

  // Merge theme with defaults, then override with custom colors
  let colors: ThemeColors = { ...premiumThemes.default, ...theme }

  // Apply custom colors if provided
  if (customColors?.primary) {
    colors.accentGold = customColors.primary
    colors.border = `${customColors.primary}33`
  }
  if (customColors?.secondary) {
    colors.primaryDark = customColors.secondary
  }

  const displayMenuItems = menuItems

  // Group items by category
  const menuByCategory = displayMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categories = Object.keys(menuByCategory)

  // Toggle category collapse
  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  // Format price
  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      days.push(date.getDate())
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  // Contact functions
  const contactWhatsapp = (message = 'Hola, quiero hacer una reserva') => {
    const phone = business.whatsapp?.replace(/[^0-9]/g, '') || business.phone?.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const contactPhone = () => {
    window.open(`tel:${business.phone}`, '_self')
  }

  const contactInstagram = () => {
    if (business.instagram) {
      window.open(business.instagram, '_blank')
    }
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle add to cart
  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    if (!restaurantId) return

    addItem(
      {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        imageUrl: item.image,
        category: item.category,
      },
      restaurantId,
      slug
    )
    openCart()
  }

  // Handle schedule appointment
  const handleScheduleAppointment = (item: MenuItem) => {
    setSelectedService(item)
    setShowAppointmentModal(true)
    setSelectedDish(null)
  }

  // Determine action based on business mode
  const isServiceItem = (item: MenuItem) => {
    return businessMode === 'services' || (businessMode === 'mixed' && item.duration)
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reservationForm.name || !reservationForm.phone || !selectedDate) {
      setReservationError('Por favor completa todos los campos')
      return
    }

    setReservationLoading(true)
    setReservationError('')
    setReservationSuccess(false)

    try {
      const today = new Date()
      const reservationDate = new Date(today)
      if (selectedDate < today.getDate()) {
        reservationDate.setMonth(reservationDate.getMonth() + 1)
      }
      reservationDate.setDate(selectedDate)

      const res = await fetch(`/api/restaurants/${slug}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reservationForm.name,
          phone: reservationForm.phone,
          date: reservationDate.toISOString(),
          time: reservationForm.time,
          guests: reservationForm.guests,
        }),
      })

      if (res.ok) {
        setReservationSuccess(true)
        setReservationForm({ name: '', phone: '', time: '19:00', guests: 2 })
        setSelectedDate(null)

        const message = `Hola, acabo de hacer una reserva:
- Nombre: ${reservationForm.name}
- Fecha: ${reservationDate.toLocaleDateString('es-ES')}
- Hora: ${reservationForm.time}
- Personas: ${reservationForm.guests}
- Teléfono: ${reservationForm.phone}`
        setTimeout(() => contactWhatsapp(message), 1500)
      } else {
        const data = await res.json().catch(() => ({}))
        setReservationError(data.error || 'Error al crear la reserva')
      }
    } catch {
      setReservationError('Error de conexión')
    } finally {
      setReservationLoading(false)
    }
  }

  // CSS custom properties
  const cssVars = {
    '--primary-dark': colors.primaryDark,
    '--secondary-dark': colors.secondaryDark,
    '--accent-gold': colors.accentGold,
    '--accent-light': colors.accentLight,
    '--text-light': colors.textLight,
    '--text-muted': colors.textMuted,
    '--border': colors.border,
  } as React.CSSProperties

  return (
    <div className="premium-template" style={cssVars}>
      <style jsx global>{`
        .premium-template {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--primary-dark);
          color: var(--text-light);
          min-height: 100vh;
          overflow-x: hidden;
        }
        .premium-template * { box-sizing: border-box; }
        .pt-header {
          background: linear-gradient(135deg, #000000 0%, var(--secondary-dark) 100%);
          padding: 2rem 1.5rem;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .pt-header-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .pt-logo {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-light) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .pt-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pt-business-name {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--accent-gold);
          letter-spacing: 2px;
          margin-bottom: 0.25rem;
        }
        .pt-tagline {
          font-size: 0.85rem;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .pt-nav {
          display: flex;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .pt-nav-btn {
          flex: 1;
          min-width: 80px;
          padding: 0.75rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .pt-nav-btn.active {
          background: var(--accent-gold);
          color: var(--primary-dark);
          border-color: var(--accent-gold);
        }
        .pt-nav-btn:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }
        .pt-info-bar {
          padding: 1rem 1.5rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid var(--border);
          margin: 0 1.5rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .pt-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }
        .pt-info-item.highlight {
          color: var(--accent-gold);
        }
        .pt-content {
          padding: 1.5rem;
        }
        .pt-cta-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(212, 175, 55, 0.05);
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .pt-btn-cta {
          padding: 1rem;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--accent-gold);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }
        .pt-btn-cta:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: var(--accent-gold);
          transform: translateY(-2px);
        }
        .pt-categories {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .pt-category {
          border-bottom: 2px solid var(--border);
          padding-bottom: 1.5rem;
        }
        .pt-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .pt-category-header:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        .pt-category-title {
          font-size: 1.4rem;
          color: var(--accent-gold);
          font-weight: 700;
          letter-spacing: 1px;
        }
        .pt-category-toggle {
          width: 32px;
          height: 32px;
          background: rgba(212, 175, 55, 0.2);
          border: none;
          border-radius: 8px;
          color: var(--accent-gold);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pt-category-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          max-height: 2000px;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .pt-category-items.collapsed {
          max-height: 0;
          opacity: 0;
          margin: 0;
        }
        .pt-dish-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pt-dish-card:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: var(--accent-gold);
          transform: translateY(-4px);
        }
        .pt-dish-card.unavailable {
          opacity: 0.6;
        }
        .pt-dish-image {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 70px;
          overflow: hidden;
        }
        .pt-dish-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pt-dish-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pt-dish-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-light);
        }
        .pt-dish-description {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pt-dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        .pt-dish-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .pt-dish-price {
          font-size: 1.3rem;
          color: var(--accent-gold);
          font-weight: 700;
        }
        .pt-dish-status {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }
        .pt-dish-cart-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: var(--accent-gold);
          color: var(--primary-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
        }
        .pt-links-section {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        .pt-section-title {
          font-size: 1.4rem;
          color: var(--accent-gold);
          text-align: center;
          margin-bottom: 1.5rem;
          letter-spacing: 1px;
        }
        .pt-links-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pt-link-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .pt-link-card:hover {
          background: rgba(212, 175, 55, 0.15);
          border-color: var(--accent-gold);
          transform: translateX(4px);
        }
        .pt-link-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .pt-link-title {
          flex: 1;
          font-weight: 600;
          color: var(--text-light);
          font-size: 1rem;
        }
        .pt-link-arrow {
          color: var(--accent-gold);
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }
        .pt-link-card:hover .pt-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .pt-reserve-section {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          padding: 2rem 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          margin-top: 2rem;
        }
        .pt-reserve-title {
          font-size: 1.6rem;
          color: var(--accent-gold);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .pt-form-group {
          margin-bottom: 1.25rem;
        }
        .pt-form-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pt-form-input, .pt-form-select {
          width: 100%;
          padding: 0.875rem;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-light);
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .pt-form-input::placeholder {
          color: var(--text-muted);
        }
        .pt-form-input:focus, .pt-form-select:focus {
          outline: none;
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }
        .pt-form-select option {
          background: var(--secondary-dark);
          color: var(--text-light);
        }
        .pt-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .pt-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .pt-calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-light);
        }
        .pt-calendar-day:hover {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.15);
        }
        .pt-calendar-day.selected {
          background: var(--accent-gold);
          color: var(--primary-dark);
          border-color: var(--accent-gold);
        }
        .pt-form-message {
          padding: 0.875rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-top: 1rem;
          text-align: center;
        }
        .pt-form-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .pt-form-success {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86efac;
        }
        .pt-btn-reserve {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-light) 100%);
          color: var(--primary-dark);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
        }
        .pt-btn-reserve:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(212, 175, 55, 0.4);
        }
        .pt-btn-reserve:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .pt-footer {
          padding: 2rem 1.5rem;
          text-align: center;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 2rem;
        }
        .pt-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .pt-modal-content {
          background: var(--secondary-dark);
          border-radius: 24px 24px 0 0;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem 1.5rem;
          position: relative;
        }
        .pt-modal-close {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          background: rgba(212, 175, 55, 0.2);
          border: none;
          border-radius: 50%;
          color: var(--accent-gold);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .pt-modal-close:hover {
          background: rgba(212, 175, 55, 0.4);
          transform: rotate(90deg);
        }
        .pt-modal-dish-emoji {
          font-size: 100px;
          text-align: center;
          margin: 1rem 0 1.5rem;
        }
        .pt-modal-dish-image {
          width: 100%;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          margin: 1rem 0 1.5rem;
        }
        .pt-modal-dish-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pt-modal-dish-name {
          color: var(--accent-gold);
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .pt-modal-dish-time {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .pt-modal-dish-details {
          background: rgba(212, 175, 55, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }
        .pt-modal-dish-description {
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        .pt-modal-dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .pt-modal-dish-price {
          font-size: 1.8rem;
          color: var(--accent-gold);
          font-weight: 700;
        }
        .pt-modal-dish-available {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .pt-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pt-btn-cart {
          width: 100%;
          padding: 1rem;
          background: var(--accent-gold);
          color: var(--primary-dark);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pt-btn-cart:hover {
          transform: translateY(-2px);
        }
        .pt-btn-secondary {
          background: transparent;
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
        }
        @media (min-width: 768px) {
          .pt-header { padding: 2rem; }
          .pt-content { padding: 2rem; }
          .pt-info-bar { margin: 0 2rem; }
          .pt-reserve-section { margin: 2rem; padding: 2.5rem; }
          .pt-business-name { font-size: 2.5rem; }
          .pt-dish-card { grid-template-columns: 140px 1fr; }
          .pt-dish-image { height: auto; min-height: 140px; }
          .pt-cta-container { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* Header */}
      <header className="pt-header">
        <div className="pt-header-top">
          <div className="pt-logo">
            {business.logoUrl ? (
              <Image src={business.logoUrl} alt={business.name} width={70} height={70} />
            ) : (
              business.logoEmoji || '🍽️'
            )}
          </div>
          <div>
            <h1 className="pt-business-name">{business.name}</h1>
            <p className="pt-tagline">{business.tagline || business.address}</p>
          </div>
        </div>
        <nav className="pt-nav">
          {links.length > 0 && (
            <button
              className={`pt-nav-btn ${activeSection === 'links' ? 'active' : ''}`}
              onClick={() => scrollToSection('links')}
            >
              🔗 Links
            </button>
          )}
          <button
            className={`pt-nav-btn ${activeSection === 'menu' ? 'active' : ''}`}
            onClick={() => scrollToSection('menu')}
          >
            📋 {modeConfig.items}
          </button>
          {modeConfig.showReserve && (
            <button
              className={`pt-nav-btn ${activeSection === 'reserve' ? 'active' : ''}`}
              onClick={() => scrollToSection('reserve')}
            >
              📅 {modeConfig.reserve}
            </button>
          )}
          <button className="pt-nav-btn" onClick={() => contactWhatsapp()}>
            💬 Contacto
          </button>
        </nav>
      </header>

      {/* Info Bar */}
      <div className="pt-info-bar">
        <div className="pt-info-item">
          <span>📍</span>
          <span>{business.address}</span>
        </div>
        {business.rating && (
          <div className="pt-info-item highlight">
            <span>⭐ {business.rating}</span>
            {business.reviewCount && <span>({business.reviewCount} reviews)</span>}
          </div>
        )}
      </div>

      {/* Links Section */}
      {links.length > 0 && (
        <div className="pt-content" id="links">
          <div className="pt-links-section">
            <h2 className="pt-section-title">Síguenos & Ordena</h2>
            <div className="pt-links-grid">
              {links.map((link) => {
                const iconData = LINK_ICONS[link.icon] || LINK_ICONS.link
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-link-card"
                  >
                    <div className={`pt-link-icon bg-gradient-to-r ${iconData.color}`}>
                      {iconData.emoji}
                    </div>
                    <span className="pt-link-title">{link.title}</span>
                    <span className="pt-link-arrow">→</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-content" id="menu">
        {/* CTA Buttons */}
        <div className="pt-cta-container">
          <button className="pt-btn-cta" onClick={() => contactWhatsapp()}>
            💬 WhatsApp
          </button>
          <button className="pt-btn-cta" onClick={contactPhone}>
            📞 Llamar
          </button>
          <button className="pt-btn-cta" onClick={contactInstagram}>
            📸 Instagram
          </button>
        </div>

        {/* Menu Categories */}
        <div className="pt-categories">
          {categories.map((category) => (
            <div key={category} className="pt-category">
              <div className="pt-category-header" onClick={() => toggleCategory(category)}>
                <h2 className="pt-category-title">{category}</h2>
                <button className="pt-category-toggle">
                  {collapsedCategories.has(category) ? '▶' : '▼'}
                </button>
              </div>

              <div className={`pt-category-items ${collapsedCategories.has(category) ? 'collapsed' : ''}`}>
                {menuByCategory[category].map((item) => {
                  const cartItem = getItemById(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`pt-dish-card ${!item.available ? 'unavailable' : ''}`}
                      onClick={() => setSelectedDish(item)}
                    >
                      {cartItem && (
                        <span className="pt-dish-cart-badge">
                          {cartItem.quantity} en carrito
                        </span>
                      )}
                      <div className="pt-dish-image">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={180} height={180} />
                        ) : (
                          item.emoji || '🍽️'
                        )}
                      </div>
                      <div className="pt-dish-info">
                        <h3 className="pt-dish-name">{item.name}</h3>
                        <p className="pt-dish-description">{item.description}</p>
                        <div className="pt-dish-footer">
                          <span className="pt-dish-meta">
                            {item.duration ? `⏱️ ${item.duration} min` : `⏱️ ${item.time || '15 min'}`}
                          </span>
                          <span className="pt-dish-price">{formatPrice(item.price)}</span>
                        </div>
                        {!item.available && (
                          <span className="pt-dish-status">No disponible</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation Section */}
      {modeConfig.showReserve && (
        <div className="pt-content">
          <div className="pt-reserve-section" id="reserve">
            <h2 className="pt-reserve-title">{modeConfig.reserveTitle}</h2>

            <form onSubmit={handleReservation}>
              <div className="pt-form-row">
                <div className="pt-form-group">
                  <label className="pt-form-label">Nombre</label>
                  <input
                    type="text"
                    className="pt-form-input"
                    placeholder="Tu nombre"
                    value={reservationForm.name}
                    onChange={(e) => setReservationForm({...reservationForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="pt-form-group">
                  <label className="pt-form-label">Telefono</label>
                  <input
                    type="tel"
                    className="pt-form-input"
                    placeholder="Tu telefono"
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm({...reservationForm, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="pt-form-group">
                <label className="pt-form-label">Selecciona Fecha</label>
                <div className="pt-calendar">
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`pt-calendar-day ${selectedDate === day ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-form-row">
                <div className="pt-form-group">
                  <label className="pt-form-label">Hora</label>
                  <select
                    className="pt-form-select"
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm({...reservationForm, time: e.target.value})}
                  >
                    {['12:00','12:30','13:00','13:30','14:00','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-form-group">
                  <label className="pt-form-label">Personas</label>
                  <select
                    className="pt-form-select"
                    value={reservationForm.guests}
                    onChange={(e) => setReservationForm({...reservationForm, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'persona' : n === 6 ? '+ personas' : 'personas'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {reservationError && <div className="pt-form-message pt-form-error">⚠️ {reservationError}</div>}
              {reservationSuccess && <div className="pt-form-message pt-form-success">✓ ¡Reserva confirmada!</div>}

              <button type="submit" className="pt-btn-reserve" disabled={reservationLoading}>
                {reservationLoading ? 'Enviando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-footer">
        ✨ Impulsado por Digitaliza | Reservas y Menu Integrados
      </footer>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            className="pt-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              className="pt-modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="pt-modal-close" onClick={() => setSelectedDish(null)}>✕</button>

              {selectedDish.image ? (
                <div className="pt-modal-dish-image">
                  <Image src={selectedDish.image} alt={selectedDish.name} width={500} height={200} />
                </div>
              ) : (
                <div className="pt-modal-dish-emoji">{selectedDish.emoji || '🍽️'}</div>
              )}

              <h2 className="pt-modal-dish-name">{selectedDish.name}</h2>
              <p className="pt-modal-dish-time">
                {selectedDish.duration ? `⏱️ Duración: ${selectedDish.duration} min` : `⏱️ Preparación: ${selectedDish.time || '15 min'}`}
              </p>

              <div className="pt-modal-dish-details">
                <p className="pt-modal-dish-description">{selectedDish.description}</p>
                <div className="pt-modal-dish-footer">
                  <span className="pt-modal-dish-price">{formatPrice(selectedDish.price)}</span>
                  <span className="pt-modal-dish-available">
                    {selectedDish.available !== false ? '✓ Disponible' : '✗ No disponible'}
                  </span>
                </div>
              </div>

              <div className="pt-modal-actions">
                {isServiceItem(selectedDish) ? (
                  <button
                    className="pt-btn-cart"
                    onClick={() => handleScheduleAppointment(selectedDish)}
                    disabled={selectedDish.available === false}
                  >
                    📅 Agendar Cita
                  </button>
                ) : modeConfig.showCart ? (
                  <button
                    className="pt-btn-cart"
                    onClick={() => handleAddToCart(selectedDish)}
                    disabled={selectedDish.available === false}
                  >
                    🛒 Agregar al Carrito
                  </button>
                ) : null}

                {modeConfig.showReserve && !isServiceItem(selectedDish) && (
                  <button
                    className="pt-btn-cart pt-btn-secondary"
                    onClick={() => {
                      setSelectedDish(null)
                      scrollToSection('reserve')
                    }}
                  >
                    📅 Reservar Mesa
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Button & Drawer */}
      {modeConfig.showCart && restaurantId && (
        <>
          <CartButton accentColor={colors.accentGold} />
          <CartDrawer
            onCheckout={() => setShowCheckoutModal(true)}
            accentColor={colors.accentGold}
          />
        </>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && restaurantId && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          restaurantId={restaurantId}
          restaurantName={business.name}
          restaurantWhatsApp={business.whatsapp}
          restaurantAddress={business.address}
          businessMode={businessMode}
          accentColor={colors.accentGold}
        />
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedService && restaurantId && (
        <AppointmentModal
          service={{
            id: selectedService.id,
            name: selectedService.name,
            price: selectedService.price,
            duration: selectedService.duration,
            category: selectedService.category,
          }}
          isOpen={showAppointmentModal}
          onClose={() => {
            setShowAppointmentModal(false)
            setSelectedService(null)
          }}
          restaurantId={restaurantId}
          restaurantName={business.name}
          restaurantWhatsApp={business.whatsapp}
          accentColor={colors.accentGold}
        />
      )}
    </div>
  )
}
