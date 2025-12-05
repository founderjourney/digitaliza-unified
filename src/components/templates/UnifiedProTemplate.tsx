'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  popular?: boolean
  available?: boolean
}

interface Reservation {
  id: string
  name: string
  phone: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

interface BusinessConfig {
  name: string
  tagline?: string
  description?: string
  phone: string
  whatsapp: string
  address: string
  hours: string | Record<string, string>
  instagram?: string
  logoUrl?: string
  rating?: number
  reviewCount?: number
}

interface ThemeColors {
  primary: string      // Main dark background
  secondary: string    // Lighter background
  accent: string       // Gold/highlight color
  accentHover: string  // Accent hover state
  text: string         // Primary text
  textMuted: string    // Muted text
  border: string       // Border color
  cardBg: string       // Card background
}

interface UnifiedProTemplateProps {
  business: BusinessConfig
  menuItems?: MenuItem[]
  theme: ThemeColors
  businessType: 'restaurant' | 'barberia' | 'spa' | 'salon' | 'floreria'
  showAdmin?: boolean
}

// Default themes for different business types
export const businessThemes: Record<string, ThemeColors> = {
  italian: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#22c55e',
    accentHover: '#16a34a',
    text: '#ffffff',
    textMuted: '#a1a1aa',
    border: '#3d3d3d',
    cardBg: '#252525'
  },
  mexican: {
    primary: '#1a0a0a',
    secondary: '#2d1515',
    accent: '#dc2626',
    accentHover: '#b91c1c',
    text: '#ffffff',
    textMuted: '#fca5a5',
    border: '#4d2525',
    cardBg: '#251515'
  },
  hamburguesa: {
    primary: '#1a1005',
    secondary: '#2d1f10',
    accent: '#f97316',
    accentHover: '#ea580c',
    text: '#ffffff',
    textMuted: '#fdba74',
    border: '#4d3520',
    cardBg: '#251a0a'
  },
  barberia: {
    primary: '#0f0f0f',
    secondary: '#1a1a1a',
    accent: '#d4a853',
    accentHover: '#c49a45',
    text: '#ffffff',
    textMuted: '#9ca3af',
    border: '#333333',
    cardBg: '#1f1f1f'
  },
  spa: {
    primary: '#0a1a1a',
    secondary: '#102d2d',
    accent: '#14b8a6',
    accentHover: '#0d9488',
    text: '#ffffff',
    textMuted: '#5eead4',
    border: '#1d4d4d',
    cardBg: '#0f2525'
  },
  salon: {
    primary: '#1a0a15',
    secondary: '#2d1025',
    accent: '#ec4899',
    accentHover: '#db2777',
    text: '#ffffff',
    textMuted: '#f9a8d4',
    border: '#4d2040',
    cardBg: '#250f20'
  },
  floreria: {
    primary: '#1a0a10',
    secondary: '#2d1520',
    accent: '#f43f5e',
    accentHover: '#e11d48',
    text: '#ffffff',
    textMuted: '#fda4af',
    border: '#4d2030',
    cardBg: '#250f18'
  },
  vegetariano: {
    primary: '#0a1a0a',
    secondary: '#152d15',
    accent: '#84cc16',
    accentHover: '#65a30d',
    text: '#ffffff',
    textMuted: '#bef264',
    border: '#2d4d2d',
    cardBg: '#0f250f'
  }
}

export default function UnifiedProTemplate({
  business,
  menuItems = [],
  theme,
  businessType = 'restaurant',
  showAdmin = false
}: UnifiedProTemplateProps) {
  const [activeView, setActiveView] = useState<'client' | 'admin'>('client')
  const [activeSection, setActiveSection] = useState('menu')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [, setShowReservationModal] = useState(false)
  const [adminTab, setAdminTab] = useState<'menu' | 'reservations' | 'settings'>('menu')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationForm, setReservationForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  })

  // Default menu items based on business type
  const getDefaultMenuItems = (): MenuItem[] => {
    if (businessType === 'restaurant') {
      return [
        { id: '1', name: 'Entrada Especial', description: 'Nuestra entrada signature del chef', price: 25000, category: 'Entradas', popular: true, available: true },
        { id: '2', name: 'Ensalada Gourmet', description: 'Mix de lechugas frescas con vinagreta de la casa', price: 18000, category: 'Entradas', available: true },
        { id: '3', name: 'Plato Principal', description: 'Nuestro plato estrella preparado con ingredientes premium', price: 45000, category: 'Platos Fuertes', popular: true, available: true },
        { id: '4', name: 'Especialidad de la Casa', description: 'Receta tradicional con un toque moderno', price: 52000, category: 'Platos Fuertes', available: true },
        { id: '5', name: 'Postre del Dia', description: 'Delicia dulce preparada diariamente', price: 15000, category: 'Postres', available: true },
        { id: '6', name: 'Bebida Signature', description: 'Coctel o mocktail de la casa', price: 20000, category: 'Bebidas', available: true },
      ]
    }
    return menuItems
  }

  const displayMenuItems = menuItems.length > 0 ? menuItems : getDefaultMenuItems()

  // Group items by category
  const menuByCategory = displayMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categories = Object.keys(menuByCategory)

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
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
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // WhatsApp URL generator
  const whatsappUrl = (message: string = 'Hola, quiero hacer un pedido') => {
    const phone = business.whatsapp?.replace(/[^0-9]/g, '') || business.phone?.replace(/[^0-9]/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  // Handle reservation submit
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...reservationForm,
      status: 'pending'
    }
    setReservations([...reservations, newReservation])
    setShowReservationModal(false)
    setReservationForm({ name: '', phone: '', date: '', time: '', guests: 2 })
  }

  // Format hours
  const formatHours = () => {
    if (!business.hours) return 'Horario no disponible'
    if (typeof business.hours === 'string') return business.hours
    return Object.entries(business.hours).map(([day, time]) => `${day}: ${time}`).join(' | ')
  }

  // CSS variables style object
  const themeStyle = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--accent-hover': theme.accentHover,
    '--text': theme.text,
    '--text-muted': theme.textMuted,
    '--border': theme.border,
    '--card-bg': theme.cardBg,
  } as React.CSSProperties

  return (
    <div
      className="min-h-screen"
      style={{
        ...themeStyle,
        backgroundColor: theme.primary,
        color: theme.text
      }}
    >
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Header */}
        <header
          className="sticky top-0 z-50 backdrop-blur-md border-b"
          style={{
            backgroundColor: `${theme.primary}ee`,
            borderColor: theme.border
          }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="w-10 h-10 rounded-full object-cover"
                    style={{ borderColor: theme.accent, borderWidth: 2 }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ backgroundColor: theme.accent, color: theme.primary }}
                  >
                    {business.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="font-bold text-sm" style={{ color: theme.text }}>{business.name}</h1>
                  <p className="text-xs" style={{ color: theme.textMuted }}>{business.tagline || business.description}</p>
                </div>
              </div>
              {showAdmin && (
                <button
                  onClick={() => setActiveView(activeView === 'client' ? 'admin' : 'client')}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: theme.secondary }}
                >
                  {activeView === 'client' ? '⚙️' : '👤'}
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          {activeView === 'client' && (
            <nav className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {['menu', 'reservar', 'contacto'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: activeSection === section ? theme.accent : theme.secondary,
                    color: activeSection === section ? theme.primary : theme.text
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          )}
        </header>

        {/* Client View Content */}
        {activeView === 'client' && (
          <main className="px-4 py-6 pb-24">
            {/* Menu Section */}
            {activeSection === 'menu' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📋</span> Menu
                </h2>

                {categories.map(category => (
                  <div
                    key={category}
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 flex items-center justify-between"
                      style={{ borderBottom: `1px solid ${theme.border}` }}
                    >
                      <span className="font-semibold" style={{ color: theme.accent }}>{category}</span>
                      <motion.span
                        animate={{ rotate: expandedCategories.has(category) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {expandedCategories.has(category) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {menuByCategory[category].map(item => (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="p-4 cursor-pointer transition-colors"
                              style={{ borderBottom: `1px solid ${theme.border}` }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{item.name}</h4>
                                    {item.popular && (
                                      <span
                                        className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: theme.accent, color: theme.primary }}
                                      >
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                                    {item.description}
                                  </p>
                                </div>
                                <span
                                  className="font-bold ml-4"
                                  style={{ color: theme.accent }}
                                >
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {/* Reservations Section */}
            {activeSection === 'reservar' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📅</span> Reservaciones
                </h2>

                <div
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: theme.cardBg }}
                >
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        value={reservationForm.name}
                        onChange={e => setReservationForm({...reservationForm, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: theme.secondary,
                          color: theme.text,
                          borderColor: theme.border
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Telefono</label>
                      <input
                        type="tel"
                        value={reservationForm.phone}
                        onChange={e => setReservationForm({...reservationForm, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: theme.secondary,
                          color: theme.text,
                          borderColor: theme.border
                        }}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Fecha</label>
                        <input
                          type="date"
                          value={reservationForm.date}
                          onChange={e => setReservationForm({...reservationForm, date: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: theme.secondary,
                            color: theme.text,
                            borderColor: theme.border
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Hora</label>
                        <input
                          type="time"
                          value={reservationForm.time}
                          onChange={e => setReservationForm({...reservationForm, time: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: theme.secondary,
                            color: theme.text,
                            borderColor: theme.border
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Personas</label>
                      <select
                        value={reservationForm.guests}
                        onChange={e => setReservationForm({...reservationForm, guests: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: theme.secondary,
                          color: theme.text,
                          borderColor: theme.border
                        }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold transition-all hover:scale-105"
                      style={{ backgroundColor: theme.accent, color: theme.primary }}
                    >
                      Confirmar Reserva
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeSection === 'contacto' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📍</span> Contacto
                </h2>

                <div
                  className="p-6 rounded-xl space-y-4"
                  style={{ backgroundColor: theme.cardBg }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-medium">Direccion</p>
                      <p style={{ color: theme.textMuted }}>{business.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="font-medium">Horario</p>
                      <p style={{ color: theme.textMuted }}>{formatHours()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-medium">Telefono</p>
                      <a href={`tel:${business.phone}`} style={{ color: theme.accent }}>{business.phone}</a>
                    </div>
                  </div>

                  {business.rating && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="font-medium">Calificacion</p>
                        <p style={{ color: theme.accent }}>
                          {business.rating} / 5 ({business.reviewCount} reviews)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all hover:scale-105"
                    style={{ backgroundColor: '#25d366' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <span>WhatsApp</span>
                    </div>
                    <span>→</span>
                  </a>

                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all hover:scale-105"
                    style={{ backgroundColor: theme.accent, color: theme.primary }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span>
                      <span>Llamar</span>
                    </div>
                    <span>→</span>
                  </a>

                  {business.instagram && (
                    <a
                      href={business.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📸</span>
                        <span>Instagram</span>
                      </div>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </main>
        )}

        {/* Admin View Content */}
        {activeView === 'admin' && showAdmin && (
          <main className="px-4 py-6">
            <h2 className="text-xl font-bold mb-4">Panel de Administracion</h2>

            {/* Admin Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {(['menu', 'reservations', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAdminTab(tab)}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: adminTab === tab ? theme.accent : theme.secondary,
                    color: adminTab === tab ? theme.primary : theme.text
                  }}
                >
                  {tab === 'menu' && '📋 Menu'}
                  {tab === 'reservations' && '📅 Reservas'}
                  {tab === 'settings' && '⚙️ Config'}
                </button>
              ))}
            </div>

            {/* Admin Menu Tab */}
            {adminTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Items del Menu</h3>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: theme.accent, color: theme.primary }}
                  >
                    + Agregar
                  </button>
                </div>

                {displayMenuItems.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl flex justify-between items-center"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm" style={{ color: theme.textMuted }}>{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: theme.accent }}>{formatPrice(item.price)}</span>
                      <button className="p-2 rounded-lg" style={{ backgroundColor: theme.secondary }}>✏️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Reservations Tab */}
            {adminTab === 'reservations' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Reservaciones</h3>

                {reservations.length === 0 ? (
                  <div
                    className="p-8 rounded-xl text-center"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <p style={{ color: theme.textMuted }}>No hay reservaciones</p>
                  </div>
                ) : (
                  reservations.map(res => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: theme.cardBg }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{res.name}</h4>
                          <p className="text-sm" style={{ color: theme.textMuted }}>
                            {res.date} a las {res.time} - {res.guests} personas
                          </p>
                          <p className="text-sm" style={{ color: theme.textMuted }}>{res.phone}</p>
                        </div>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: res.status === 'confirmed' ? '#22c55e' :
                                           res.status === 'cancelled' ? '#ef4444' : theme.accent,
                            color: theme.primary
                          }}
                        >
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Admin Settings Tab */}
            {adminTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Configuracion del Negocio</h3>

                <div
                  className="p-4 rounded-xl space-y-4"
                  style={{ backgroundColor: theme.cardBg }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre del Negocio</label>
                    <input
                      type="text"
                      defaultValue={business.name}
                      className="w-full px-4 py-3 rounded-lg"
                      style={{ backgroundColor: theme.secondary, color: theme.text }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefono</label>
                    <input
                      type="tel"
                      defaultValue={business.phone}
                      className="w-full px-4 py-3 rounded-lg"
                      style={{ backgroundColor: theme.secondary, color: theme.text }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Direccion</label>
                    <input
                      type="text"
                      defaultValue={business.address}
                      className="w-full px-4 py-3 rounded-lg"
                      style={{ backgroundColor: theme.secondary, color: theme.text }}
                    />
                  </div>

                  <button
                    className="w-full py-3 rounded-lg font-bold"
                    style={{ backgroundColor: theme.accent, color: theme.primary }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </main>
        )}

        {/* Floating CTA */}
        {activeView === 'client' && (
          <div
            className="fixed bottom-0 left-0 right-0 p-4 border-t"
            style={{
              backgroundColor: `${theme.primary}ee`,
              backdropFilter: 'blur(10px)',
              borderColor: theme.border
            }}
          >
            <a
              href={whatsappUrl('Hola, quiero hacer un pedido')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all hover:scale-105"
              style={{ backgroundColor: theme.accent, color: theme.primary }}
            >
              <span>🛒</span> Pedir Ahora
            </a>
          </div>
        )}

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-md rounded-t-3xl p-6"
                style={{ backgroundColor: theme.cardBg }}
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: theme.border }}></div>

                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}

                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                  <span className="text-xl font-bold" style={{ color: theme.accent }}>
                    {formatPrice(selectedItem.price)}
                  </span>
                </div>

                <p className="mb-6" style={{ color: theme.textMuted }}>{selectedItem.description}</p>

                <a
                  href={whatsappUrl(`Hola, quiero pedir: ${selectedItem.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold"
                  style={{ backgroundColor: theme.accent, color: theme.primary }}
                >
                  Pedir por WhatsApp
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Split View */}
      <div className="hidden lg:flex min-h-screen">
        {/* Client Side */}
        <div className="w-1/2 p-8 overflow-y-auto" style={{ backgroundColor: theme.primary }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ borderColor: theme.accent, borderWidth: 3 }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl"
                  style={{ backgroundColor: theme.accent, color: theme.primary }}
                >
                  {business.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p style={{ color: theme.textMuted }}>{business.tagline || business.description}</p>
                {business.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">⭐</span>
                    <span>{business.rating}</span>
                    {business.reviewCount && (
                      <span style={{ color: theme.textMuted }}>({business.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: theme.secondary }}>
                📍 {business.address}
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: theme.secondary }}>
                🕐 {formatHours()}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">📋 Menu</h2>

            {categories.map(category => (
              <div key={category}>
                <h3 className="font-semibold mb-3" style={{ color: theme.accent }}>{category}</h3>
                <div className="grid gap-3">
                  {menuByCategory[category].map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="p-4 rounded-xl cursor-pointer transition-all hover:scale-102"
                      style={{ backgroundColor: theme.cardBg }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.popular && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: theme.accent, color: theme.primary }}
                              >
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: theme.textMuted }}>{item.description}</p>
                        </div>
                        <span className="font-bold" style={{ color: theme.accent }}>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold"
              style={{ backgroundColor: '#25d366' }}
            >
              💬 WhatsApp
            </a>
            <a
              href={`tel:${business.phone}`}
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold"
              style={{ backgroundColor: theme.accent, color: theme.primary }}
            >
              📞 Llamar
            </a>
          </div>
        </div>

        {/* Admin Side */}
        {showAdmin && (
          <div className="w-1/2 p-8 overflow-y-auto" style={{ backgroundColor: theme.secondary }}>
            <h2 className="text-xl font-bold mb-6">⚙️ Panel de Administracion</h2>

            {/* Admin Tabs */}
            <div className="flex gap-2 mb-6">
              {(['menu', 'reservations', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAdminTab(tab)}
                  className="px-6 py-3 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: adminTab === tab ? theme.accent : theme.cardBg,
                    color: adminTab === tab ? theme.primary : theme.text
                  }}
                >
                  {tab === 'menu' && '📋 Menu'}
                  {tab === 'reservations' && '📅 Reservas'}
                  {tab === 'settings' && '⚙️ Config'}
                </button>
              ))}
            </div>

            {/* Admin Content */}
            <div className="rounded-xl p-6" style={{ backgroundColor: theme.cardBg }}>
              {adminTab === 'menu' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Items del Menu</h3>
                    <button
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ backgroundColor: theme.accent, color: theme.primary }}
                    >
                      + Agregar Item
                    </button>
                  </div>

                  {displayMenuItems.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg flex justify-between items-center"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm" style={{ color: theme.textMuted }}>
                          {item.category} - {item.available !== false ? 'Disponible' : 'Agotado'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ color: theme.accent }}>{formatPrice(item.price)}</span>
                        <button className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: theme.cardBg }}>✏️</button>
                        <button className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: '#ef4444' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {adminTab === 'reservations' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Reservaciones del Dia</h3>

                  {reservations.length === 0 ? (
                    <div className="text-center py-8" style={{ color: theme.textMuted }}>
                      No hay reservaciones pendientes
                    </div>
                  ) : (
                    reservations.map(res => (
                      <div
                        key={res.id}
                        className="p-4 rounded-lg flex justify-between items-center"
                        style={{ backgroundColor: theme.secondary }}
                      >
                        <div>
                          <h4 className="font-medium">{res.name}</h4>
                          <p className="text-sm" style={{ color: theme.textMuted }}>
                            {res.date} - {res.time} - {res.guests} personas
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded text-sm"
                            style={{ backgroundColor: '#22c55e' }}
                          >
                            Confirmar
                          </button>
                          <button
                            className="px-3 py-1 rounded text-sm"
                            style={{ backgroundColor: '#ef4444' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {adminTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="font-semibold">Configuracion General</h3>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre del Negocio</label>
                      <input
                        type="text"
                        defaultValue={business.name}
                        className="w-full px-4 py-3 rounded-lg"
                        style={{ backgroundColor: theme.secondary, color: theme.text }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Descripcion</label>
                      <textarea
                        defaultValue={business.description}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg resize-none"
                        style={{ backgroundColor: theme.secondary, color: theme.text }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Telefono</label>
                        <input
                          type="tel"
                          defaultValue={business.phone}
                          className="w-full px-4 py-3 rounded-lg"
                          style={{ backgroundColor: theme.secondary, color: theme.text }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">WhatsApp</label>
                        <input
                          type="tel"
                          defaultValue={business.whatsapp}
                          className="w-full px-4 py-3 rounded-lg"
                          style={{ backgroundColor: theme.secondary, color: theme.text }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Direccion</label>
                      <input
                        type="text"
                        defaultValue={business.address}
                        className="w-full px-4 py-3 rounded-lg"
                        style={{ backgroundColor: theme.secondary, color: theme.text }}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full py-4 rounded-xl font-bold"
                    style={{ backgroundColor: theme.accent, color: theme.primary }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4" style={{ color: theme.textMuted }}>
        <p className="text-xs">Hecho con Digitaliza</p>
      </div>
    </div>
  )
}
