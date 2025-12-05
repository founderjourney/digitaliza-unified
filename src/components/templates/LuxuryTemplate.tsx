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
  WineIcon,
  StarIcon
} from '@/components/ui/icons'

/**
 * LUXURY TEMPLATE
 *
 * Design Philosophy:
 * - Dark, sophisticated color palette
 * - Gold/champagne accents
 * - Elegant serif typography
 * - Subtle luxury animations
 * - Perfect for fine dining, wine bars, cocktail lounges
 *
 * Inspired by: Michelin-starred restaurants, Luxury hotels, High-end bars
 */

interface LuxuryTemplateProps extends TemplateProps {
  accentColor?: string
}

export default function LuxuryTemplate({
  restaurant,
  menuItems,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin = false,
  accentColor = '#d4a853' // Gold
}: LuxuryTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showReservation, setShowReservation] = useState(false)

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

  const whatsappUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `Buenas noches, me gustaría hacer una reserva en ${restaurant.name}.`
  )

  const goldGradient = `linear-gradient(135deg, ${accentColor} 0%, #f4e4ba 50%, ${accentColor} 100%)`

  return (
    <div
      data-theme="luxury"
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {restaurant.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-full object-cover border-2"
                  style={{ borderColor: accentColor }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: goldGradient }}
                >
                  <WineIcon size={24} className="text-black" />
                </div>
              )}
              <div>
                <h1 className="text-xl tracking-wider" style={{ color: accentColor }}>
                  {restaurant.name}
                </h1>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowReservation(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full text-black text-sm font-medium tracking-wider uppercase transition-transform hover:scale-105"
              style={{ background: goldGradient, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Reservar Mesa
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 pt-24">
        {/* Decorative elements */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center max-w-3xl mx-auto"
        >
          {/* Decorative line */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
              <StarIcon size={16} style={{ color: accentColor }} />
              <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
            </div>
          </div>

          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6"
            style={{
              background: goldGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {restaurant.name}
          </h2>

          <p
            className="text-lg text-[#888] max-w-xl mx-auto mb-10"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {restaurant.description || 'Una experiencia gastronómica inolvidable'}
          </p>

          <button
            onClick={() => setShowReservation(true)}
            className="px-8 py-4 rounded-full text-black font-medium tracking-wider uppercase transition-all hover:shadow-2xl hover:shadow-amber-500/20"
            style={{ background: goldGradient, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Reservar Ahora
          </button>
        </motion.div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg border-y border-[#222] py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide justify-center"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-1 py-2 text-sm tracking-wider uppercase border-b-2 transition-all ${
                activeCategory === null
                  ? 'border-current'
                  : 'border-transparent text-[#666] hover:text-white'
              }`}
              style={activeCategory === null ? { color: accentColor, borderColor: accentColor } : undefined}
            >
              Todo
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-1 py-2 text-sm tracking-wider uppercase border-b-2 transition-all ${
                  activeCategory === category
                    ? 'border-current'
                    : 'border-transparent text-[#666] hover:text-white'
                }`}
                style={activeCategory === category ? { color: accentColor, borderColor: accentColor } : undefined}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {Object.entries(filteredItems).map(([category, items], categoryIndex) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-20"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-px" style={{ backgroundColor: accentColor }} />
              <h3
                className="text-2xl md:text-3xl tracking-wider capitalize"
                style={{ color: accentColor }}
              >
                {category}
              </h3>
              <div className="flex-1 h-px bg-[#222]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-x-16 gap-y-8">
              {items.map((item, itemIndex) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: itemIndex * 0.05 }}
                  className={`group cursor-pointer ${!item.available ? 'opacity-40' : ''}`}
                  onClick={() => item.available && setSelectedItem(item)}
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-[#333]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-lg group-hover:text-amber-200 transition-colors">
                          {item.name}
                          {!item.available && (
                            <span className="ml-2 text-xs text-[#666]">(Agotado)</span>
                          )}
                        </h4>
                        <span
                          className="text-lg font-medium flex-shrink-0"
                          style={{ color: accentColor, fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {item.description && (
                        <p
                          className="text-sm text-[#666] leading-relaxed"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className="mt-6 h-px bg-[#222] group-hover:bg-[#333] transition-colors" />
                </motion.article>
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Name */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <StarIcon size={24} style={{ color: accentColor }} />
            </div>
            <h3
              className="text-3xl tracking-wider"
              style={{
                background: goldGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {restaurant.name}
            </h3>
          </div>

          {/* Info */}
          <div
            className="flex flex-wrap justify-center gap-8 text-sm text-[#666] mb-12"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} style={{ color: accentColor }} />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon size={16} style={{ color: accentColor }} />
              <span>{restaurant.phone}</span>
            </div>
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <div className="flex items-center gap-2">
                <ClockIcon size={16} style={{ color: accentColor }} />
                <span>{formatHours(restaurant.hours)}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowReservation(true)}
            className="px-10 py-4 rounded-full text-black font-medium tracking-wider uppercase transition-all hover:shadow-2xl hover:shadow-amber-500/20"
            style={{ background: goldGradient, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Reservar Mesa
          </button>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowReservation(true)}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50"
        style={{ background: goldGradient }}
      >
        <WhatsAppIcon size={24} className="text-black" />
      </button>

      {/* Reservation Modal */}
      <AnimatePresence>
        {showReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReservation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-[#333] w-full max-w-md rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <StarIcon size={24} className="mx-auto mb-4" style={{ color: accentColor }} />
                <h3 className="text-2xl mb-2" style={{ color: accentColor }}>
                  Reservaciones
                </h3>
                <p
                  className="text-[#666] text-sm"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Contáctenos para asegurar su mesa
                </p>
              </div>

              <div
                className="space-y-4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#333] hover:border-[#25D366] transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <WhatsAppIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">WhatsApp</div>
                    <div className="text-sm text-[#666]">Reserva instantánea</div>
                  </div>
                </a>

                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1a1a] border border-[#333] hover:border-amber-500 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: goldGradient }}
                  >
                    <PhoneIcon size={24} className="text-black" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Teléfono</div>
                    <div className="text-sm text-[#666]">{restaurant.phone}</div>
                  </div>
                </a>
              </div>

              <button
                onClick={() => setShowReservation(false)}
                className="w-full mt-6 py-3 text-[#666] text-sm hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#111] border border-[#333] w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl" style={{ color: accentColor }}>
                    {selectedItem.name}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] transition-colors"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                {selectedItem.description && (
                  <p
                    className="text-[#888] mb-6"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {selectedItem.description}
                  </p>
                )}

                <div
                  className="flex items-center justify-between pt-4 border-t border-[#333]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="text-2xl font-medium" style={{ color: accentColor }}>
                    {formatPrice(selectedItem.price)}
                  </span>

                  <a
                    href={generateWhatsAppUrl(
                      restaurant.whatsapp || restaurant.phone,
                      `Buenas noches, me interesa: ${selectedItem.name} (${formatPrice(selectedItem.price)})`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-black font-medium transition-transform hover:scale-105"
                    style={{ background: goldGradient }}
                  >
                    <WhatsAppIcon size={18} />
                    Ordenar
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
