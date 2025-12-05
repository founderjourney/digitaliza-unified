'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { QRGenerator } from '@/components/QRGenerator'
import { getTheme } from '@/lib/themes'
import { getBusinessConfig } from '@/lib/business-config'
import type { Restaurant, MenuItem, Link as LinkType, Reservation } from '@/types'

type TabType = 'menu' | 'links' | 'reservations' | 'qr' | 'settings'

// Iconos predefinidos para enlaces
const LINK_ICONS: Record<string, { emoji: string; label: string; color: string }> = {
  instagram: { emoji: '📸', label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  facebook: { emoji: '📘', label: 'Facebook', color: 'bg-blue-600' },
  tiktok: { emoji: '🎵', label: 'TikTok', color: 'bg-black' },
  whatsapp: { emoji: '💬', label: 'WhatsApp', color: 'bg-green-500' },
  ubereats: { emoji: '🥡', label: 'Uber Eats', color: 'bg-green-600' },
  rappi: { emoji: '🛵', label: 'Rappi', color: 'bg-orange-500' },
  pedidosya: { emoji: '🍔', label: 'PedidosYa', color: 'bg-red-500' },
  menu: { emoji: '📋', label: 'Menú', color: 'bg-amber-600' },
  reservas: { emoji: '📅', label: 'Reservas', color: 'bg-indigo-600' },
  web: { emoji: '🌐', label: 'Sitio Web', color: 'bg-slate-600' },
  link: { emoji: '🔗', label: 'Enlace', color: 'bg-gray-500' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Confirmada', color: 'text-green-700', bg: 'bg-green-100' },
  completed: { label: 'Completada', color: 'text-blue-700', bg: 'bg-blue-100' },
  cancelled: { label: 'Cancelada', color: 'text-red-700', bg: 'bg-red-100' },
}

// Labels según modo de negocio
const MODE_LABELS: Record<string, { items: string; item: string; addItem: string; reservations: string }> = {
  restaurant: { items: 'Menú', item: 'Plato', addItem: 'Agregar Plato', reservations: 'Reservas' },
  services: { items: 'Servicios', item: 'Servicio', addItem: 'Agregar Servicio', reservations: 'Citas' },
  store: { items: 'Productos', item: 'Producto', addItem: 'Agregar Producto', reservations: 'Pedidos' },
  mixed: { items: 'Catálogo', item: 'Item', addItem: 'Agregar Item', reservations: 'Reservas/Citas' },
}

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

  // Links state
  const [links, setLinks] = useState<LinkType[]>([])
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [linkForm, setLinkForm] = useState({ title: '', url: '', icon: 'link', isActive: true })
  const [linkFormLoading, setLinkFormLoading] = useState(false)

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // Get business config
  const businessConfig = restaurant ? getBusinessConfig(restaurant.theme) : getBusinessConfig('general')
  const theme = restaurant ? getTheme(restaurant.theme) : getTheme('general')
  const businessMode = restaurant?.businessMode || 'restaurant'
  const modeLabels = MODE_LABELS[businessMode] || MODE_LABELS.restaurant
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const menuUrl = `${baseUrl}/${slug}`

  // Determinar qué tabs mostrar según el modo
  const showReservations = businessMode !== 'store' // Tiendas no tienen reservas, tienen pedidos por WhatsApp

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
        setSuccessMessage(`${modeLabels.item} agregado correctamente`)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || `Error al agregar ${modeLabels.item.toLowerCase()}`)
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

  // ========== LINKS FUNCTIONS ==========
  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/links`)
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch (err) {
      console.error('Error fetching links:', err)
    }
  }, [slug])

  const resetLinkForm = () => {
    setLinkForm({ title: '', url: '', icon: 'link', isActive: true })
    setShowLinkForm(false)
    setEditingLinkId(null)
  }

  const handleAddLink = async () => {
    if (!linkForm.title || !linkForm.url) {
      setError('Completa título y URL')
      return
    }
    setLinkFormLoading(true)
    try {
      const res = await fetch(`/api/restaurants/${slug}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkForm),
      })
      if (res.ok) {
        await fetchLinks()
        resetLinkForm()
        setSuccessMessage('Enlace agregado')
      } else {
        setError('Error al agregar enlace')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLinkFormLoading(false)
    }
  }

  const handleUpdateLink = async (id: string, updates: Partial<LinkType>) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        await fetchLinks()
        setSuccessMessage('Enlace actualizado')
        setEditingLinkId(null)
      }
    } catch {
      setError('Error al actualizar')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('¿Eliminar este enlace?')) return
    try {
      const res = await fetch(`/api/restaurants/${slug}/links/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setLinks(links.filter(l => l.id !== id))
        setSuccessMessage('Enlace eliminado')
      }
    } catch {
      setError('Error al eliminar')
    }
  }

  const handleToggleLinkActive = async (link: LinkType) => {
    await handleUpdateLink(link.id, { isActive: !link.isActive })
  }

  // ========== RESERVATIONS FUNCTIONS ==========
  const fetchReservations = useCallback(async () => {
    setReservationsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      const res = await fetch(`/api/restaurants/${slug}/reservations?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReservations(data)
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
    } finally {
      setReservationsLoading(false)
    }
  }, [slug, filterStatus])

  const handleUpdateReservationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus as Reservation['status'] } : r))
        if (selectedReservation?.id === id) {
          setSelectedReservation({ ...selectedReservation, status: newStatus as Reservation['status'] })
        }
        setSuccessMessage('Estado actualizado')
      }
    } catch {
      setError('Error al actualizar')
    }
  }

  const handleDeleteReservation = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    try {
      const res = await fetch(`/api/restaurants/${slug}/reservations/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setReservations(reservations.filter(r => r.id !== id))
        if (selectedReservation?.id === id) setSelectedReservation(null)
        setSuccessMessage('Reserva eliminada')
      }
    } catch {
      setError('Error al eliminar')
    }
  }

  const openWhatsApp = (reservation: Reservation) => {
    const message = encodeURIComponent(
      `Hola ${reservation.name}, confirmamos tu reserva para el ${new Date(reservation.date).toLocaleDateString('es-ES')} a las ${reservation.time} para ${reservation.guests} persona(s). ¡Te esperamos!`
    )
    const phone = reservation.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // Stats for reservations
  const reservationStats = {
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    today: reservations.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length,
  }

  // Load links and reservations when tab changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'links') {
      fetchLinks()
    }
  }, [isAuthenticated, activeTab, fetchLinks])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'reservations') {
      fetchReservations()
    }
  }, [isAuthenticated, activeTab, fetchReservations])

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
              Ver {modeLabels.items.toLowerCase()} público
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{modeLabels.items}</p>
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
      <div className="bg-white border-b px-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'menu'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            📋 {modeLabels.items}
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'links'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            🔗 Enlaces
          </button>
          {showReservations && (
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'reservations'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📅 {modeLabels.reservations}
            </button>
          )}
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            📱 QR
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ⚙️
          </button>
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
              <h2 className="text-lg font-bold text-slate-800">Gestionar {modeLabels.items}</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
              >
                + {modeLabels.addItem}
              </button>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
              <div className="mb-6 rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-slate-800">{modeLabels.addItem}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre *</label>
                    <input
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder={`Nombre del ${modeLabels.item.toLowerCase()}`}
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
                  <p className="text-slate-500">No tienes {modeLabels.items.toLowerCase()} aún.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-3 text-amber-600 font-semibold hover:text-amber-700"
                  >
                    {modeLabels.addItem}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LINKS TAB */}
        {activeTab === 'links' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Mis Enlaces</h2>
              <button
                onClick={() => setShowLinkForm(true)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400"
              >
                + Agregar
              </button>
            </div>

            {/* Add Link Form */}
            {showLinkForm && (
              <div className="mb-6 rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-slate-800">
                  {editingLinkId ? 'Editar Enlace' : 'Nuevo Enlace'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Título *</label>
                    <input
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      placeholder="Mi Instagram"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">URL *</label>
                    <input
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://instagram.com/minegocio"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Icono</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(LINK_ICONS).map(([key, { emoji, label }]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setLinkForm({ ...linkForm, icon: key })}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                            linkForm.icon === key
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xl">{emoji}</span>
                          <span className="text-xs text-slate-600 mt-1 truncate w-full text-center">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={linkForm.isActive}
                      onChange={(e) => setLinkForm({ ...linkForm, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-amber-500"
                    />
                    <span className="text-sm text-slate-600">Enlace activo</span>
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={editingLinkId ? () => handleUpdateLink(editingLinkId, linkForm) : handleAddLink}
                      disabled={linkFormLoading}
                      className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {linkFormLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={resetLinkForm}
                      className="flex-1 rounded-lg bg-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Links List */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                  <p className="text-4xl mb-3">🔗</p>
                  <p className="text-slate-500">No tienes enlaces aún.</p>
                  <button
                    onClick={() => setShowLinkForm(true)}
                    className="mt-3 text-amber-600 font-semibold hover:text-amber-700"
                  >
                    Agregar tu primer enlace
                  </button>
                </div>
              ) : (
                links.map((link) => {
                  const iconData = LINK_ICONS[link.icon] || LINK_ICONS.link
                  return (
                    <div
                      key={link.id}
                      className={`rounded-xl bg-white border p-4 shadow-sm transition-all ${
                        !link.isActive ? 'opacity-60' : ''
                      } ${editingLinkId === link.id ? 'border-amber-500' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${iconData.color}`}>
                          {iconData.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{link.title}</p>
                          <p className="text-xs text-slate-500 truncate">{link.url}</p>
                          {link.clicks > 0 && (
                            <p className="text-xs text-blue-600">{link.clicks} clicks</p>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          link.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {link.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => handleToggleLinkActive(link)}
                          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
                            link.isActive
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {link.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingLinkId(link.id)
                            setLinkForm({ title: link.title, url: link.url, icon: link.icon, isActive: link.isActive })
                            setShowLinkForm(true)
                          }}
                          className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === 'reservations' && (
          <div>
            {/* Header with stats */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Reservas</h2>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-2 text-center">
                  <p className="text-lg font-bold text-yellow-600">{reservationStats.pending}</p>
                  <p className="text-xs text-yellow-700">Pendientes</p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-2 text-center">
                  <p className="text-lg font-bold text-green-600">{reservationStats.confirmed}</p>
                  <p className="text-xs text-green-700">Confirmadas</p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{reservationStats.today}</p>
                  <p className="text-xs text-blue-700">Hoy</p>
                </div>
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Todas las reservas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>

            {/* Reservations List */}
            {reservationsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
              </div>
            ) : selectedReservation ? (
              /* Reservation Detail View */
              <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-amber-600 text-sm mb-4 flex items-center gap-1"
                >
                  ← Volver
                </button>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedReservation.name}</h3>
                    <p className="text-slate-600">{selectedReservation.phone}</p>
                    {selectedReservation.email && (
                      <p className="text-slate-500 text-sm">{selectedReservation.email}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedReservation.status].bg} ${STATUS_CONFIG[selectedReservation.status].color}`}>
                    {STATUS_CONFIG[selectedReservation.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200 mb-4">
                  <div className="text-center">
                    <p className="text-2xl">📅</p>
                    <p className="font-medium text-slate-800">{formatDate(selectedReservation.date)}</p>
                    <p className="text-sm text-slate-500">Fecha</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl">🕐</p>
                    <p className="font-medium text-slate-800">{selectedReservation.time}</p>
                    <p className="text-sm text-slate-500">Hora</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl">👥</p>
                    <p className="font-medium text-slate-800">{selectedReservation.guests}</p>
                    <p className="text-sm text-slate-500">Personas</p>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="bg-slate-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-slate-500 mb-1">Notas:</p>
                    <p className="text-slate-700">{selectedReservation.notes}</p>
                  </div>
                )}

                {/* Status Actions */}
                {selectedReservation.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'confirmed')}
                      className="rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'cancelled')}
                      className="rounded-lg bg-red-100 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'completed')}
                      className="rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      ✓ Completar
                    </button>
                    <button
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'cancelled')}
                      className="rounded-lg bg-red-100 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openWhatsApp(selectedReservation)}
                    className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white hover:bg-green-600"
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(`tel:${selectedReservation.phone}`, '_self')}
                    className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    📞 Llamar
                  </button>
                  <button
                    onClick={() => handleDeleteReservation(selectedReservation.id)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ) : (
              /* Reservations List */
              <div className="space-y-3">
                {reservations.length === 0 ? (
                  <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                    <p className="text-4xl mb-3">📅</p>
                    <p className="text-slate-500">No hay reservas</p>
                    {filterStatus !== 'all' && (
                      <p className="text-sm text-slate-400 mt-2">Prueba cambiar el filtro</p>
                    )}
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <button
                      key={reservation.id}
                      onClick={() => setSelectedReservation(reservation)}
                      className="w-full rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:border-amber-300 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 text-center flex-shrink-0">
                          <div className="bg-slate-100 rounded-lg p-2">
                            <p className="text-xs text-slate-500 uppercase">
                              {new Date(reservation.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              {new Date(reservation.date).getDate()}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 truncate">{reservation.name}</p>
                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[reservation.status].bg} ${STATUS_CONFIG[reservation.status].color}`}>
                              {STATUS_CONFIG[reservation.status].label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span>🕐 {reservation.time}</span>
                            <span>👥 {reservation.guests}</span>
                          </div>
                        </div>
                        <span className="text-slate-400">→</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
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
                  👁️ Ver {modeLabels.items}
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
