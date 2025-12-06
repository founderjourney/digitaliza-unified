'use client'

import { useState, useEffect } from 'react'

interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: string
  notes?: string
  adminNotes?: string
  menuItem: {
    id: string
    name: string
    price: number
    category: string
  }
  createdAt: string
}

interface AppointmentsListProps {
  restaurantId: string
  accentColor?: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  confirmed: { label: 'Confirmada', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  in_progress: { label: 'En progreso', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  completed: { label: 'Completada', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelada', color: 'text-red-700', bgColor: 'bg-red-100' },
  no_show: { label: 'No asistió', color: 'text-gray-700', bgColor: 'bg-gray-100' },
}

export function AppointmentsList({ restaurantId, accentColor = '#3B82F6' }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadAppointments()
  }, [restaurantId, filter, dateFilter])

  const loadAppointments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ restaurantId })
      if (filter !== 'all') params.append('status', filter)
      if (dateFilter) params.append('date', dateFilter)

      const res = await fetch(`/api/appointments?${params}`)
      const data = await res.json()

      if (res.ok) {
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setAppointments(prev =>
          prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
        )
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleWhatsApp = (apt: Appointment, message: string) => {
    const phone = apt.customerPhone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">Todas las citas</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
        <button
          onClick={loadAppointments}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ backgroundColor: accentColor }}
        >
          Actualizar
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">📅</span>
          <p>No hay citas para esta fecha</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const statusConfig = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending

            return (
              <div key={apt.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(apt.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{apt.startTime}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-600">{apt.endTime}</span>
                      <span className="text-xs text-gray-500">({apt.duration} min)</span>
                    </div>

                    <div className="mt-2">
                      <p className="font-medium">{apt.customerName}</p>
                      <p className="text-sm text-gray-500">{apt.customerPhone}</p>
                    </div>

                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium">{apt.menuItem.name}</p>
                      <p className="text-sm text-gray-500">${apt.menuItem.price.toFixed(2)}</p>
                    </div>

                    {apt.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">📝 {apt.notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateStatus(apt.id, 'confirmed')
                            handleWhatsApp(apt, `¡Hola ${apt.customerName}! Tu cita para ${apt.menuItem.name} el ${formatDate(apt.date)} a las ${apt.startTime} ha sido CONFIRMADA. ¡Te esperamos!`)
                          }}
                          className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                        >
                          ✓ Confirmar
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          ✗ Cancelar
                        </button>
                      </>
                    )}

                    {apt.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateStatus(apt.id, 'in_progress')}
                          className="px-3 py-1.5 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600"
                        >
                          ▶ Iniciar
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'no_show')}
                          className="px-3 py-1.5 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600"
                        >
                          No asistió
                        </button>
                      </>
                    )}

                    {apt.status === 'in_progress' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'completed')}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                      >
                        ✓ Completar
                      </button>
                    )}

                    <button
                      onClick={() => handleWhatsApp(apt, `Hola ${apt.customerName}, respecto a tu cita del ${formatDate(apt.date)} a las ${apt.startTime}...`)}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      📱 WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
