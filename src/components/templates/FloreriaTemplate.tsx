'use client'

import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  category: string
  available?: boolean
}

interface FloreriaTemplateProps {
  business: {
    name: string
    description?: string
    phone: string
    whatsapp: string
    address: string
    hours: string
    instagram?: string
    rating?: number
    reviewCount?: number
    logoUrl?: string
  }
  products?: Product[]
}

export default function FloreriaTemplate({ business, products = [] }: FloreriaTemplateProps) {
  const whatsappUrl = (message: string = 'Hola, quiero hacer un pedido de flores') => {
    const phone = business.whatsapp?.replace(/[^0-9]/g, '') || business.phone?.replace(/[^0-9]/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const defaultProducts: Product[] = [
    { id: '1', name: 'Ramo de Rosas (12)', price: 85000, category: 'Ramos', available: true },
    { id: '2', name: 'Ramo Mixto Primavera', price: 65000, category: 'Ramos', available: true },
    { id: '3', name: 'Girasoles (6)', price: 55000, category: 'Ramos', available: true },
    { id: '4', name: 'Orquídea en Maceta', price: 120000, category: 'Plantas', available: true },
    { id: '5', name: 'Suculentas Set x3', price: 45000, category: 'Plantas', available: true },
    { id: '6', name: 'Corona Fúnebre', price: 180000, category: 'Especiales', available: false },
  ]

  const displayProducts = products.length > 0 ? products : defaultProducts
  const productsByCategory = displayProducts.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, Product[]>)

  const categoryEmojis: Record<string, string> = {
    'Ramos': '💐',
    'Plantas': '🌱',
    'Especiales': '🎀',
    'Arreglos': '🌸',
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-800 via-rose-700 to-purple-800">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-pink-400 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center border-4 border-white/20">
              <span className="text-4xl">🌸</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white mb-1">{business.name}</h1>
          <p className="text-pink-200 text-sm mb-3">{business.description || 'Floristería & Regalos'}</p>
          <div className="text-sm"><span className="text-pink-100 flex items-center justify-center gap-1"><span>📍</span>{business.address}</span></div>
          {business.rating && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-white font-medium">{business.rating}</span>
              {business.reviewCount && <span className="text-pink-200">({business.reviewCount} reviews)</span>}
            </div>
          )}
        </motion.div>

        <motion.div className="space-y-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <a href="#catalogo" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">💐</span><span className="text-white font-medium">Ver Catálogo</span></div>
            <span className="text-white/50 group-hover:text-pink-400">→</span>
          </a>
          <a href={whatsappUrl('Hola, quiero encargar un arreglo floral para [ocasión]')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-pink-600 hover:bg-pink-500 rounded-xl transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">🎁</span><span className="text-white font-bold">Hacer Pedido</span></div>
            <span className="text-pink-200 group-hover:text-white">→</span>
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">💬</span><span className="text-white font-medium">WhatsApp</span></div>
            <span className="text-green-200 group-hover:text-white">→</span>
          </a>
          <a href={`tel:${business.phone}`} className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">📞</span><span className="text-white font-medium">Llamar</span></div>
            <span className="text-white/50 group-hover:text-pink-400">→</span>
          </a>
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl transition-all group">
              <div className="flex items-center gap-3"><span className="text-2xl">📸</span><span className="text-white font-medium">Instagram</span></div>
              <span className="text-white/70 group-hover:text-white">→</span>
            </a>
          )}
        </motion.div>

        <motion.div id="catalogo" className="bg-white/10 rounded-2xl p-5 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🌷</span>Catálogo</h2>
          <div className="space-y-6">
            {Object.entries(productsByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-pink-400 font-semibold mb-3 flex items-center gap-2"><span>{categoryEmojis[category] || '🌺'}</span>{category}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${item.available !== false ? 'bg-white/5' : 'bg-white/5 opacity-50'}`}>
                      <div>
                        <h4 className="text-white font-medium text-sm">{item.name}{item.available === false && <span className="ml-2 text-red-400 text-xs">(Agotado)</span>}</h4>
                        {item.description && <p className="text-pink-300/60 text-xs">{item.description}</p>}
                      </div>
                      <span className={`font-bold text-sm ${item.available !== false ? 'text-pink-400' : 'text-gray-500 line-through'}`}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href={whatsappUrl('Hola, quiero hacer un pedido')} target="_blank" rel="noopener noreferrer" className="mt-6 w-full block text-center p-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all">Pedir Ahora</a>
        </motion.div>

        <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-pink-200/70 text-sm flex items-center justify-center gap-2"><span>🕒</span>{business.hours}</p>
        </motion.div>
        <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <p className="text-white/30 text-xs">Hecho con Digitaliza</p>
        </motion.div>
      </div>
    </div>
  )
}
