'use client'

import { useState, useEffect } from 'react'

interface MenuItem {
  id: string
  name: string
  price: number
  duration?: number
  category?: string
}

interface TimeSlot {
  time: string
  endTime: string
  available: boolean
  reason?: string | null
}

interface AvailabilityData {
  date: string
  isOpen: boolean
  slots: TimeSlot[]
  openTime?: string
  closeTime?: string
  message?: string
}

interface AppointmentModalProps {
  service: MenuItem
  isOpen: boolean
  onClose: () => void
  restaurantId: string
  restaurantName: string
  restaurantWhatsApp: string
  accentColor?: string
}

export function AppointmentModal({
  service,
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  restaurantWhatsApp,
  accentColor = '#3B82F6',
}: AppointmentModalProps) {
  const [step, setStep] = useState<'date' | 'time' | 'info' | 'confirm'>('date')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Generar fechas disponibles (próximos 14 días)
  const getAvailableDates = () => {
    const dates: { value: string; label: string; dayName: string }[] = []
    const today = new Date()
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const value = date.toISOString().split('T')[0]
      const dayName = dayNames[date.getDay()]
      const label = `${date.getDate()} ${monthNames[date.getMonth()]}`
      dates.push({ value, label, dayName })
    }
    return dates
  }

  const availableDates = getAvailableDates()

  // Cargar disponibilidad cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      loadAvailability()
    }
  }, [selectedDate])

  const loadAvailability = async () => {
    setIsLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        restaurantId,
        date: selectedDate,
        menuItemId: service.id,
      })
      const res = await fetch(`/api/appointments/availability?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al cargar disponibilidad')
        return
      }

      setAvailability(data)
    } catch {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          menuItemId: service.id,
          customerName,
          customerPhone,
          date: selectedDate,
          startTime: selectedTime,
          notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al agendar cita')
        return
      }

      // Éxito - ir a confirmación
      setStep('confirm')
    } catch {
      setError('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppConfirm = () => {
    const message = encodeURIComponent(
      `¡Hola! He agendado una cita:\n\n` +
      `📍 ${restaurantName}\n` +
      `✂️ Servicio: ${service.name}\n` +
      `💰 Precio: $${service.price.toFixed(2)}\n` +
      `📅 Fecha: ${selectedDate}\n` +
      `🕐 Hora: ${selectedTime}\n` +
      `👤 Nombre: ${customerName}\n` +
      (notes ? `📝 Notas: ${notes}\n` : '') +
      `\n¡Espero su confirmación!`
    )
    window.open(`https://wa.me/${restaurantWhatsApp.replace(/\D/g, '')}?text=${message}`, '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: accentColor }}
          >
            <div>
              <h2 className="font-bold text-lg">Agendar Cita</h2>
              <p className="text-sm text-white/80">{service.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {['date', 'time', 'info', 'confirm'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step === s
                        ? 'text-white'
                        : ['date', 'time', 'info', 'confirm'].indexOf(step) > i
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={{
                      backgroundColor:
                        step === s || ['date', 'time', 'info', 'confirm'].indexOf(step) > i
                          ? accentColor
                          : undefined,
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Select Date */}
            {step === 'date' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Selecciona una fecha</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value)
                        setSelectedTime('')
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedDate === date.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: selectedDate === date.value ? accentColor : undefined,
                        backgroundColor: selectedDate === date.value ? `${accentColor}10` : undefined,
                      }}
                    >
                      <div className="text-xs text-gray-500">{date.dayName}</div>
                      <div className="font-semibold">{date.label}</div>
                    </button>
                  ))}
                </div>
                {selectedDate && (
                  <button
                    onClick={() => setStep('time')}
                    className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  >
                    Continuar
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Select Time */}
            {step === 'time' && (
              <div>
                <button
                  onClick={() => setStep('date')}
                  className="mb-4 text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
                >
                  ← Cambiar fecha
                </button>
                <h3 className="text-lg font-semibold mb-4">
                  Horarios disponibles para {selectedDate}
                </h3>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} />
                  </div>
                ) : availability && !availability.isOpen ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">😔</span>
                    <p>{availability.message || 'No hay horarios disponibles este día'}</p>
                  </div>
                ) : availability ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availability.slots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50'
                            : slot.available
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        style={{
                          borderColor: selectedTime === slot.time ? accentColor : undefined,
                          backgroundColor: selectedTime === slot.time ? `${accentColor}10` : undefined,
                        }}
                      >
                        <div className="font-semibold">{slot.time}</div>
                        {!slot.available && (
                          <div className="text-xs text-gray-400">
                            {slot.reason === 'past' ? 'Pasado' : 'Ocupado'}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : null}

                {selectedTime && (
                  <button
                    onClick={() => setStep('info')}
                    className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  >
                    Continuar
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Customer Info */}
            {step === 'info' && (
              <div>
                <button
                  onClick={() => setStep('time')}
                  className="mb-4 text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
                >
                  ← Cambiar horario
                </button>
                <h3 className="text-lg font-semibold mb-4">Tus datos</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Alguna preferencia o indicación especial..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumen de tu cita</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>✂️ {service.name}</p>
                    <p>💰 ${service.price.toFixed(2)}</p>
                    <p>📅 {selectedDate}</p>
                    <p>🕐 {selectedTime} ({service.duration || 30} min)</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !customerName || !customerPhone}
                  className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  {isSubmitting ? 'Agendando...' : 'Confirmar Cita'}
                </button>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirm' && (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Cita Agendada!</h3>
                <p className="text-gray-600 mb-6">
                  Tu cita ha sido registrada. El negocio te contactará para confirmar.
                </p>

                <div className="p-4 bg-gray-50 rounded-lg text-left mb-6">
                  <div className="space-y-2 text-sm">
                    <p><strong>Servicio:</strong> {service.name}</p>
                    <p><strong>Fecha:</strong> {selectedDate}</p>
                    <p><strong>Hora:</strong> {selectedTime}</p>
                    <p><strong>Precio:</strong> ${service.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppConfirm}
                    className="w-full py-3 rounded-xl bg-green-500 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <span>📱</span> Confirmar por WhatsApp
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
