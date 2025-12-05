'use client'

import { motion } from 'framer-motion'

interface Service {
  id: string
  name: string
  price: number
  description?: string
  duration?: string
  available?: boolean
}

interface SalonBellezaTemplateProps {
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
  services?: Service[]
}

export default function SalonBellezaTemplate({ business, services = [] }: SalonBellezaTemplateProps) {
  const whatsappUrl = (message: string = 'Hola, quiero agendar una cita') => {
    const phone = business.whatsapp?.replace(/[^0-9]/g, '') || business.phone?.replace(/[^0-9]/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const defaultServices: Service[] = [
    { id: '1', name: 'Corte de Cabello', price: 45000, duration: '45 min', available: true },
    { id: '2', name: 'Tinte Completo', price: 120000, duration: '120 min', available: true },
    { id: '3', name: 'Mechas/Balayage', price: 180000, duration: '180 min', available: true },
    { id: '4', name: 'Manicure', price: 35000, duration: '45 min', available: true },
    { id: '5', name: 'Pedicure', price: 45000, duration: '60 min', available: true },
    { id: '6', name: 'Maquillaje Profesional', price: 80000, duration: '60 min', available: false },
  ]

  const displayServices = services.length > 0 ? services : defaultServices
  const availableServices = displayServices.filter(s => s.available !== false)
  const unavailableServices = displayServices.filter(s => s.available === false)

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-900 via-rose-800 to-fuchsia-800">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-pink-400 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center border-4 border-white/20">
              <span className="text-4xl">💅</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white mb-1">{business.name}</h1>
          <p className="text-pink-200 text-sm mb-3">{business.description || 'Salón de Belleza'}</p>
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
          <a href="#servicios" className="flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">💇</span><span className="text-white font-medium">Ver Servicios</span></div>
            <span className="text-white/50 group-hover:text-pink-400">→</span>
          </a>
          <a href={whatsappUrl('Hola, quiero agendar una cita para [servicio]')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-pink-600 hover:bg-pink-500 rounded-xl transition-all group">
            <div className="flex items-center gap-3"><span className="text-2xl">📅</span><span className="text-white font-bold">Reservar Cita</span></div>
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

        <motion.div id="servicios" className="bg-white/10 rounded-2xl p-5 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>💅</span>Servicios</h2>
          <div className="space-y-3">
            {availableServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{service.name}</h3>
                  {service.duration && <p className="text-pink-300/60 text-xs">{service.duration}</p>}
                </div>
                <span className="text-pink-400 font-bold">{formatPrice(service.price)}</span>
              </div>
            ))}
            {unavailableServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg opacity-50">
                <div>
                  <h3 className="text-white/70 font-medium">{service.name}</h3>
                  <span className="text-red-400 text-xs">No disponible</span>
                </div>
                <span className="text-gray-500 font-bold line-through">{formatPrice(service.price)}</span>
              </div>
            ))}
          </div>
          <a href={whatsappUrl('Hola, quiero agendar una cita')} target="_blank" rel="noopener noreferrer" className="mt-4 w-full block text-center p-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all">Reservar Ahora</a>
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
