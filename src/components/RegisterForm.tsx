'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { getThemeOptions, ThemeKey } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface RegisterInput {
  name: string
  phone: string
  whatsapp: string
  email?: string
  address: string
  theme: ThemeKey
  password: string
}

interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => Promise<void>
  isLoading: boolean
  error?: string
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    theme: 'general' as ThemeKey,
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const themeOptions = getThemeOptions()

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Nombre muy corto (mínimo 2 caracteres)'
    }

    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Teléfono inválido (mínimo 8 caracteres)'
    }

    if (!formData.whatsapp || formData.whatsapp.length < 8) {
      newErrors.whatsapp = 'WhatsApp inválido (mínimo 8 caracteres)'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Dirección muy corta (mínimo 5 caracteres)'
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Contraseña muy corta (mínimo 6 caracteres)'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim(),
      theme: formData.theme,
      password: formData.password,
    })
  }

  const handlePhoneChange = (field: 'phone' | 'whatsapp') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Crea tu Menú Digital</h1>
        <p className="mt-2 text-gray-600">Gratis en 5 minutos</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del negocio *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Ej: La Pizzería de Juan"
          disabled={isLoading}
        />

        <Input
          label="Teléfono *"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange('phone')}
          error={errors.phone}
          placeholder="+1234567890"
          disabled={isLoading}
        />

        <Input
          label="WhatsApp *"
          type="tel"
          value={formData.whatsapp}
          onChange={handlePhoneChange('whatsapp')}
          error={errors.whatsapp}
          placeholder="+1234567890"
          helperText="Para recibir pedidos"
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="tu@email.com"
          disabled={isLoading}
        />

        <Input
          label="Dirección *"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
          placeholder="Av. Principal 123"
          disabled={isLoading}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de negocio *
          </label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value as ThemeKey })}
            className={cn(
              'w-full px-4 py-3 text-base rounded-lg border border-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed'
            )}
            disabled={isLoading}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contraseña *"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          placeholder="Mínimo 6 caracteres"
          disabled={isLoading}
        />

        <Input
          label="Confirmar contraseña *"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          disabled={isLoading}
        />

        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            size="lg"
          >
            Crear Mi Menú Gratis
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
