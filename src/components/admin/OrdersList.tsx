'use client'

import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
  itemName: string
  itemCategory?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress?: string
  deliveryNotes?: string
  orderType: string
  subtotal: number
  total: number
  status: string
  notes?: string
  estimatedTime?: number
  items: OrderItem[]
  createdAt: string
}

interface OrdersListProps {
  restaurantId: string
  accentColor?: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; emoji: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', emoji: '⏳' },
  confirmed: { label: 'Confirmado', color: 'text-blue-700', bgColor: 'bg-blue-100', emoji: '✅' },
  preparing: { label: 'Preparando', color: 'text-orange-700', bgColor: 'bg-orange-100', emoji: '👨‍🍳' },
  ready: { label: 'Listo', color: 'text-green-700', bgColor: 'bg-green-100', emoji: '📦' },
  out_for_delivery: { label: 'En camino', color: 'text-purple-700', bgColor: 'bg-purple-100', emoji: '🛵' },
  delivered: { label: 'Entregado', color: 'text-teal-700', bgColor: 'bg-teal-100', emoji: '🎉' },
  completed: { label: 'Completado', color: 'text-green-700', bgColor: 'bg-green-100', emoji: '✓' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100', emoji: '❌' },
}

const ORDER_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  pickup: { label: 'Recoger', emoji: '🏃' },
  delivery: { label: 'Delivery', emoji: '🛵' },
  dine_in: { label: 'Local', emoji: '🍽️' },
}

export function OrdersList({ restaurantId, accentColor = '#3B82F6' }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending,confirmed,preparing,ready')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [restaurantId, filter])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ restaurantId })
      if (filter !== 'all') params.append('status', filter)

      const res = await fetch(`/api/orders?${params}`)
      const data = await res.json()

      if (res.ok) {
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
        )
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleWhatsApp = (order: Order, message: string) => {
    const phone = order.customerPhone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  }

  const getTimeSince = (dateStr: string) => {
    const now = new Date()
    const created = new Date(dateStr)
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h`
    return `${Math.floor(diffHours / 24)}d`
  }

  const getNextStatus = (currentStatus: string, orderType: string): string | null => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: orderType === 'delivery' ? 'out_for_delivery' : 'completed',
      out_for_delivery: 'delivered',
      delivered: 'completed',
    }
    return flow[currentStatus] || null
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="pending,confirmed,preparing,ready">Activos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="preparing">En preparación</option>
          <option value="ready,out_for_delivery">Listos/En camino</option>
          <option value="completed,delivered">Completados</option>
          <option value="cancelled">Cancelados</option>
          <option value="all">Todos</option>
        </select>
        <button
          onClick={loadOrders}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ backgroundColor: accentColor }}
        >
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {['pending', 'confirmed', 'preparing', 'ready'].map((status) => {
          const count = orders.filter(o => o.status === status).length
          const config = STATUS_CONFIG[status]
          return (
            <div key={status} className={`p-3 rounded-lg ${config.bgColor}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs">{config.emoji} {config.label}</div>
            </div>
          )
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">📦</span>
          <p>No hay pedidos en este estado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const orderTypeConfig = ORDER_TYPE_LABELS[order.orderType] || ORDER_TYPE_LABELS.pickup
            const isExpanded = expandedOrder === order.id
            const nextStatus = getNextStatus(order.status, order.orderType)

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">#{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.emoji} {statusConfig.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                          {orderTypeConfig.emoji} {orderTypeConfig.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-gray-500">{order.items.length} items</span>
                        <span className="font-bold" style={{ color: accentColor }}>${order.total.toFixed(2)}</span>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(order.createdAt)} · Hace {getTimeSince(order.createdAt)}
                      </div>
                    </div>

                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    {/* Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Items del pedido</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.itemName}
                              {item.notes && <span className="text-gray-500 italic ml-1">({item.notes})</span>}
                            </span>
                            <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Cliente</h4>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      {order.deliveryAddress && (
                        <p className="text-sm text-gray-500">📍 {order.deliveryAddress}</p>
                      )}
                      {order.notes && (
                        <p className="text-sm text-gray-500 italic mt-1">📝 {order.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {nextStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            updateStatus(order.id, nextStatus)
                            if (nextStatus === 'confirmed') {
                              handleWhatsApp(order, `¡Hola ${order.customerName}! Tu pedido #${order.orderNumber} ha sido CONFIRMADO. Te avisaremos cuando esté listo.`)
                            } else if (nextStatus === 'ready') {
                              handleWhatsApp(order, `¡${order.customerName}! Tu pedido #${order.orderNumber} está LISTO ${order.orderType === 'pickup' ? 'para recoger' : 'para entrega'}.`)
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                        >
                          {STATUS_CONFIG[nextStatus]?.emoji} {STATUS_CONFIG[nextStatus]?.label || nextStatus}
                        </button>
                      )}

                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                        >
                          ❌ Cancelar
                        </button>
                      )}

                      <button
                        onClick={() => handleWhatsApp(order, `Hola ${order.customerName}, respecto a tu pedido #${order.orderNumber}...`)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        📱 WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
