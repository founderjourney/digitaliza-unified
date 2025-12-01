'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdminLoginProps {
  restaurantPassword: string
  onLogin: () => void
  onCancel: () => void
  restaurantName: string
  theme?: 'japanese' | 'italian' | 'mexican' | 'coffee'
}

export default function AdminLogin({
  restaurantPassword,
  onLogin,
  onCancel,
  restaurantName,
  theme = 'japanese'
}: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Theme colors
  const themeColors = {
    japanese: {
      primary: 'bg-red-600 hover:bg-red-700',
      secondary: 'bg-red-100 text-red-700',
      accent: 'border-red-300 focus:border-red-500',
      gradient: 'from-red-50 to-pink-50'
    },
    italian: {
      primary: 'bg-green-600 hover:bg-green-700',
      secondary: 'bg-green-100 text-green-700',
      accent: 'border-green-300 focus:border-green-500',
      gradient: 'from-green-50 to-yellow-50'
    },
    mexican: {
      primary: 'bg-red-600 hover:bg-red-700',
      secondary: 'bg-orange-100 text-red-700',
      accent: 'border-orange-300 focus:border-red-500',
      gradient: 'from-orange-50 to-red-50'
    },
    coffee: {
      primary: 'bg-amber-600 hover:bg-amber-700',
      secondary: 'bg-amber-100 text-amber-700',
      accent: 'border-amber-300 focus:border-amber-500',
      gradient: 'from-amber-50 to-orange-50'
    }
  }

  const colors = themeColors[theme]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === restaurantPassword) {
      onLogin()
    } else {
      setError('Contraseña incorrecta')
      setPassword('')
    }

    setIsLoading(false)
  }

  const themeEmoji = {
    japanese: '🌸',
    italian: '🍷',
    mexican: '🌮',
    coffee: '☕'
  }

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${colors.gradient} flex items-center justify-center p-4 z-50`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-white max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {themeEmoji[theme]}
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel Admin
          </h1>
          <p className="text-gray-600">
            {restaurantName}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña de Administrador
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-4 py-4 text-lg border-2 rounded-xl transition-all",
                "focus:outline-none focus:ring-4 focus:ring-opacity-20",
                colors.accent,
                error ? 'border-red-500 focus:border-red-500' : ''
              )}
              placeholder="Ingresa tu contraseña"
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mt-2 flex items-center gap-2"
              >
                ⚠️ {error}
              </motion.p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!password || isLoading}
              className={cn(
                "w-full py-4 text-lg font-bold text-white rounded-xl transition-all",
                "transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                colors.primary,
                "flex items-center justify-center gap-3"
              )}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Verificando...
                </>
              ) : (
                <>
                  🔐 Acceder al Panel
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-4 text-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-20 disabled:opacity-50"
            >
              ← Volver al Menú
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className={cn("mt-6 p-4 rounded-xl text-sm", colors.secondary)}>
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-medium mb-1">¿Olvidaste tu contraseña?</p>
              <p className="opacity-80">Contacta al soporte técnico de Digitaliza para recuperar el acceso.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
