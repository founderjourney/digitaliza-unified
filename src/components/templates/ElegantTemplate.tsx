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
  XIcon
} from '@/components/ui/icons'

/**
 * ELEGANT TEMPLATE
 *
 * Design Philosophy:
 * - Minimalist with generous whitespace
 * - Serif typography for sophistication
 * - Subtle animations, no flashy elements
 * - Focus on photography and content
 * - Premium feel for upscale restaurants
 *
 * Inspired by: Fine dining websites, Apple design, Aesop
 */

interface ElegantTemplateProps extends TemplateProps {
  accentColor?: string
}

export default function ElegantTemplate({
  restaurant,
  menuItems,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accentColor = '#1a1a1a'
}: ElegantTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showContact, setShowContact] = useState(false)

  // Group items by category
  const categorizedItems = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {}
    menuItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    // Sort items within each category
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
    `Buenas, me gustaría hacer una reserva en ${restaurant.name}.`
  )

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  }

  const slideUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' as const }
  }

  return (
    <div
      data-theme="elegant"
      className="min-h-screen bg-[#fafaf9] text-[#1a1a1a]"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Header - Minimal and elegant */}
      <header className="sticky top-0 z-50 bg-[#fafaf9]/95 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div {...fadeIn} className="flex items-center gap-4">
              {restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <h1 className="text-xl font-medium tracking-tight">{restaurant.name}</h1>
            </motion.div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowContact(true)}
                className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Contacto
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-full hover:bg-[#333] transition-colors"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Reservar
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - Clean and focused */}
      <section className="relative py-20 px-6">
        <motion.div
          {...slideUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6">
            {restaurant.name}
          </h2>
          {restaurant.description && (
            <p
              className="text-lg md:text-xl text-[#666] max-w-xl mx-auto mb-10"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {restaurant.description}
            </p>
          )}

          <div
            className="flex flex-wrap justify-center gap-6 text-sm text-[#888]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <span className="flex items-center gap-2">
              <MapPinIcon size={16} />
              {restaurant.address}
            </span>
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <span className="flex items-center gap-2">
                <ClockIcon size={16} />
                {formatHours(restaurant.hours)}
              </span>
            )}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#ddd] to-transparent" />
      </div>

      {/* Category Filter */}
      <nav className="sticky top-[73px] z-40 bg-[#fafaf9]/95 backdrop-blur-md py-4 border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 text-sm rounded-full transition-all ${
                activeCategory === null
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
              }`}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Todo
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-5 py-2 text-sm rounded-full transition-all capitalize ${
                  activeCategory === category
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
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
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
            className="mb-20 last:mb-0"
          >
            <h3 className="text-3xl md:text-4xl font-light mb-12 capitalize">
              {category}
            </h3>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
              {items.map((item, itemIndex) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: itemIndex * 0.05, duration: 0.5 }}
                  className={`group cursor-pointer ${!item.available ? 'opacity-50' : ''}`}
                  onClick={() => item.available && setSelectedItem(item)}
                >
                  {/* Image (if available) */}
                  {item.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg aspect-[4/3]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium mb-1 group-hover:underline underline-offset-4">
                        {item.name}
                        {!item.available && (
                          <span
                            className="ml-2 text-xs text-[#999]"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                          >
                            (Agotado)
                          </span>
                        )}
                      </h4>
                      {item.description && (
                        <p
                          className="text-sm text-[#666] leading-relaxed"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-lg font-medium whitespace-nowrap"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Elegant divider */}
                  <div className="mt-6 h-px bg-[#e5e5e5] group-hover:bg-[#ccc] transition-colors" />
                </motion.article>
              ))}
            </div>
          </motion.section>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-2xl font-light mb-4">{restaurant.name}</h4>
              {restaurant.description && (
                <p
                  className="text-[#888] text-sm"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {restaurant.description}
                </p>
              )}
            </div>

            <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <h5 className="text-sm uppercase tracking-wider text-[#888] mb-4">Ubicación</h5>
              <p className="text-sm mb-2">{restaurant.address}</p>
              {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                <p className="text-sm text-[#888]">{formatHours(restaurant.hours)}</p>
              )}
            </div>

            <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <h5 className="text-sm uppercase tracking-wider text-[#888] mb-4">Contacto</h5>
              <div className="space-y-3">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-[#ccc] transition-colors"
                >
                  <PhoneIcon size={16} />
                  {restaurant.phone}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-[#ccc] transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[#333] text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1a1a1a] text-sm rounded-full hover:bg-[#f0f0f0] transition-colors"
            >
              <WhatsAppIcon size={18} />
              Hacer Reserva
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Mobile) */}
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
              className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden"
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
                  <h3 className="text-2xl font-light">{selectedItem.name}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                {selectedItem.description && (
                  <p
                    className="text-[#666] mb-6"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {selectedItem.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
                  <span
                    className="text-2xl font-medium"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {formatPrice(selectedItem.price)}
                  </span>

                  <a
                    href={generateWhatsAppUrl(
                      restaurant.whatsapp || restaurant.phone,
                      `Hola, me interesa pedir: ${selectedItem.name} (${formatPrice(selectedItem.price)})`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full text-sm hover:bg-[#20BD5A] transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
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

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light">Contacto</h3>
                <button
                  onClick={() => setShowContact(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div
                className="space-y-4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f9f9f9] hover:bg-[#f0f0f0] transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                    <WhatsAppIcon size={22} />
                  </div>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-[#666]">Escríbenos directamente</div>
                  </div>
                </a>

                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f9f9f9] hover:bg-[#f0f0f0] transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center">
                    <PhoneIcon size={22} />
                  </div>
                  <div>
                    <div className="font-medium">Teléfono</div>
                    <div className="text-sm text-[#666]">{restaurant.phone}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f9f9f9]">
                  <div className="w-12 h-12 rounded-full bg-[#666] text-white flex items-center justify-center">
                    <MapPinIcon size={22} />
                  </div>
                  <div>
                    <div className="font-medium">Ubicación</div>
                    <div className="text-sm text-[#666]">{restaurant.address}</div>
                  </div>
                </div>

                {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f9f9f9]">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <ClockIcon size={22} />
                    </div>
                    <div>
                      <div className="font-medium">Horarios</div>
                      <div className="text-sm text-[#666]">{formatHours(restaurant.hours)}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
