'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { TemplateProps, MenuItem } from '@/types'
import { formatPrice, generateWhatsAppUrl, formatHours } from '@/lib/utils'
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  XIcon,
  StarIcon,
  FireIcon,
  LeafIcon,
  SparklesIcon,
  ImageIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@/components/ui/icons'

/**
 * MODERN TEMPLATE
 *
 * Design Philosophy:
 * - Bold typography and vibrant colors
 * - Grid-based layout with cards
 * - Energetic micro-interactions
 * - App-like experience
 * - Perfect for casual/fast-casual restaurants
 *
 * Inspired by: Uber Eats, DoorDash, Rappi
 */

interface ModernTemplateProps extends TemplateProps {
  accentColor?: string
}

// Badge detection helper
function getItemBadges(item: MenuItem) {
  const badges: { icon: React.ReactNode; label: string; bg: string; text: string }[] = []
  const name = item.name.toLowerCase()
  const desc = (item.description || '').toLowerCase()

  if (name.includes('especial') || name.includes('favorit') || name.includes('popular')) {
    badges.push({ icon: <StarIcon size={12} />, label: 'Popular', bg: 'bg-amber-100', text: 'text-amber-700' })
  }
  if (name.includes('picant') || desc.includes('picant') || name.includes('spicy')) {
    badges.push({ icon: <FireIcon size={12} />, label: 'Picante', bg: 'bg-red-100', text: 'text-red-700' })
  }
  if (name.includes('vegan') || desc.includes('vegan') || desc.includes('vegetarian')) {
    badges.push({ icon: <LeafIcon size={12} />, label: 'Vegano', bg: 'bg-green-100', text: 'text-green-700' })
  }
  if (name.includes('nuevo') || name.includes('new')) {
    badges.push({ icon: <SparklesIcon size={12} />, label: 'Nuevo', bg: 'bg-blue-100', text: 'text-blue-700' })
  }

  return badges
}

export default function ModernTemplate({
  restaurant,
  menuItems,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAdmin = false,
  accentColor = '#f97316' // Orange by default
}: ModernTemplateProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])

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

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const cartTotal = cart.reduce(
    (sum, { item, quantity }) => sum + Number(item.price) * quantity,
    0
  )

  const cartItemCount = cart.reduce((sum, { quantity }) => sum + quantity, 0)

  const whatsappUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `¡Hola ${restaurant.name}! Quiero hacer un pedido:\n\n${cart
      .map(({ item, quantity }) => `• ${quantity}x ${item.name} - ${formatPrice(Number(item.price) * quantity)}`)
      .join('\n')}\n\nTotal: ${formatPrice(cartTotal)}`
  )

  return (
    <div
      data-theme="modern"
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header */}
      <motion.header
        ref={headerRef}
        className="fixed top-0 inset-x-0 z-50"
      >
        <motion.div
          style={{ opacity: headerOpacity }}
          className="absolute inset-0 bg-white border-b border-slate-100"
        />

        <div className="relative max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {restaurant.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  {restaurant.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-bold text-slate-900">{restaurant.name}</h1>
                <p className="text-xs text-slate-500">{restaurant.address}</p>
              </div>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 rounded-full transition-colors"
              style={{ backgroundColor: cartItemCount > 0 ? accentColor : '#f1f5f9' }}
            >
              <ShoppingBagIcon
                size={22}
                className={cartItemCount > 0 ? 'text-white' : 'text-slate-600'}
              />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="pt-24 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Cover image or gradient */}
          <div
            className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-6"
            style={{
              background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}44 100%)`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-center px-4"
                style={{ color: accentColor }}
              >
                {restaurant.description || '¡Bienvenidos!'}
              </motion.h2>
            </div>
          </div>

          {/* Quick info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600">
              <MapPinIcon size={16} />
              <span className="line-clamp-1">{restaurant.address}</span>
            </div>
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600">
                <ClockIcon size={16} />
                <span>{formatHours(restaurant.hours)}</span>
              </div>
            )}
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <PhoneIcon size={16} />
              <span>{restaurant.phone}</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-lg border-b border-slate-100 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={activeCategory === null ? { backgroundColor: accentColor } : undefined}
            >
              Todo
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                  activeCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={activeCategory === category ? { backgroundColor: accentColor } : undefined}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {Object.entries(filteredItems).map(([category, items]) => (
          <section key={category} className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 capitalize">
              {category}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, index) => {
                const badges = getItemBadges(item)

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative bg-white rounded-2xl border border-slate-100 overflow-hidden
                              hover:border-slate-200 hover:shadow-xl transition-all duration-300
                              ${!item.available ? 'opacity-60' : 'cursor-pointer'}`}
                    onClick={() => item.available && setSelectedItem(item)}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                          <ImageIcon size={48} className="text-slate-300" />
                        </div>
                      )}

                      {/* Badges */}
                      {badges.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {badges.map((badge, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                            >
                              {badge.icon}
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Sold out overlay */}
                      {!item.available && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-medium">
                            Agotado
                          </span>
                        </div>
                      )}

                      {/* Quick add button */}
                      {item.available && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-3 right-3 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: accentColor }}
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(item)
                          }}
                        >
                          <PlusIcon size={20} />
                        </motion.button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-lg font-bold"
                          style={{ color: accentColor }}
                        >
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Fixed bottom bar with WhatsApp CTA */}
      {cartItemCount === 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-slate-100 md:hidden">
          <a
            href={generateWhatsAppUrl(
              restaurant.whatsapp || restaurant.phone,
              `¡Hola ${restaurant.name}! Me gustaría hacer un pedido.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon size={22} />
            Hacer Pedido por WhatsApp
          </a>
        </div>
      )}

      {/* Cart button (when items in cart) */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-slate-100"
          >
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center justify-between w-full py-4 px-6 rounded-xl text-white font-semibold"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                  {cartItemCount}
                </span>
                <span>Ver pedido</span>
              </div>
              <span>{formatPrice(cartTotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-t-3xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold">Tu Pedido</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBagIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(({ item, quantity }) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
                            <ImageIcon size={24} className="text-slate-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-slate-500">{formatPrice(item.price)} c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCart(prev =>
                                prev
                                  .map(c =>
                                    c.item.id === item.id
                                      ? { ...c, quantity: c.quantity - 1 }
                                      : c
                                  )
                                  .filter(c => c.quantity > 0)
                              )
                            }}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600">Total</span>
                    <span className="text-2xl font-bold" style={{ color: accentColor }}>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <WhatsAppIcon size={22} />
                    Enviar Pedido por WhatsApp
                  </a>
                </div>
              )}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
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
                  <h3 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                {selectedItem.description && (
                  <p className="text-slate-600 mb-6">{selectedItem.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-2xl font-bold" style={{ color: accentColor }}>
                    {formatPrice(selectedItem.price)}
                  </span>

                  <button
                    onClick={() => {
                      addToCart(selectedItem)
                      setSelectedItem(null)
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
                    style={{ backgroundColor: accentColor }}
                  >
                    <PlusIcon size={20} />
                    Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
