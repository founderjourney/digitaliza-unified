'use client'

import { useState, useEffect } from 'react'
import { Button, Spinner } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Reservation } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Confirmada', color: 'text-green-700', bg: 'bg-green-100' },
  completed: { label: 'Completada', color: 'text-blue-700', bg: 'bg-blue-100' },
  cancelled: { label: 'Cancelada', color: 'text-red-700', bg: 'bg-red-100' },
}

interface ReservationsManagerProps {
  slug: string
  isOpen: boolean
  onClose: () => void
}

export default function ReservationsManager({ slug, isOpen, onClose }: ReservationsManagerProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // Cargar reservas
  useEffect(() => {
    if (isOpen) {
      fetchReservations()
    }
  }, [isOpen, slug, filterStatus, filterDate])

  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterDate) params.append('date', filterDate)

      const res = await fetch(`/api/restaurants/${slug}/reservations?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setReservations(reservations.map(r =>
          r.id === id ? { ...r, status: newStatus as Reservation['status'] } : r
        ))
        if (selectedReservation?.id === id) {
          setSelectedReservation({ ...selectedReservation, status: newStatus as Reservation['status'] })
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return

    try {
      const res = await fetch(`/api/restaurants/${slug}/reservations/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setReservations(reservations.filter(r => r.id !== id))
        if (selectedReservation?.id === id) {
          setSelectedReservation(null)
        }
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const formatDateFull = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const openWhatsApp = (reservation: Reservation) => {
    const message = encodeURIComponent(
      `Hola ${reservation.name}, confirmamos tu reserva para ${formatDateFull(reservation.date)} a las ${reservation.time} para ${reservation.guests} persona(s). ¡Te esperamos!`
    )
    const phone = reservation.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  // Estadísticas
  const stats = {
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    today: reservations.filter(r => {
      const today = new Date().toDateString()
      return new Date(r.date).toDateString() === today
    }).length,
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reservas</h2>
            <div className="flex gap-3 text-sm mt-1">
              <span className="text-yellow-600">{stats.pending} pendientes</span>
              <span className="text-green-600">{stats.confirmed} confirmadas</span>
              <span className="text-blue-600">{stats.today} hoy</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 p-4 border-b bg-gray-50">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : selectedReservation ? (
            /* Reservation Detail */
            <div className="p-4">
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-blue-600 text-sm mb-4 flex items-center gap-1"
              >
                ← Volver a la lista
              </button>

              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedReservation.name}</h3>
                    <p className="text-gray-600">{selectedReservation.phone}</p>
                    {selectedReservation.email && (
                      <p className="text-gray-500 text-sm">{selectedReservation.email}</p>
                    )}
                  </div>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    STATUS_CONFIG[selectedReservation.status].bg,
                    STATUS_CONFIG[selectedReservation.status].color
                  )}>
                    {STATUS_CONFIG[selectedReservation.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  <div className="text-center">
                    <p className="text-2xl">📅</p>
                    <p className="font-medium">{formatDate(selectedReservation.date)}</p>
                    <p className="text-sm text-gray-500">Fecha</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl">🕐</p>
                    <p className="font-medium">{selectedReservation.time}</p>
                    <p className="text-sm text-gray-500">Hora</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl">👥</p>
                    <p className="font-medium">{selectedReservation.guests}</p>
                    <p className="text-sm text-gray-500">Personas</p>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Notas:</p>
                    <p className="text-gray-700">{selectedReservation.notes}</p>
                  </div>
                )}

                {/* Status buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedReservation.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusChange(selectedReservation.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✓ Confirmar
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(selectedReservation.id, 'cancelled')}
                        variant="secondary"
                        className="text-red-600 border-red-200"
                      >
                        ✕ Cancelar
                      </Button>
                    </>
                  )}
                  {selectedReservation.status === 'confirmed' && (
                    <>
                      <Button
                        onClick={() => handleStatusChange(selectedReservation.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        ✓ Completar
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(selectedReservation.id, 'cancelled')}
                        variant="secondary"
                        className="text-red-600 border-red-200"
                      >
                        ✕ Cancelar
                      </Button>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => openWhatsApp(selectedReservation)}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    💬 WhatsApp
                  </Button>
                  <Button
                    onClick={() => window.open(`tel:${selectedReservation.phone}`, '_self')}
                    variant="secondary"
                    className="flex-1"
                  >
                    📞 Llamar
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedReservation.id)}
                    variant="secondary"
                    className="text-red-600"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Reservations List */
            <div className="divide-y">
              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-4">📅</p>
                  <p className="text-gray-500">No hay reservas</p>
                  {filterStatus !== 'all' || filterDate ? (
                    <p className="text-sm text-gray-400 mt-2">
                      Intenta cambiar los filtros
                    </p>
                  ) : null}
                </div>
              ) : (
                reservations.map(reservation => (
                  <button
                    key={reservation.id}
                    onClick={() => setSelectedReservation(reservation)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    {/* Date badge */}
                    <div className="w-14 text-center flex-shrink-0">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="text-xs text-gray-500 uppercase">
                          {new Date(reservation.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(reservation.date).getDate()}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{reservation.name}</p>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                          STATUS_CONFIG[reservation.status].bg,
                          STATUS_CONFIG[reservation.status].color
                        )}>
                          {STATUS_CONFIG[reservation.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>🕐 {reservation.time}</span>
                        <span>👥 {reservation.guests}</span>
                        <span className="truncate">📞 {reservation.phone}</span>
                      </div>
                    </div>

                    <span className="text-gray-400">→</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
