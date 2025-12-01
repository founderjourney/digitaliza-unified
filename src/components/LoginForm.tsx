'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'

interface LoginFormProps {
  onSubmit: (data: { slug: string; password: string }) => Promise<void>
  isLoading: boolean
  error?: string
  defaultSlug?: string
}

export function LoginForm({ onSubmit, isLoading, error, defaultSlug = '' }: LoginFormProps) {
  const [formData, setFormData] = useState({
    slug: defaultSlug,
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.slug.trim()) {
      newErrors.slug = 'Ingresa tu URL'
    }

    if (!formData.password) {
      newErrors.password = 'Ingresa tu contraseña'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      slug: formData.slug.trim().toLowerCase(),
      password: formData.password,
    })
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="mt-2 text-gray-600">Administra tu menú digital</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tu URL (slug) *"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          error={errors.slug}
          placeholder="mi-restaurante"
          helperText="ejemplo: mi-restaurante"
          disabled={isLoading}
          autoComplete="username"
        />

        <Input
          label="Contraseña *"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          placeholder="Tu contraseña"
          disabled={isLoading}
          autoComplete="current-password"
        />

        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            size="lg"
          >
            Entrar
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  )
}
