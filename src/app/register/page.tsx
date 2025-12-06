'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getThemeOptions, themes, type ThemeKey } from '@/lib/themes'
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
  // Branding personalizado
  customPrimaryColor: string
  customSecondaryColor: string
  customAccentColor: string
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    customPrimaryColor: '',
    customSecondaryColor: '',
    customAccentColor: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [useCustomColors, setUseCustomColors] = useState(false)

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
        setApiError('Tipo de archivo no permitido. Use JPG, PNG, WebP o SVG.')
        return
      }
      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setApiError('El archivo es muy grande. Máximo 2MB.')
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setApiError('')
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    setIsLoading(true)

    try {
      // 1. Crear el restaurante
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
          // Colores personalizados (solo si están habilitados)
          customPrimaryColor: useCustomColors && formData.customPrimaryColor ? formData.customPrimaryColor : undefined,
          customSecondaryColor: useCustomColors && formData.customSecondaryColor ? formData.customSecondaryColor : undefined,
          customAccentColor: useCustomColors && formData.customAccentColor ? formData.customAccentColor : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || data.message || 'Error al crear el restaurante')
        return
      }

      // 2. Si hay logo, subirlo
      if (logoFile && data.id) {
        const logoFormData = new FormData()
        logoFormData.append('file', logoFile)
        logoFormData.append('restaurantId', data.id)
        logoFormData.append('type', 'logo')

        await fetch('/api/upload', {
          method: 'POST',
          body: logoFormData,
        })
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

  // Obtener colores del tema seleccionado para preview
  const selectedTheme = themes[formData.theme]
  const previewColors = {
    primary: useCustomColors && formData.customPrimaryColor ? formData.customPrimaryColor : selectedTheme.colors.primary,
    secondary: useCustomColors && formData.customSecondaryColor ? formData.customSecondaryColor : selectedTheme.colors.secondary,
    accent: useCustomColors && formData.customAccentColor ? formData.customAccentColor : selectedTheme.colors.primary,
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

          {/* ========== SECCIÓN DE BRANDING ========== */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Personaliza tu marca (Opcional)
            </h3>

            {/* Logo Upload */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo de tu negocio
              </label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50"
                  style={{ backgroundColor: previewColors.primary + '20' }}
                >
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{selectedTheme.emoji}</span>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <div className="flex gap-2">
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {logoPreview ? 'Cambiar' : 'Subir logo'}
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP o SVG. Máx 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Colors Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomColors}
                  onChange={(e) => setUseCustomColors(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Usar colores personalizados
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Si no, se usarán los colores del tema seleccionado
              </p>
            </div>

            {/* Color Pickers */}
            {useCustomColors && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-3">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Primario
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.customPrimaryColor || selectedTheme.colors.primary}
                        onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.customPrimaryColor || selectedTheme.colors.primary}
                        onChange={(e) => handleChange('customPrimaryColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Secundario
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.customSecondaryColor || selectedTheme.colors.secondary}
                        onChange={(e) => handleChange('customSecondaryColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.customSecondaryColor || selectedTheme.colors.secondary}
                        onChange={(e) => handleChange('customSecondaryColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Acento
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.customAccentColor || selectedTheme.colors.primary}
                        onChange={(e) => handleChange('customAccentColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.customAccentColor || selectedTheme.colors.primary}
                        onChange={(e) => handleChange('customAccentColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: previewColors.primary }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: previewColors.secondary }}
                    >
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo"
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain rounded-full"
                        />
                      ) : (
                        <span className="text-white text-lg">{selectedTheme.emoji}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {formData.name || 'Tu Negocio'}
                      </p>
                      <p className="text-white/70 text-xs">Vista previa de colores</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: previewColors.accent, color: 'white' }}
                    >
                      Botón de acción
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ========== FIN SECCIÓN DE BRANDING ========== */}

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
