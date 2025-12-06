'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface CartDrawerProps {
  onCheckout: () => void
  accentColor?: string
}

export function CartDrawer({ onCheckout, accentColor = '#3B82F6' }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, clearCart, closeCart, getTotal, getItemCount } = useCart()

  if (!state.isOpen) return null

  const total = getTotal()
  const itemCount = getItemCount()

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="font-bold text-lg">Tu Pedido</h2>
              <p className="text-sm text-white/80">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-sm">Agrega productos para hacer tu pedido</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    {item.category && (
                      <p className="text-xs text-gray-500">{item.category}</p>
                    )}
                    <p className="font-semibold mt-1" style={{ color: accentColor }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">📝 {item.notes}</p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                        style={{ backgroundColor: accentColor }}
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart button */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total</span>
              <span className="text-2xl font-bold" style={{ color: accentColor }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={() => {
                closeCart()
                onCheckout()
              }}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Continuar con el Pedido
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// Botón flotante del carrito
interface CartButtonProps {
  accentColor?: string
  onClick?: () => void
}

export function CartButton({ accentColor = '#3B82F6', onClick }: CartButtonProps) {
  const { toggleCart, getItemCount, getTotal } = useCart()
  const itemCount = getItemCount()
  const total = getTotal()

  if (itemCount === 0) return null

  const handleClick = onClick || toggleCart

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-30 flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all"
      style={{ backgroundColor: accentColor }}
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-xs font-bold flex items-center justify-center"
          style={{ color: accentColor }}
        >
          {itemCount}
        </span>
      </div>
      <span className="font-bold">${total.toFixed(2)}</span>
    </button>
  )
}
