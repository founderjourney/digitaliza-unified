'use client'

import { useState, useMemo } from 'react'
import { MenuItemCard } from './MenuItemCard'
import { CategoryTabs } from './CategoryTabs'
import { Button } from '@/components/ui'
import { getTheme, ThemeKey } from '@/lib/themes'
import { generateWhatsAppUrl } from '@/lib/utils'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number | string
  imageUrl?: string
  category: string
  available: boolean
}

interface MenuTemplateProps {
  restaurant: {
    name: string
    phone: string
    whatsapp: string
    address: string
    theme: ThemeKey
    hours: Record<string, string>
    logoUrl?: string
    description?: string
    items: MenuItem[]
  }
}

export function MenuTemplate({ restaurant }: MenuTemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const theme = getTheme(restaurant.theme)

  // Filter only available items
  const availableItems = useMemo(
    () => restaurant.items.filter((item) => item.available),
    [restaurant.items]
  )

  // Get unique categories from available items
  const categories = useMemo(() => {
    const cats = new Set(availableItems.map((item) => item.category))
    return Array.from(cats)
  }, [availableItems])

  // Filter items by selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return availableItems
    return availableItems.filter((item) => item.category === selectedCategory)
  }, [availableItems, selectedCategory])

  // Check if currently open (simplified)
  const isOpen = useMemo(() => {
    const now = new Date()
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const today = days[now.getDay()]
    const todayHours = restaurant.hours[today]

    if (!todayHours) return false

    const [openTime, closeTime] = todayHours.split('-')
    if (!openTime || !closeTime) return false

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const [openHour, openMin] = openTime.split(':').map(Number)
    const [closeHour, closeMin] = closeTime.split(':').map(Number)

    const openMinutes = openHour * 60 + (openMin || 0)
    const closeMinutes = closeHour * 60 + (closeMin || 0)

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
  }, [restaurant.hours])

  const handleReservation = () => {
    const url = generateWhatsAppUrl(restaurant.whatsapp, theme.messages.reservation)
    window.open(url, '_blank')
  }

  const handleOrder = () => {
    const url = generateWhatsAppUrl(restaurant.whatsapp, theme.messages.order)
    window.open(url, '_blank')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header - sticky */}
      <header
        className="sticky top-0 z-40 px-4 py-3 shadow-sm"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            {restaurant.logoUrl ? (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl">{theme.emoji}</span>
            )}
            <div>
              <h1
                className="font-bold text-lg leading-tight"
                style={{ color: theme.colors.text }}
              >
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span style={{ color: theme.colors.textMuted }}>
                  {isOpen ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Contactar por WhatsApp"
          >
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Category Tabs - sticky below header */}
      <div
        className="sticky top-[60px] z-30 px-4 py-2 border-b"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: `${theme.colors.textMuted}20`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            accentColor={theme.colors.primary}
          />
        </div>
      </div>

      {/* Menu Items - scrollable */}
      <main className="flex-1 px-4 py-4 pb-28">
        <div className="max-w-lg mx-auto space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: theme.colors.textMuted }}>
                No hay items disponibles en esta categoría
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                accentColor={theme.colors.primary}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer - fixed bottom */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 border-t shadow-lg"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: `${theme.colors.textMuted}20`,
        }}
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={handleReservation}
            className="flex-1"
          >
            Reservar
          </Button>
          <Button
            fullWidth
            onClick={handleOrder}
            className="flex-1"
            style={{
              backgroundColor: theme.colors.primary,
            }}
          >
            Hacer Pedido
          </Button>
        </div>
      </footer>
    </div>
  )
}
