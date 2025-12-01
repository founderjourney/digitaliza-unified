'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MenuItem {
  id?: string
  name: string
  description?: string
  price: number | string
  imageUrl?: string
  category: string
  available: boolean
}

interface MenuItemInput {
  name: string
  description?: string
  price: number
  imageUrl?: string
  category: string
  available: boolean
}

interface MenuItemFormProps {
  item?: MenuItem // undefined = crear, defined = editar
  categories: string[]
  onSubmit: (data: MenuItemInput) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  isOpen: boolean
}

export function MenuItemForm({
  item,
  categories,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: categories[0] || '',
    available: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when item changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          name: item.name,
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price.toString() : item.price.replace(/[^0-9.]/g, ''),
          imageUrl: item.imageUrl || '',
          category: item.category || categories[0] || '',
          available: item.available,
        })
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          category: categories[0] || '',
          available: true,
        })
      }
      setErrors({})
    }
  }, [item, isOpen, categories])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre requerido'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Precio debe ser mayor a 0'
    }

    if (!formData.category) {
      newErrors.category = 'Categoría requerida'
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'URL inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl.trim() || undefined,
      category: formData.category,
      available: formData.available,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={item ? 'Editar Item' : 'Agregar Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Ej: Pizza Margherita"
          disabled={isLoading}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={cn(
              'w-full px-4 py-3 text-base rounded-lg border border-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              'resize-none'
            )}
            rows={2}
            placeholder="Descripción del producto..."
            disabled={isLoading}
          />
        </div>

        <Input
          label="Precio *"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={errors.price}
          placeholder="12.00"
          disabled={isLoading}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={cn(
              'w-full px-4 py-3 text-base rounded-lg border',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              errors.category ? 'border-red-500' : 'border-gray-300'
            )}
            disabled={isLoading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>

          <div className="flex items-center gap-4">
            {formData.imageUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  // Validar tamaño (max 5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    setErrors({ ...errors, imageUrl: 'La imagen debe pesar menos de 5MB' })
                    return
                  }

                  try {
                    const formDataUpload = new FormData()
                    formDataUpload.append('file', file)

                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: formDataUpload,
                    })

                    if (!res.ok) throw new Error('Error al subir imagen')

                    const data = await res.json()
                    setFormData(prev => ({ ...prev, imageUrl: data.url }))
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.imageUrl
                      return newErrors
                    })
                  } catch (error) {
                    console.error(error)
                    setErrors({ ...errors, imageUrl: 'Error al subir la imagen' })
                  }
                }}
                className={cn(
                  'block w-full text-sm text-gray-500',
                  'file:mr-4 file:py-2 file:px-4',
                  'file:rounded-full file:border-0',
                  'file:text-sm file:font-semibold',
                  'file:bg-blue-50 file:text-blue-700',
                  'hover:file:bg-blue-100',
                  'cursor-pointer'
                )}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, WebP (Max 5MB)</p>
            </div>
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={isLoading}
          />
          <span className="text-gray-700">Disponible</span>
        </label>

        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            size="lg"
          >
            {item ? 'Guardar Cambios' : 'Agregar Item'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
