'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getThemeOptions, type ThemeKey } from '@/lib/themes'
import type { BusinessMode } from '@/types'

interface FormData {
  name: string
  phone: string
  whatsapp: string
  email: string
  address: string
  theme: ThemeKey
  businessMode: BusinessMode
  password: string
  confirmPassword: string
}

const BUSINESS_MODES: { value: BusinessMode; label: string; emoji: string; description: string }[] = [
  { value: 'restaurant', label: 'Restaurante/Café', emoji: '🍽️', description: 'Menú de comidas y bebidas + Reservas de mesa' },
  { value: 'services', label: 'Servicios', emoji: '✂️', description: 'Barbería, Spa, Salón + Citas y agenda' },
  { value: 'store', label: 'Tienda/Productos', emoji: '🛍️', description: 'Floristería, tienda + Pedidos por WhatsApp' },
  { value: 'mixed', label: 'Mixto/Completo', emoji: '⭐', description: 'Todo: Productos, servicios, reservas, pedidos' },
]

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const router = useRouter()
  const themeOptions = getThemeOptions()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    theme: 'general',
    businessMode: 'restaurant',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Nombre muy corto (minimo 2 caracteres)'
    }
    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Telefono invalido (minimo 8 digitos)'
    }
    if (!formData.whatsapp || formData.whatsapp.length < 8) {
      newErrors.whatsapp = 'WhatsApp invalido (minimo 8 digitos)'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalido'
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Direccion muy corta (minimo 5 caracteres)'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Minimo 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email || undefined,
          address: formData.address,
          theme: formData.theme,
          businessMode: formData.businessMode,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || data.message || 'Error al crear el restaurante')
        return
      }

      // Redirect to admin page
      router.push(`/${data.slug}/admin`)
    } catch {
      setApiError('Error de conexion. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Digitaliza
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Crea tu Digitaliza
          </h1>
          <p className="mt-2 text-gray-600">
            Completa los datos de tu negocio
          </p>
        </div>

        {/* Error global */}
        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del negocio *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Mi Restaurante"
          />

          <Input
            label="Telefono *"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+1234567890"
          />

          <Input
            label="WhatsApp *"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            error={errors.whatsapp}
            placeholder="+1234567890"
            helperText="Numero donde recibiras pedidos"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            placeholder="contacto@minegocio.com"
          />

          <Input
            label="Direccion *"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
            placeholder="Av. Principal 123, Ciudad"
          />

          {/* Theme selector */}
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoría del negocio *
            </label>
            <select
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value as ThemeKey)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {themeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.emoji} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Business Mode selector */}
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ¿Qué vas a gestionar? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => handleChange('businessMode', mode.value)}
                  className={`flex flex-col items-start p-3 rounded-lg border-2 transition-all text-left ${
                    formData.businessMode === mode.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{mode.emoji}</span>
                    <span className={`font-medium text-sm ${formData.businessMode === mode.value ? 'text-blue-700' : 'text-gray-800'}`}>
                      {mode.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 leading-tight">{mode.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Contrasena *"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            placeholder="Minimo 6 caracteres"
          />

          <Input
            label="Confirmar contrasena *"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            placeholder="Repite tu contrasena"
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="mt-6"
          >
            Crear Mi Digitaliza Gratis
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-gray-600">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
