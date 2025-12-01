'use client'

import { cn } from '@/lib/utils'
import { Restaurant } from '@/types'

interface SettingsViewProps {
  restaurant: Restaurant
  colors: { primary: string }
  themeEmoji: string
}

export default function SettingsView({
  colors,
  themeEmoji
}: SettingsViewProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{themeEmoji}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h2>
      <p className="text-gray-600 mb-8">Personaliza la configuración de tu restaurante</p>
      <div className={cn("inline-block px-6 py-3 rounded-lg text-white font-medium", colors.primary)}>
        🔜 Próximamente
      </div>
    </div>
  )
}
