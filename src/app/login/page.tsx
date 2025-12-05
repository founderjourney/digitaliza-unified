'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FormData {
  slug: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    slug: '',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.slug || formData.slug.length < 2) {
      newErrors.slug = 'Ingresa el nombre de tu negocio'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Ingresa tu contrasena'
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || data.message || 'Credenciales invalidas')
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
            Digitaliza<span className="text-gray-800">WEB</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Inicia Sesion
          </h1>
          <p className="mt-2 text-gray-600">
            Accede a tu panel de administracion
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
            label="Nombre de tu negocio"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            error={errors.slug}
            placeholder="mi-restaurante"
            helperText="El nombre que usaste al registrarte"
          />

          <Input
            label="Contrasena"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            placeholder="Tu contrasena"
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="mt-6"
          >
            Iniciar Sesion
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-gray-600">
          No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Crea tu Digitaliza gratis
          </Link>
        </p>

        {/* Demo access */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">Quieres ver como funciona?</p>
          <Link
            href="/demo"
            className="text-blue-600 font-medium hover:underline"
          >
            Ver Templates de Ejemplo
          </Link>
        </div>
      </div>
    </div>
  )
}
