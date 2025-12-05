'use client'

import { motion } from 'framer-motion'

interface Service {
  id: string
  name: string
  price: number
  description?: string
  available?: boolean
}

interface BarberiaTemplateProps {
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

export default function BarberiaTemplate({
  business,
  services = []
}: BarberiaTemplateProps) {

  const whatsappUrl = (message: string = 'Hola, quiero agendar una cita') => {
    const phone = business.whatsapp?.replace(/[^0-9]/g, '') || business.phone?.replace(/[^0-9]/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  // Default services if none provided
  const defaultServices: Service[] = [
    { id: '1', name: 'Corte Clásico', price: 15000, available: true },
    { id: '2', name: 'Corte + Barba', price: 25000, available: true },
    { id: '3', name: 'Afeitado Completo', price: 12000, available: true },
    { id: '4', name: 'Diseño de Cejas', price: 8000, available: true },
    { id: '5', name: 'Tratamiento Capilar', price: 20000, available: false },
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  // Group services by availability
  const availableServices = displayServices.filter(s => s.available !== false)
  const unavailableServices = displayServices.filter(s => s.available === false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <div className="max-w-md mx-auto px-4 py-8">

        {/* Header / Logo */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-500 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-4 border-amber-400">
              <span className="text-4xl">💈</span>
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mb-1">
            {business.name}
          </h1>

          <p className="text-stone-400 text-sm mb-3">
            {business.description || 'Barbería Premium'}
          </p>

          {/* Location & Rating */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-stone-400 flex items-center gap-1">
              <span>📍</span>
              {business.address}
            </span>
          </div>

          {business.rating && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-amber-500">⭐</span>
              <span className="text-white font-medium">{business.rating}</span>
              {business.reviewCount && (
                <span className="text-stone-500">({business.reviewCount} reviews)</span>
              )}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Ver Servicios */}
          <a
            href="#servicios"
            className="flex items-center justify-between w-full p-4 bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✂️</span>
              <span className="text-white font-medium">Ver Servicios</span>
            </div>
            <span className="text-stone-500 group-hover:text-amber-500 transition-colors">→</span>
          </a>

          {/* Reservar Cita */}
          <a
            href={whatsappUrl('Hola, quiero reservar una cita')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-4 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <span className="text-stone-900 font-bold">Reservar Cita</span>
            </div>
            <span className="text-stone-700 group-hover:text-stone-900 transition-colors">→</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <span className="text-white font-medium">WhatsApp</span>
            </div>
            <span className="text-green-300 group-hover:text-white transition-colors">→</span>
          </a>

          {/* Llamar */}
          <a
            href={`tel:${business.phone}`}
            className="flex items-center justify-between w-full p-4 bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <span className="text-white font-medium">Llamar</span>
            </div>
            <span className="text-stone-500 group-hover:text-amber-500 transition-colors">→</span>
          </a>

          {/* Instagram */}
          {business.instagram && (
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <span className="text-white font-medium">Instagram</span>
              </div>
              <span className="text-white/70 group-hover:text-white transition-colors">→</span>
            </a>
          )}
        </motion.div>

        {/* Services Preview */}
        <motion.div
          id="servicios"
          className="bg-stone-800/50 rounded-2xl p-5 border border-stone-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>✂️</span>
            Servicios
          </h2>

          <div className="space-y-3">
            {availableServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 bg-stone-900/50 rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium">{service.name}</h3>
                  {service.description && (
                    <p className="text-stone-500 text-sm">{service.description}</p>
                  )}
                </div>
                <span className="text-amber-500 font-bold">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}

            {unavailableServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 bg-stone-900/30 rounded-lg opacity-50"
              >
                <div>
                  <h3 className="text-stone-400 font-medium">{service.name}</h3>
                  <span className="text-red-400 text-xs">No disponible</span>
                </div>
                <span className="text-stone-500 font-bold line-through">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href={whatsappUrl('Hola, quiero reservar una cita')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full block text-center p-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-all"
          >
            Reservar Ahora
          </a>
        </motion.div>

        {/* Hours */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
            <span>🕒</span>
            {business.hours}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-stone-600 text-xs">
            Hecho con Digitaliza
          </p>
        </motion.div>
      </div>
    </div>
  )
}
