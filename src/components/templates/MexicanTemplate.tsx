'use client'

import { motion } from 'framer-motion'

interface MenuItem {
  id: string
  name: string
  price: string | number
  description?: string
  category: string
  available?: boolean
}

interface MexicanTemplateProps {
  restaurant: {
    name: string
    description?: string
    phone: string
    whatsapp: string
    address: string
    hours?: string | Record<string, string>
    logoUrl?: string
    rating?: number
    reviewCount?: number
    instagram?: string
  }
  menuItems?: MenuItem[]
}

export default function MexicanTemplate({
  restaurant,
  menuItems = []
}: MexicanTemplateProps) {

  const whatsappUrl = (message: string = '¡Hola! Quiero hacer una reservación') => {
    const phone = restaurant.whatsapp?.replace(/[^0-9]/g, '') || restaurant.phone?.replace(/[^0-9]/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const defaultMenuItems: MenuItem[] = [
    { id: '1', name: 'Guacamole con Totopos', price: 25000, category: 'Entradas', available: true },
    { id: '2', name: 'Nachos Supreme', price: 32000, category: 'Entradas', available: true },
    { id: '3', name: 'Tacos al Pastor (3)', price: 28000, category: 'Tacos', available: true },
    { id: '4', name: 'Tacos de Carnitas (3)', price: 30000, category: 'Tacos', available: true },
    { id: '5', name: 'Burrito de Carne', price: 35000, category: 'Platos Fuertes', available: true },
    { id: '6', name: 'Enchiladas Verdes', price: 38000, category: 'Platos Fuertes', available: false },
    { id: '7', name: 'Margarita Clásica', price: 22000, category: 'Bebidas', available: true },
  ]

  const displayMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems

  const menuByCategory = displayMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categoryEmojis: Record<string, string> = {
    'Entradas': '🥑',
    'Tacos': '🌮',
    'Platos Fuertes': '🍛',
    'Bebidas': '🍹',
    'Postres': '🍮',
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(numPrice)
  }

  const formatHours = () => {
    if (!restaurant.hours) return 'Lun-Dom: 12:00pm - 11:00pm'
    if (typeof restaurant.hours === 'string') return restaurant.hours
    return Object.entries(restaurant.hours).map(([day, time]) => `${day}: ${time}`).join(' | ')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 via-red-700 to-amber-600">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt={restaurant.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-400 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center border-4 border-white/20">
              <span className="text-4xl">🌮</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white mb-1">{restaurant.name}</h1>
          <p className="text-amber-200 text-sm mb-3">{restaurant.description || 'Auténtica Cocina Mexicana'}</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-amber-100 flex items-center gap-1"><span>📍</span>{restaurant.address}</span>
          </div>
          {restaurant.rating && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-white font-medium">{restaurant.rating}</span>
              {restaurant.reviewCount && <span className="text-amber-200">({restaurant.reviewCount} reviews)</span>}
            </div>
          )}
        </motion.div>

        <motion.div className="space-y-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <a href="#menu" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">🌮</span><span className="text-white font-medium">Ver Menú</span></div>
            <span className="text-white/50 group-hover:text-amber-400 transition-colors">→</span>
          </a>
          <a href={whatsappUrl('¡Hola! Quiero reservar mesa para [personas] el [fecha] a las [hora]')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-red-600 hover:bg-red-500 rounded-xl transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">📅</span><span className="text-white font-bold">Reservar Mesa</span></div>
            <span className="text-red-200 group-hover:text-white transition-colors">→</span>
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">💬</span><span className="text-white font-medium">WhatsApp</span></div>
            <span className="text-green-200 group-hover:text-white transition-colors">→</span>
          </a>
          <a href={`tel:${restaurant.phone}`} className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">📞</span><span className="text-white font-medium">Llamar</span></div>
            <span className="text-white/50 group-hover:text-amber-400 transition-colors">→</span>
          </a>
          {restaurant.instagram && (
            <a href={restaurant.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl transition-all group">
              <div className="flex items-center gap-3"><span className="text-2xl">📸</span><span className="text-white font-medium">Instagram</span></div>
              <span className="text-white/70 group-hover:text-white transition-colors">→</span>
            </a>
          )}
        </motion.div>

        <motion.div id="menu" className="bg-white/10 rounded-2xl p-5 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📋</span>Menú</h2>
          <div className="space-y-6">
            {Object.entries(menuByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2"><span>{categoryEmojis[category] || '🍽️'}</span>{category}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${item.available !== false ? 'bg-white/5' : 'bg-white/5 opacity-50'}`}>
                      <div>
                        <h4 className="text-white font-medium text-sm">{item.name}{item.available === false && <span className="ml-2 text-red-400 text-xs">(Agotado)</span>}</h4>
                        {item.description && <p className="text-amber-200/60 text-xs">{item.description}</p>}
                      </div>
                      <span className={`font-bold text-sm ${item.available !== false ? 'text-amber-400' : 'text-gray-500 line-through'}`}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href={whatsappUrl('¡Hola! Quiero reservar mesa')} target="_blank" rel="noopener noreferrer" className="mt-6 w-full block text-center p-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all">Reservar Ahora</a>
        </motion.div>

        <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-amber-200/70 text-sm flex items-center justify-center gap-2"><span>🕒</span>{formatHours()}</p>
        </motion.div>
        <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <p className="text-white/30 text-xs">Hecho con Digitaliza</p>
        </motion.div>
      </div>
    </div>
  )
}
