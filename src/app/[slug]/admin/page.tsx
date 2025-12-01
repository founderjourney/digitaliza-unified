'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { QRGenerator } from '@/components/QRGenerator'
import { getTheme } from '@/lib/themes'
import type { Restaurant, MenuItem } from '@/types'

type ViewMode = 'login' | 'dashboard' | 'qr' | 'add-item' | 'edit-item'

export default function AdminPage() {
  const params = useParams()
  const slug = params.slug as string

  const [viewMode, setViewMode] = useState<ViewMode>('login')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Login state
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Item form state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  })
  const [itemFormLoading, setItemFormLoading] = useState(false)

  // Check auth and load data
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`/api/restaurants/${slug}`)
      if (res.ok) {
        const data = await res.json()
        // Check if authenticated (has full data)
        if (data.restaurant || data.id) {
          setRestaurant(data.restaurant || data)
          setItems(data.items || [])
          setViewMode('dashboard')
        }
      }
    } catch {
      // Not authenticated or error
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
        setLoginError(data.error || 'Credenciales invalidas')
        return
      }

      await checkAuth()
    } catch {
      setLoginError('Error de conexion')
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
      setViewMode('login')
      setPassword('')
    }
  }

  // Item CRUD handlers
  const handleAddItem = async () => {
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
        setViewMode('dashboard')
        resetItemForm()
      } else {
        setError('Error al agregar item')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setItemFormLoading(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem) return
    setItemFormLoading(true)

    try {
      const res = await fetch(`/api/restaurants/${slug}/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price) || 0,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
        setViewMode('dashboard')
        resetItemForm()
      } else {
        setError('Error al actualizar item')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setItemFormLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Eliminar este item?')) return

    try {
      const res = await fetch(`/api/restaurants/${slug}/menu/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      }
    } catch {
      setError('Error al eliminar')
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      })

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
        )
      }
    } catch {
      setError('Error al actualizar')
    }
  }

  const resetItemForm = () => {
    setEditingItem(null)
    setItemForm({
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
    })
  }

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
      available: item.available,
    })
    setViewMode('edit-item')
  }

  // Get theme for categories
  const theme = restaurant ? getTheme(restaurant.theme) : getTheme('general')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const menuUrl = `${baseUrl}/${slug}`

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // LOGIN VIEW
  if (viewMode === 'login') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Digitaliza
            </Link>
            <h1 className="mt-4 text-xl font-bold text-gray-900">Panel de Admin</h1>
            <p className="mt-1 text-gray-600">{slug}</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contrasena"
            />
            <Button type="submit" fullWidth loading={loginLoading}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link href={`/${slug}`} className="text-blue-600 hover:underline">
              Ver menu publico
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{restaurant?.name}</h1>
            <p className="text-xs text-gray-500">Panel de Admin</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </div>
      </header>

      {/* Quick actions */}
      <div className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex flex-1 min-h-[44px] items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-700"
          >
            Ver Menu
          </Link>
          <button
            onClick={() => setViewMode('qr')}
            className="flex flex-1 min-h-[44px] items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-700"
          >
            Codigo QR
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(menuUrl)}
            className="flex flex-1 min-h-[44px] items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-700"
          >
            Compartir
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 max-w-2xl rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:mx-auto">
          {error}
          <button onClick={() => setError('')} className="ml-2 font-medium">
            X
          </button>
        </div>
      )}

      {/* Items list */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mis Productos</h2>
          <Button size="sm" onClick={() => setViewMode('add-item')}>
            + Agregar
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="mt-1 font-semibold text-blue-600">${item.price}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    item.available
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.available ? 'Disponible' : 'Agotado'}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className="min-h-[36px] flex-1 rounded bg-gray-100 px-3 text-sm text-gray-700"
                >
                  {item.available ? 'Marcar Agotado' : 'Marcar Disponible'}
                </button>
                <button
                  onClick={() => openEditItem(item)}
                  className="min-h-[36px] rounded bg-blue-100 px-3 text-sm text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="min-h-[36px] rounded bg-red-100 px-3 text-sm text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center text-gray-500">
              No tienes productos aun.
              <br />
              <button
                onClick={() => setViewMode('add-item')}
                className="mt-2 text-blue-600 hover:underline"
              >
                Agregar tu primer producto
              </button>
            </div>
          )}
        </div>
      </main>

      {/* QR Modal */}
      <Modal
        isOpen={viewMode === 'qr'}
        onClose={() => setViewMode('dashboard')}
        title="Tu Codigo QR"
      >
        <QRGenerator
          url={menuUrl}
          restaurantName={restaurant?.name || slug}
          primaryColor={theme.colors.primary}
        />
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={viewMode === 'add-item' || viewMode === 'edit-item'}
        onClose={() => {
          setViewMode('dashboard')
          resetItemForm()
        }}
        title={editingItem ? 'Editar Producto' : 'Agregar Producto'}
      >
        <div className="space-y-4 p-4">
          <Input
            label="Nombre *"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Pizza Margherita"
          />
          <Input
            label="Descripcion"
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            placeholder="Ingredientes o detalles"
          />
          <Input
            label="Precio *"
            type="number"
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            placeholder="12.00"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoria *
            </label>
            <select
              value={itemForm.category}
              onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base"
            >
              <option value="">Seleccionar categoria</option>
              {theme.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={itemForm.available}
              onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Disponible</span>
          </label>
          <Button
            fullWidth
            loading={itemFormLoading}
            onClick={editingItem ? handleUpdateItem : handleAddItem}
            disabled={!itemForm.name || !itemForm.price || !itemForm.category}
          >
            {editingItem ? 'Guardar Cambios' : 'Agregar Producto'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
