'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ReservationFormProps {
  slug: string
  restaurantName: string
  whatsapp: string
  isOpen: boolean
  onClose: () => void
  accentColor?: string
}

export default function ReservationForm({
  slug,
  restaurantName,
  whatsapp,
  isOpen,
  onClose,
  accentColor = '#1a1a1a',
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/restaurants/${slug}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setIsSuccess(true)

        // Abrir WhatsApp con la confirmación
        if (data.whatsappUrl) {
          setTimeout(() => {
            window.open(data.whatsappUrl, '_blank')
          }, 1500)
        }
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppDirect = () => {
    const message = encodeURIComponent(
      `¡Hola ${restaurantName}! 📅\n\n` +
      `Me gustaría hacer una reserva:\n` +
      `• Nombre: ${formData.name || '___'}\n` +
      `• Fecha: ${formData.date || '___'}\n` +
      `• Hora: ${formData.time || '___'}\n` +
      `• Personas: ${formData.guests}\n` +
      (formData.notes ? `• Notas: ${formData.notes}\n` : '') +
      `\n¡Gracias!`
    )
    const phone = whatsapp.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    onClose()
  }

  // Generar opciones de hora
  const timeOptions = []
  for (let h = 12; h <= 23; h++) {
    timeOptions.push(`${h}:00`)
    timeOptions.push(`${h}:30`)
  }

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {isSuccess ? (
            /* Success State */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                ✅
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Reserva Enviada!
              </h3>
              <p className="text-gray-600 mb-6">
                Te contactaremos por WhatsApp para confirmar tu reserva.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div
                className="px-6 py-4 text-white"
                style={{ backgroundColor: accentColor }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Hacer Reserva</h3>
                    <p className="text-white/80 text-sm">{restaurantName}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora *
                    </label>
                    <select
                      required
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar</option>
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personas *
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: Math.max(1, formData.guests - 1) })}
                      className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-gray-900">
                      {formData.guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: Math.min(20, formData.guests + 1) })}
                      className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Alergias, ocasión especial, etc."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full py-4 rounded-xl font-semibold text-white transition-all',
                      isSubmitting ? 'opacity-70' : 'hover:opacity-90'
                    )}
                    style={{ backgroundColor: accentColor }}
                  >
                    {isSubmitting ? 'Enviando...' : '📅 Confirmar Reserva'}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full py-4 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    💬 Reservar por WhatsApp
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
