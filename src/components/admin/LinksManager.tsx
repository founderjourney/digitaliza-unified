'use client'

import { useState, useEffect } from 'react'
import { Button, Spinner } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Link } from '@/types'

// Iconos predefinidos para enlaces
const LINK_ICONS: Record<string, { emoji: string; label: string; color: string }> = {
  instagram: { emoji: '📸', label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  facebook: { emoji: '📘', label: 'Facebook', color: 'bg-blue-600' },
  tiktok: { emoji: '🎵', label: 'TikTok', color: 'bg-black' },
  whatsapp: { emoji: '💬', label: 'WhatsApp', color: 'bg-green-500' },
  ubereats: { emoji: '🥡', label: 'Uber Eats', color: 'bg-green-600' },
  rappi: { emoji: '🛵', label: 'Rappi', color: 'bg-orange-500' },
  pedidosya: { emoji: '🍔', label: 'PedidosYa', color: 'bg-red-500' },
  doordash: { emoji: '🚗', label: 'DoorDash', color: 'bg-red-600' },
  menu: { emoji: '📋', label: 'Menú', color: 'bg-amber-600' },
  reservas: { emoji: '📅', label: 'Reservas', color: 'bg-indigo-600' },
  web: { emoji: '🌐', label: 'Sitio Web', color: 'bg-slate-600' },
  email: { emoji: '📧', label: 'Email', color: 'bg-gray-600' },
  youtube: { emoji: '▶️', label: 'YouTube', color: 'bg-red-600' },
  twitter: { emoji: '🐦', label: 'Twitter/X', color: 'bg-sky-500' },
  link: { emoji: '🔗', label: 'Enlace', color: 'bg-gray-500' },
}

interface LinksManagerProps {
  slug: string
  isOpen: boolean
  onClose: () => void
}

export default function LinksManager({ slug, isOpen, onClose }: LinksManagerProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'link',
    isActive: true,
  })

  // Cargar links
  useEffect(() => {
    if (isOpen) {
      fetchLinks()
    }
  }, [isOpen, slug])

  const fetchLinks = async () => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/links`)
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = editingLink
        ? `/api/restaurants/${slug}/links/${editingLink.id}`
        : `/api/restaurants/${slug}/links`

      const res = await fetch(url, {
        method: editingLink ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchLinks()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving link:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este enlace?')) return

    try {
      const res = await fetch(`/api/restaurants/${slug}/links/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setLinks(links.filter(l => l.id !== id))
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleToggleActive = async (link: Link) => {
    try {
      const res = await fetch(`/api/restaurants/${slug}/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !link.isActive }),
      })

      if (res.ok) {
        setLinks(links.map(l =>
          l.id === link.id ? { ...l, isActive: !l.isActive } : l
        ))
      }
    } catch (error) {
      console.error('Error toggling link:', error)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newLinks = [...links]
    ;[newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]]
    setLinks(newLinks)
    await saveOrder(newLinks)
  }

  const handleMoveDown = async (index: number) => {
    if (index === links.length - 1) return
    const newLinks = [...links]
    ;[newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]]
    setLinks(newLinks)
    await saveOrder(newLinks)
  }

  const saveOrder = async (orderedLinks: Link[]) => {
    try {
      await fetch(`/api/restaurants/${slug}/links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: orderedLinks.map(l => l.id) }),
      })
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingLink(null)
    setFormData({ title: '', url: '', icon: 'link', isActive: true })
  }

  const openEditForm = (link: Link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon,
      isActive: link.isActive,
    })
    setShowForm(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-900">Mis Enlaces</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : showForm ? (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mi Instagram"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://instagram.com/mirestaurante"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(LINK_ICONS).map(([key, { emoji, label }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: key })}
                      className={cn(
                        'flex flex-col items-center p-2 rounded-lg border-2 transition-all',
                        formData.icon === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">Enlace activo</span>
              </label>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? <Spinner size="sm" /> : editingLink ? 'Guardar' : 'Agregar'}
                </Button>
              </div>
            </form>
          ) : (
            /* Links List */
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No tienes enlaces aún</p>
                  <Button onClick={() => setShowForm(true)}>
                    Agregar primer enlace
                  </Button>
                </div>
              ) : (
                links.map((link, index) => {
                  const iconData = LINK_ICONS[link.icon] || LINK_ICONS.link
                  return (
                    <div
                      key={link.id}
                      className={cn(
                        'flex items-center gap-3 p-3 bg-gray-50 rounded-xl',
                        !link.isActive && 'opacity-50'
                      )}
                    >
                      {/* Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white text-lg',
                        iconData.color
                      )}>
                        {iconData.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{link.title}</p>
                        <p className="text-xs text-gray-500 truncate">{link.url}</p>
                        {link.clicks > 0 && (
                          <p className="text-xs text-blue-600">{link.clicks} clicks</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === links.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={cn(
                            'p-1 rounded',
                            link.isActive ? 'text-green-600' : 'text-gray-400'
                          )}
                        >
                          {link.isActive ? '👁' : '👁‍🗨'}
                        </button>
                        <button
                          onClick={() => openEditForm(link)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })
              )}

              {links.length > 0 && (
                <Button
                  onClick={() => setShowForm(true)}
                  variant="secondary"
                  className="w-full mt-4"
                >
                  + Agregar enlace
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
