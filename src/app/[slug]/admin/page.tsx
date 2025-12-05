'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { QRGenerator } from '@/components/QRGenerator'
import { getTheme } from '@/lib/themes'
import { getBusinessConfig } from '@/lib/business-config'
import type { Restaurant, MenuItem } from '@/types'

type TabType = 'menu' | 'qr' | 'settings'

export default function AdminPage() {
  const params = useParams()
  const slug = params.slug as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Login state
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('menu')

  // Item form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  })
  const [itemFormLoading, setItemFormLoading] = useState(false)

  // Get business config
  const businessConfig = restaurant ? getBusinessConfig(restaurant.theme) : getBusinessConfig('general')
  const theme = restaurant ? getTheme(restaurant.theme) : getTheme('general')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const menuUrl = `${baseUrl}/${slug}`

  // Check auth and load data
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`/api/restaurants/${slug}`)
      if (res.ok) {
        const data = await res.json()
        if (data.restaurant || data.id) {
          setRestaurant(data.restaurant || data)
          setItems(data.items || [])
          setIsAuthenticated(true)
        }
      }
    } catch {
      // Not authenticated
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Auto-clear messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Credenciales inválidas')
        return
      }

      await checkAuth()
    } catch {
      setLoginError('Error de conexión')
    } finally {
      setLoginLoading(false)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setRestaurant(null)
      setItems([])
      setIsAuthenticated(false)
      setPassword('')
    }
  }

  // Reset form
  const resetItemForm = () => {
    setItemForm({ name: '', description: '', price: '', category: '', available: true })
    setShowAddForm(false)
    setEditingItemId(null)
  }

  // Add item
  const handleAddItem = async () => {
    if (!itemForm.name || !itemForm.price || !itemForm.category) {
      setError('Completa todos los campos requeridos')
      return
    }

    setItemFormLoading(true)
    try {
      const res = await fetch(`/api/restaurants/${slug}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price) || 0,
        }),
      })

      if (res.ok) {
        const newItem = await res.json()
        setItems((prev) => [...prev, newItem])
        resetItemForm()
        setSuccessMessage(`${businessConfig.itemLabel} agregado correctamente`)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || `Error al agregar ${businessConfig.itemLabel.toLowerCase()}`)
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setItemFormLoading(false)
    }
  }

  // Update item inline
  const handleUpdateItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        const updated = await res.json()
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
        setSuccessMessage('Cambios guardados')
        setEditingItemId(null)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || 'Error al actualizar')
      }
    } catch {
      setError('Error de conexión')
    }
  }

  // Delete item
  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return

    try {
      const res = await fetch(`/api/restaurants/${slug}/menu/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        setSuccessMessage('Eliminado correctamente')
      }
    } catch {
      setError('Error al eliminar')
    }
  }

  // Toggle availability
  const handleToggleAvailability = async (item: MenuItem) => {
    await handleUpdateItem(item.id, { available: !item.available })
  }

  // Copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl)
    setSuccessMessage('Link copiado!')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-3xl shadow-lg shadow-amber-500/20">
              {businessConfig.emoji}
            </div>
            <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
            <p className="mt-1 text-slate-400">{slug}</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 disabled:opacity-50"
            >
              {loginLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href={`/${slug}`} className="text-amber-500 hover:text-amber-400">
              Ver {businessConfig.itemsLabel.toLowerCase()} público
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-amber-500/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-2xl shadow-lg">
                {businessConfig.emoji}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{restaurant?.name}</h1>
                <p className="text-xs text-slate-400">{businessConfig.label}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-white border-b px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 border-l-4 border-amber-500">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{businessConfig.itemsLabel}</p>
            <p className="text-2xl font-bold text-amber-600">{items.length}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 border-l-4 border-emerald-500">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Activos</p>
            <p className="text-2xl font-bold text-emerald-600">{items.filter(i => i.available).length}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 border-l-4 border-rose-500">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Agotados</p>
            <p className="text-2xl font-bold text-rose-600">{items.filter(i => !i.available).length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4">
        <div className="flex gap-1">
          {[
            { id: 'menu' as TabType, label: `📋 ${businessConfig.itemsLabel}` },
            { id: 'qr' as TabType, label: '📱 QR Code' },
            { id: 'settings' as TabType, label: '⚙️ Config' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mx-4 mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
          ✓ {successMessage}
        </div>
      )}

      {/* Tab Content */}
      <main className="px-4 py-6">
        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Gestionar {businessConfig.itemsLabel}</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
              >
                + {businessConfig.addItemLabel}
              </button>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
              <div className="mb-6 rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-slate-800">{businessConfig.addItemLabel}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre *</label>
                    <input
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder={`Nombre del ${businessConfig.itemLabel.toLowerCase()}`}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Descripción</label>
                    <input
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      placeholder="Descripción breve"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio *</label>
                      <input
                        type="number"
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoría *</label>
                      <select
                        value={itemForm.category}
                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      >
                        <option value="">Seleccionar</option>
                        {theme.categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={itemForm.available}
                      onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-amber-500"
                    />
                    <span className="text-sm text-slate-600">Disponible</span>
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddItem}
                      disabled={itemFormLoading}
                      className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {itemFormLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={resetItemForm}
                      className="flex-1 rounded-lg bg-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl bg-white border p-4 shadow-sm transition-colors ${
                    editingItemId === item.id ? 'border-amber-500' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                            item.available
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.available ? '✓ Activo' : '✕ Agotado'}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-sm text-slate-500 line-clamp-1">{item.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <span className="font-bold text-amber-600">${Number(item.price).toLocaleString()}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
                        item.available
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {item.available ? 'Marcar Agotado' : 'Marcar Disponible'}
                    </button>
                    <button
                      onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                      className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Inline Edit Form */}
                  {editingItemId === item.id && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          defaultValue={item.name}
                          placeholder="Nombre"
                          className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          onBlur={(e) => {
                            if (e.target.value !== item.name) {
                              handleUpdateItem(item.id, { name: e.target.value })
                            }
                          }}
                        />
                        <input
                          type="number"
                          defaultValue={item.price}
                          placeholder="Precio"
                          className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                          onBlur={(e) => {
                            const newPrice = parseFloat(e.target.value)
                            if (newPrice !== Number(item.price)) {
                              handleUpdateItem(item.id, { price: newPrice })
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {items.length === 0 && !showAddForm && (
                <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                  <p className="text-4xl mb-3">{businessConfig.emoji}</p>
                  <p className="text-slate-500">No tienes {businessConfig.itemsLabel.toLowerCase()} aún.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-3 text-amber-600 font-semibold hover:text-amber-700"
                  >
                    {businessConfig.addItemLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR TAB */}
        {activeTab === 'qr' && (
          <div className="max-w-sm mx-auto">
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 text-center mb-4">Tu Código QR</h2>
              <QRGenerator
                url={menuUrl}
                restaurantName={restaurant?.name || slug}
                primaryColor={theme.colors.primary}
              />
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full rounded-lg bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  📋 Copiar Link
                </button>
                <Link
                  href={`/${slug}`}
                  target="_blank"
                  className="block w-full rounded-lg bg-amber-500 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  👁️ Ver {businessConfig.itemsLabel}
                </Link>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">{menuUrl}</p>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">📍 Información</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nombre</span>
                  <span className="text-slate-800 font-medium">{restaurant?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipo</span>
                  <span className="text-slate-800 font-medium">{businessConfig.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Teléfono</span>
                  <span className="text-slate-800 font-medium">{restaurant?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp</span>
                  <span className="text-slate-800 font-medium">{restaurant?.whatsapp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dirección</span>
                  <span className="text-slate-800 font-medium text-right max-w-[60%]">{restaurant?.address}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">🔗 Tu Link</h3>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-sm text-slate-600 break-all">{menuUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className="mt-3 w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
              >
                Copiar Link
              </button>
            </div>

            <div className="rounded-xl bg-slate-100 border border-slate-200 p-4">
              <p className="text-xs text-slate-500 text-center">
                ¿Necesitas cambiar información?<br />
                Contacta soporte: soporte@digitaliza.com
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
