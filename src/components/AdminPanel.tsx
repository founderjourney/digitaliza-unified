'use client'

import { useState } from 'react'
import { Button, Spinner } from '@/components/ui'
import { MenuItemForm } from './MenuItemForm'
import { AppointmentsList } from './admin/AppointmentsList'
import { OrdersList } from './admin/OrdersList'
import { getTheme, ThemeKey } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number | string
  imageUrl?: string
  category: string
  available: boolean
}

interface Restaurant {
  id: string
  slug: string
  name: string
  phone: string
  whatsapp: string
  address: string
  theme: ThemeKey
  businessMode: string
  hours: Record<string, string>
  logoUrl?: string
  description?: string
}

interface AdminPanelProps {
  restaurant: Restaurant
  items: MenuItem[]
  onLogout: () => void
  onAddItem: (data: Omit<MenuItem, 'id'>) => Promise<void>
  onEditItem: (id: string, data: Partial<MenuItem>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
  onToggleAvailability: (id: string, available: boolean) => Promise<void>
  onUpdateRestaurant: (data: Partial<Restaurant>) => Promise<void>
  isLoading?: boolean
}

type TabType = 'menu' | 'appointments' | 'orders' | 'settings'

export function AdminPanel({
  restaurant,
  items,
  onLogout,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  isLoading = false,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('menu')
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const theme = getTheme(restaurant.theme)
  const businessMode = restaurant.businessMode || 'restaurant'

  // Determinar qué tabs mostrar según el modo de negocio
  const showAppointments = ['services', 'mixed'].includes(businessMode)
  const showOrders = ['restaurant', 'store', 'mixed'].includes(businessMode)

  const handleAddItem = async (data: Omit<MenuItem, 'id'>) => {
    setFormLoading(true)
    try {
      await onAddItem(data)
      setShowItemForm(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditItem = async (data: Omit<MenuItem, 'id'>) => {
    if (!editingItem) return
    setFormLoading(true)
    try {
      await onEditItem(editingItem.id, data)
      setEditingItem(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('¿Eliminar este item?')) return
    setDeletingId(id)
    try {
      await onDeleteItem(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleAvailability = async (id: string, currentAvailable: boolean) => {
    setTogglingId(id)
    try {
      await onToggleAvailability(id, !currentAvailable)
    } finally {
      setTogglingId(null)
    }
  }

  const menuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${restaurant.slug}`
    : `/${restaurant.slug}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: restaurant.name,
        text: `Mira el menú de ${restaurant.name}`,
        url: menuUrl,
      })
    } else {
      await navigator.clipboard.writeText(menuUrl)
      alert('URL copiada al portapapeles')
    }
  }

  const getItemLabel = () => {
    if (businessMode === 'services') return 'Servicios'
    if (businessMode === 'store') return 'Productos'
    return 'Menú'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 py-3 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg text-gray-900">Panel Admin</h1>
            <p className="text-sm text-gray-500">{restaurant.name}</p>
          </div>
          <Button variant="ghost" onClick={onLogout} size="sm">
            Salir
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[60px] z-30 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === 'menu'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {businessMode === 'services' ? '✂️' : businessMode === 'store' ? '🛍️' : '🍽️'} {getItemLabel()}
            </button>

            {showAppointments && (
              <button
                onClick={() => setActiveTab('appointments')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === 'appointments'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                📅 Citas
              </button>
            )}

            {showOrders && (
              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === 'orders'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                📦 Pedidos
              </button>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === 'settings'
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              ⚙️ Config
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Quick Actions - Solo en tab menu */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-3 rounded-lg',
                'bg-white border border-gray-200 hover:bg-gray-50 transition-colors',
                'min-h-[80px]'
              )}
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs text-gray-700">Ver Menú</span>
            </a>

            <a
              href={`/${restaurant.slug}/admin/qr`}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-3 rounded-lg',
                'bg-white border border-gray-200 hover:bg-gray-50 transition-colors',
                'min-h-[80px]'
              )}
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="text-xs text-gray-700">QR</span>
            </a>

            <button
              onClick={handleShare}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-3 rounded-lg',
                'bg-white border border-gray-200 hover:bg-gray-50 transition-colors',
                'min-h-[80px]'
              )}
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-xs text-gray-700">Compartir</span>
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Mis {getItemLabel()}</h2>
              <Button size="sm" onClick={() => setShowItemForm(true)}>
                + Agregar
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No tienes items aún</p>
                <Button onClick={() => setShowItemForm(true)}>
                  Agregar tu primer item
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                        disabled={togglingId === item.id}
                        className={cn(
                          'px-2 py-1 rounded text-xs font-medium transition-colors',
                          'min-w-[70px] min-h-[28px]',
                          item.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        )}
                      >
                        {togglingId === item.id ? <Spinner size="sm" /> : item.available ? 'Disponible' : 'Agotado'}
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors min-h-[44px]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors min-h-[44px]"
                      >
                        {deletingId === item.id ? <Spinner size="sm" /> : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && showAppointments && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Gestión de Citas</h2>
            <AppointmentsList restaurantId={restaurant.id} accentColor={theme.colors.primary} />
          </div>
        )}

        {activeTab === 'orders' && showOrders && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Gestión de Pedidos</h2>
            <OrdersList restaurantId={restaurant.id} accentColor={theme.colors.primary} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Configuración</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">{restaurant.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">Tema</p>
                  <p className="text-sm text-gray-500">{theme.emoji} {theme.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">Modo de negocio</p>
                  <p className="text-sm text-gray-500 capitalize">{businessMode}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">URL</p>
                  <p className="text-sm text-blue-600">/{restaurant.slug}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      <MenuItemForm
        categories={[...theme.categories]}
        onSubmit={handleAddItem}
        onCancel={() => setShowItemForm(false)}
        isLoading={formLoading}
        isOpen={showItemForm}
      />

      {/* Edit Item Modal */}
      <MenuItemForm
        item={editingItem || undefined}
        categories={[...theme.categories]}
        onSubmit={handleEditItem}
        onCancel={() => setEditingItem(null)}
        isLoading={formLoading}
        isOpen={!!editingItem}
      />
    </div>
  )
}
