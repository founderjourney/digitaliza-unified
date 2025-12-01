'use client'

import { MenuItem, Restaurant } from '@/types'
import { cn } from '@/lib/utils'

interface DashboardViewProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
  colors: {
    primary: string
  }
  themeEmoji: string
  onNavigate: (_view: 'menu' | 'qr') => void
}

export default function DashboardView({ menuItems, colors, themeEmoji, onNavigate }: DashboardViewProps) {
  const stats = {
    totalItems: menuItems.length,
    availableItems: menuItems.filter((item: MenuItem) => item.available).length,
    categories: new Set(menuItems.map((item: MenuItem) => item.category)).size,
    avgPrice: menuItems.length > 0
      ? (menuItems.reduce((sum: number, item: MenuItem) => sum + (typeof item.price === 'number' ? item.price : parseFloat(item.price)), 0) / menuItems.length).toFixed(2)
      : '0.00'
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl">{themeEmoji}</span>
          Dashboard
        </h2>
        <p className="text-gray-600">Gestiona tu restaurante desde aquí</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <div className="text-2xl mb-2">🍽️</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
          <div className="text-sm text-gray-600">Items del Menú</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-gray-900">{stats.availableItems}</div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <div className="text-2xl mb-2">📂</div>
          <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
          <div className="text-sm text-gray-600">Categorías</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold text-gray-900">€{stats.avgPrice}</div>
          <div className="text-sm text-gray-600">Precio Promedio</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => onNavigate('menu')} className={cn("p-4 rounded-lg text-white font-medium transition-all transform active:scale-95", colors.primary)}>
            ➕ Añadir Item al Menú
          </button>
          <button onClick={() => onNavigate('qr')} className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all transform active:scale-95">
            📱 Ver QR del Menú
          </button>
          <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all transform active:scale-95">
            📊 Ver Estadísticas
          </button>
        </div>
      </div>
    </div>
  )
}
