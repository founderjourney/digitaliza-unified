'use client'

import { useState, useEffect } from 'react'
import { Restaurant, MenuItem } from '@/types'
import { cn, formatPrice, generateWhatsAppUrl } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface CoffeeTemplateProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
  isAdmin?: boolean
}

export default function CoffeeTemplate({ restaurant, menuItems, isAdmin = false }: CoffeeTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState(400)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      const handleResize = () => setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Group menu items by category
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  // Category translations and icons for coffee shop
  const categoryMap: Record<string, { name: string; icon: string; description: string }> = {
    cafes: { name: 'Cafés', icon: '☕', description: 'Especialidades de la casa' },
    bebidas: { name: 'Bebidas Frías', icon: '🧊', description: 'Refrescantes y deliciosas' },
    reposteria: { name: 'Repostería', icon: '🧁', description: 'Dulces artesanales' },
    desayunos: { name: 'Desayunos', icon: '🥐', description: 'Para empezar el día' },
    snacks: { name: 'Snacks', icon: '🥪', description: 'Bocados ligeros' },
    especiales: { name: 'Especiales', icon: '⭐', description: 'Nuestras creaciones únicas' }
  }

  const formatWhatsAppMessage = (type: 'reservation' | 'contact' = 'contact') => {
    if (type === 'reservation') {
      return `¡Hola ${restaurant.name}! ☕\n\nMe gustaría reservar una mesa:\n• Fecha: \n• Hora: \n• Número de personas: \n• Nombre: \n\n¡Gracias! ☕`
    }
    return `¡Hola ${restaurant.name}! ☕\n\nMe gustaría obtener más información sobre sus servicios.\n\n¡Gracias! 😊`
  }

  const whatsappUrl = (type: 'reservation' | 'contact' = 'contact') => {
    return generateWhatsAppUrl(restaurant.whatsapp || restaurant.phone, formatWhatsAppMessage(type))
  }

  // Floating elements animation for coffee vibe
  const floatingElements = [
    { emoji: '☕', delay: 0, duration: 4 },
    { emoji: '🫘', delay: 1, duration: 3.5 },
    { emoji: '🥐', delay: 2, duration: 4.5 },
    { emoji: '🧁', delay: 0.5, duration: 3.8 },
    { emoji: '🍰', delay: 1.5, duration: 4.2 },
    { emoji: '☁️', delay: 2.5, duration: 5 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Floating Coffee Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20 pointer-events-none z-0"
          initial={{ y: '100vh', x: Math.random() * windowWidth }}
          animate={{
            y: '-100px',
            x: Math.random() * windowWidth
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold text-white flex items-center gap-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              ☕ {restaurant.name}
            </motion.h1>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <motion.span
                  className="block w-full h-0.5 bg-white origin-center transition-all"
                  animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-white transition-all"
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-white origin-center transition-all"
                  animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                />
              </div>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              <a href="#menu" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Menú
              </a>
              <a href="#contact" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Contacto
              </a>
              <a
                href={whatsappUrl('reservation')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-amber-800 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                📱 Reservar
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-amber-900 border-t border-amber-700"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                <a
                  href="#menu"
                  className="block text-white hover:text-yellow-200 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ☕ Menú
                </a>
                <a
                  href="#contact"
                  className="block text-white hover:text-yellow-200 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📞 Contacto
                </a>
                <a
                  href={whatsappUrl('reservation')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-yellow-400 text-amber-800 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📱 Hacer Reservación
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center relative z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-4">
              <span className="text-5xl md:text-7xl">☕</span>
              Bienvenidos
              <span className="text-5xl md:text-7xl">🫘</span>
            </h2>
            <p className="text-xl md:text-2xl text-amber-700 font-medium">
              {restaurant.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-300"
          >
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                  📍 Ubicación
                </h3>
                <p className="text-gray-700">{restaurant.address}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                  🕒 Horarios
                </h3>
                <p className="text-gray-700">{typeof restaurant.hours === 'string' ? restaurant.hours : 'Lun-Dom: 8am-8pm'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={whatsappUrl('reservation')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              📱 Reservar Mesa
            </a>
            <a
              href={`tel:${restaurant.phone}`}
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              📞 Llamar
            </a>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-12 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-3">
              ☕ Nuestro Menú 🧁
            </h2>
            <p className="text-xl text-amber-700">El mejor café y repostería artesanal</p>
          </motion.div>

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105",
                selectedCategory === null
                  ? "bg-amber-600 text-white shadow-lg"
                  : "bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50"
              )}
            >
              ☕ Todo el Menú
            </button>
            {Object.entries(categoryMap).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105",
                  selectedCategory === key
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50"
                )}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="space-y-12">
            {Object.entries(categories).map(([categoryKey, items]) => {
              if (selectedCategory && selectedCategory !== categoryKey) return null

              const category = categoryMap[categoryKey] || { name: categoryKey, icon: '☕', description: '' }

              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-yellow-300"
                >
                  <h3 className="text-3xl font-bold text-amber-800 mb-6 flex items-center gap-3">
                    <span className="text-4xl">{category.icon}</span>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-amber-700 mb-6 text-lg italic">{category.description}</p>
                  )}

                  <div className="grid gap-6">
                    {items
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={cn(
                          "flex justify-between items-start gap-4 p-4 rounded-xl transition-all",
                          item.available
                            ? "hover:bg-yellow-50 border-l-4 border-yellow-400"
                            : "opacity-50 grayscale"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900">
                              {item.name}
                            </h4>
                            {!item.available && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                                No disponible
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-amber-600">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 px-4 bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 flex items-center justify-center gap-3">
              📱 ¡Contáctanos! ☕
            </h2>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-yellow-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                    🏠 Visítanos
                  </h3>
                  <p className="text-gray-700 mb-4">{restaurant.address}</p>
                  <p className="text-gray-700 mb-6">
                    <strong>Horarios:</strong> {typeof restaurant.hours === 'string' ? restaurant.hours : 'Lun-Dom: 8am-8pm'}
                  </p>

                  <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                    📞 Llámanos
                  </h3>
                  <p className="text-gray-700">
                    <a href={`tel:${restaurant.phone}`} className="text-amber-600 hover:text-amber-800 font-medium">
                      {restaurant.phone}
                    </a>
                  </p>
                </div>

                <div className="text-left">
                  <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                    💬 WhatsApp
                  </h3>
                  <p className="text-gray-700 mb-6">
                    ¡Reserva tu mesa o pregunta sobre nuestras especialidades!
                  </p>

                  <div className="space-y-3">
                    <a
                      href={whatsappUrl('reservation')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all transform hover:scale-105 text-center"
                    >
                      ☕ Hacer Reservación
                    </a>
                    <a
                      href={whatsappUrl('contact')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-amber-600 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-700 transition-all transform hover:scale-105 text-center"
                    >
                      💬 Enviar Mensaje
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
            title="Panel de Administración"
          >
            ⚙️
          </motion.button>
        </div>
      )}
    </div>
  )
}
