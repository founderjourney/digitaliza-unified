'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: string
  restaurantName: string
  restaurantWhatsApp: string
  restaurantAddress: string
  businessMode: 'restaurant' | 'services' | 'store' | 'mixed'
  accentColor?: string
}

type OrderType = 'pickup' | 'delivery' | 'dine_in'

export function CheckoutModal({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  restaurantWhatsApp,
  restaurantAddress,
  businessMode,
  accentColor = '#3B82F6',
}: CheckoutModalProps) {
  const { state, getTotal, clearCart } = useCart()
  const [step, setStep] = useState<'type' | 'info' | 'confirm'>('type')
  const [orderType, setOrderType] = useState<OrderType>('pickup')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const total = getTotal()

  const orderTypeOptions: { value: OrderType; label: string; emoji: string; description: string }[] = [
    {
      value: 'pickup',
      label: 'Recoger en local',
      emoji: '🏃',
      description: `Recoges tu pedido en ${restaurantAddress}`,
    },
    {
      value: 'delivery',
      label: 'Delivery',
      emoji: '🛵',
      description: 'Te lo llevamos a tu dirección',
    },
  ]

  // Para restaurantes, agregar opción de comer en local
  if (businessMode === 'restaurant' || businessMode === 'mixed') {
    orderTypeOptions.push({
      value: 'dine_in',
      label: 'Comer en local',
      emoji: '🍽️',
      description: 'Disfruta tu pedido aquí',
    })
  }

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      setError('Por favor ingresa tu dirección de entrega')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          customerName,
          customerPhone,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
          deliveryNotes: orderType === 'delivery' ? deliveryNotes : null,
          orderType,
          items: state.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
          notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear pedido')
        return
      }

      setOrderNumber(data.orderNumber)
      setStep('confirm')
    } catch {
      setError('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppConfirm = () => {
    const itemsList = state.items
      .map(item => `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}${item.notes ? ` (${item.notes})` : ''}`)
      .join('\n')

    const orderTypeLabels: Record<OrderType, string> = {
      pickup: 'Recoger en local',
      delivery: 'Delivery',
      dine_in: 'Comer en local',
    }

    let message = `¡Hola! 🛒 Nuevo pedido #${orderNumber}\n\n`
    message += `📍 ${restaurantName}\n`
    message += `📦 Tipo: ${orderTypeLabels[orderType]}\n\n`
    message += `🛒 Pedido:\n${itemsList}\n\n`
    message += `💰 Total: $${total.toFixed(2)}\n\n`
    message += `👤 Cliente: ${customerName}\n`
    message += `📱 Tel: ${customerPhone}\n`

    if (orderType === 'delivery') {
      message += `📍 Dirección: ${deliveryAddress}\n`
      if (deliveryNotes) message += `📝 Notas: ${deliveryNotes}\n`
    }

    if (notes) message += `📝 Notas del pedido: ${notes}\n`

    window.open(`https://wa.me/${restaurantWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')

    clearCart()
    onClose()
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
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: accentColor }}
          >
            <div>
              <h2 className="font-bold text-lg">Finalizar Pedido</h2>
              <p className="text-sm text-white/80">{state.items.length} items - ${total.toFixed(2)}</p>
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Order Type */}
            {step === 'type' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">¿Cómo lo quieres?</h3>
                <div className="space-y-3">
                  {orderTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setOrderType(option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        orderType === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: orderType === option.value ? accentColor : undefined,
                        backgroundColor: orderType === option.value ? `${accentColor}10` : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{option.emoji}</span>
                        <div>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Tu pedido</h4>
                  <div className="space-y-2 text-sm">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span style={{ color: accentColor }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('info')}
                  className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: Customer Info */}
            {step === 'info' && (
              <div>
                <button
                  onClick={() => setStep('type')}
                  className="mb-4 text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
                >
                  ← Volver
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

                  {orderType === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de entrega *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Calle, número, colonia..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Referencias (opcional)
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Edificio azul, portón negro..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas del pedido (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instrucciones especiales para tu pedido..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 rounded-xl text-white font-bold transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  {isSubmitting ? 'Procesando...' : `Confirmar Pedido - $${total.toFixed(2)}`}
                </button>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 'confirm' && (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Enviado!</h3>
                <p className="text-gray-600 mb-2">
                  Tu pedido #{orderNumber} ha sido registrado.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Envía un mensaje por WhatsApp para confirmar tu pedido.
                </p>

                <div className="p-4 bg-gray-50 rounded-lg text-left mb-6">
                  <div className="space-y-2 text-sm">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppConfirm}
                    className="w-full py-3 rounded-xl bg-green-500 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <span>📱</span> Enviar por WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      clearCart()
                      onClose()
                    }}
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
