'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  category?: string
  duration?: number // Para servicios
  available: boolean
}

interface ItemDetailModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  businessMode: 'restaurant' | 'services' | 'store' | 'mixed'
  restaurantId: string
  restaurantSlug: string
  accentColor?: string
  onScheduleAppointment?: (item: MenuItem) => void
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  businessMode,
  restaurantId,
  restaurantSlug,
  accentColor = '#3B82F6',
  onScheduleAppointment,
}: ItemDetailModalProps) {
  const { addItem, openCart, getItemById } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  const existingItem = getItemById(item.id)
  const isService = businessMode === 'services' || (businessMode === 'mixed' && item.duration)

  if (!isOpen) return null

  const handleAddToCart = () => {
    addItem(
      {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        notes: notes || undefined,
        imageUrl: item.imageUrl,
        category: item.category,
      },
      restaurantId,
      restaurantSlug
    )
    setShowAddedMessage(true)
    setTimeout(() => {
      setShowAddedMessage(false)
      onClose()
      openCart()
    }, 800)
  }

  const handleSchedule = () => {
    if (onScheduleAppointment) {
      onScheduleAppointment(item)
      onClose()
    }
  }

  const getActionLabel = () => {
    if (isService) return 'Agendar Cita'
    if (businessMode === 'store') return 'Agregar al Carrito'
    return 'Agregar al Pedido'
  }

  const getItemTypeLabel = () => {
    if (isService) return 'Servicio'
    if (businessMode === 'store') return 'Producto'
    return 'Plato'
  }

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
          {/* Image */}
          <div className="relative h-48 sm:h-64 bg-gray-100">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">
                  {isService ? '✂️' : businessMode === 'store' ? '🛍️' : '🍽️'}
                </span>
              </div>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Category badge */}
            {item.category && (
              <span
                className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: accentColor }}
              >
                {item.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{getItemTypeLabel()}</span>
                <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: accentColor }}>
                  ${item.price.toFixed(2)}
                </span>
                {isService && item.duration && (
                  <p className="text-sm text-gray-500">{item.duration} min</p>
                )}
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-gray-600 mb-6">{item.description}</p>
            )}

            {/* Already in cart indicator */}
            {existingItem && !isService && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Ya tienes {existingItem.quantity} en tu carrito</span>
              </div>
            )}

            {/* For products/food - quantity and notes */}
            {!isService && (
              <>
                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-2xl font-bold">−</span>
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-full text-white flex items-center justify-center transition-colors"
                      style={{ backgroundColor: accentColor }}
                    >
                      <span className="text-2xl font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas especiales (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Sin cebolla, extra queso..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              {/* Success message */}
              {showAddedMessage && (
                <div className="p-4 bg-green-500 text-white rounded-xl flex items-center justify-center gap-2 animate-pulse">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">¡Agregado al carrito!</span>
                </div>
              )}

              {!showAddedMessage && (
                <>
                  {isService ? (
                    <button
                      onClick={handleSchedule}
                      disabled={!item.available}
                      className="w-full py-4 rounded-xl text-white font-bold text-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accentColor }}
                    >
                      📅 {getActionLabel()}
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={!item.available}
                      className="w-full py-4 rounded-xl text-white font-bold text-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accentColor }}
                    >
                      🛒 {getActionLabel()} - ${(item.price * quantity).toFixed(2)}
                    </button>
                  )}
                </>
              )}

              {/* Not available message */}
              {!item.available && (
                <p className="text-center text-red-500 text-sm">
                  Este {getItemTypeLabel().toLowerCase()} no está disponible actualmente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
