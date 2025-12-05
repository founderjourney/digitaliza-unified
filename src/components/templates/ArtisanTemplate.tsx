'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateProps, MenuItem } from '@/types'
import { formatPrice, generateWhatsAppUrl, formatHours } from '@/lib/utils'
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  XIcon,
  CoffeeIcon,
  HeartIcon
} from '@/components/ui/icons'

/**
 * ARTISAN TEMPLATE
 *
 * Design Philosophy:
 * - Warm, earthy color palette
 * - Organic shapes and textures
 * - Handcrafted, boutique feel
 * - Focus on storytelling
 * - Perfect for cafés, bakeries, artisan restaurants
 *
 * Inspired by: Specialty coffee shops, Boutique bakeries, Farm-to-table restaurants
 */

interface ArtisanTemplateProps extends TemplateProps {
  accentColor?: string
}

export default function ArtisanTemplate({
  restaurant,
  menuItems,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin = false,
  accentColor = '#92400e' // Amber/Brown
}: ArtisanTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  // Group items by category
  const categorizedItems = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {}
    menuItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => a.order - b.order)
    })
    return grouped
  }, [menuItems])

  const categories = Object.keys(categorizedItems)

  const filteredItems = activeCategory
    ? { [activeCategory]: categorizedItems[activeCategory] }
    : categorizedItems

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const whatsappUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `¡Hola ${restaurant.name}! Me encantaría visitarlos. ¿Tienen disponibilidad?`
  )

  return (
    <div
      data-theme="artisan"
      className="min-h-screen bg-[#faf8f5]"
      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
    >
      {/* Decorative background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${accentColor.replace('#', '')}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e4df]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {restaurant.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#e8e4df]"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <CoffeeIcon size={24} />
                </div>
              )}
              <div>
                <h1 className="text-xl text-[#3d3d3d]">{restaurant.name}</h1>
                <p
                  className="text-sm text-[#8b8378]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {restaurant.description || 'Hecho con amor'}
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <WhatsAppIcon size={18} />
              Reservar
            </a>
          </div>
        </div>
      </header>

      {/* Hero with warm aesthetic */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative element */}
            <div className="flex justify-center mb-6">
              <svg width="80" height="20" viewBox="0 0 80 20" fill="none" className="text-[#d4c4b0]">
                <path
                  d="M0 10 Q20 0 40 10 Q60 20 80 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#3d3d3d] leading-tight mb-4">
              Bienvenidos a<br />
              <span style={{ color: accentColor }}>{restaurant.name}</span>
            </h2>

            <p
              className="text-lg text-[#8b8378] max-w-lg mx-auto mb-8"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {restaurant.description || 'Donde cada detalle cuenta y cada sabor tiene una historia'}
            </p>

            {/* Info cards */}
            <div
              className="flex flex-wrap justify-center gap-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-[#e8e4df] shadow-sm">
                <MapPinIcon size={18} style={{ color: accentColor }} />
                <span className="text-sm text-[#5a5a5a]">{restaurant.address}</span>
              </div>
              {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-[#e8e4df] shadow-sm">
                  <ClockIcon size={18} style={{ color: accentColor }} />
                  <span className="text-sm text-[#5a5a5a]">{formatHours(restaurant.hours)}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[81px] z-40 bg-[#faf8f5]/95 backdrop-blur-md border-y border-[#e8e4df] py-4">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="flex gap-3 overflow-x-auto scrollbar-hide"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'text-white shadow-md'
                  : 'bg-white text-[#5a5a5a] border border-[#e8e4df] hover:border-[#d4c4b0]'
              }`}
              style={activeCategory === null ? { backgroundColor: accentColor } : undefined}
            >
              Todo el Menú
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  activeCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-white text-[#5a5a5a] border border-[#e8e4df] hover:border-[#d4c4b0]'
                }`}
                style={activeCategory === category ? { backgroundColor: accentColor } : undefined}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {Object.entries(filteredItems).map(([category, items]) => (
          <section key={category} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl text-[#3d3d3d] capitalize">{category}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#d4c4b0] to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative bg-white rounded-3xl border border-[#e8e4df] overflow-hidden
                            transition-all duration-300 hover:shadow-xl hover:border-[#d4c4b0]
                            ${!item.available ? 'opacity-60' : 'cursor-pointer'}`}
                  onClick={() => item.available && setSelectedItem(item)}
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#f5f0eb] to-[#e8e4df] flex items-center justify-center">
                          <CoffeeIcon size={32} className="text-[#d4c4b0]" />
                        </div>
                      )}

                      {!item.available && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="text-xs text-[#8b8378]">Agotado</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-lg text-[#3d3d3d] leading-tight">{item.name}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(item.id)
                          }}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            favorites.includes(item.id)
                              ? 'bg-red-50 text-red-500'
                              : 'bg-[#f5f0eb] text-[#d4c4b0] hover:text-red-400'
                          }`}
                        >
                          <HeartIcon
                            size={16}
                            fill={favorites.includes(item.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>

                      {item.description && (
                        <p
                          className="text-sm text-[#8b8378] mt-1 line-clamp-2 flex-1"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}

                      <div
                        className="mt-3 flex items-center justify-between"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        <span className="text-lg font-semibold" style={{ color: accentColor }}>
                          {formatPrice(item.price)}
                        </span>

                        {item.available && (
                          <span className="text-xs text-[#8b8378] opacity-0 group-hover:opacity-100 transition-opacity">
                            Toca para ver más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#3d3d3d] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl mb-4">{restaurant.name}</h3>
            <p
              className="text-[#a0a0a0] max-w-md mx-auto"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {restaurant.description || 'Gracias por elegirnos. Cada taza, cada plato, es una historia de pasión.'}
            </p>
          </div>

          <div
            className="flex flex-wrap justify-center gap-8 text-sm text-[#a0a0a0] mb-12"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon size={16} />
              <span>{restaurant.phone}</span>
            </div>
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <div className="flex items-center gap-2">
                <ClockIcon size={16} />
                <span>{formatHours(restaurant.hours)}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full text-sm font-medium hover:bg-[#20BD5A] transition-colors"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <WhatsAppIcon size={20} />
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center z-50"
      >
        <WhatsAppIcon size={26} />
      </a>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#faf8f5] w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.imageUrl ? (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-[#f5f0eb] to-[#e8e4df] flex items-center justify-center">
                  <CoffeeIcon size={64} className="text-[#d4c4b0]" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl text-[#3d3d3d]">{selectedItem.name}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#e8e4df] hover:bg-[#f5f0eb] transition-colors"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                {selectedItem.description && (
                  <p
                    className="text-[#8b8378] mb-6"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {selectedItem.description}
                  </p>
                )}

                <div
                  className="flex items-center justify-between pt-4 border-t border-[#e8e4df]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="text-2xl font-semibold" style={{ color: accentColor }}>
                    {formatPrice(selectedItem.price)}
                  </span>

                  <a
                    href={generateWhatsAppUrl(
                      restaurant.whatsapp || restaurant.phone,
                      `¡Hola! Me encantaría pedir: ${selectedItem.name} (${formatPrice(selectedItem.price)})`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full text-sm font-medium hover:bg-[#20BD5A] transition-colors"
                  >
                    <WhatsAppIcon size={18} />
                    Pedir ahora
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
