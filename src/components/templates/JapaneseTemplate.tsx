'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateProps, MenuItem } from '@/types'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import AdminLogin from '@/components/auth/AdminLogin'
import AdminPanel from '@/components/admin/AdminPanel'

export default function JapaneseTemplate({ restaurant, menuItems, isAdmin = false }: TemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [localMenuItems, setLocalMenuItems] = useState(menuItems)

  // Admin authentication
  const { isAuthenticated, login, logout } = useAdminAuth({
    restaurantName: restaurant.slug
  })

  // Admin functions (placeholders for now)
  const handleUpdateMenuItem = (item: MenuItem) => {
    setLocalMenuItems(prev => prev.map(menuItem =>
      menuItem.id === item.id ? item : menuItem
    ))
  }

  const handleDeleteMenuItem = (itemId: string) => {
    setLocalMenuItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleAddMenuItem = (item: Omit<MenuItem, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(), // Temporary ID generation
      restaurantId: restaurant.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setLocalMenuItems(prev => [...prev, newItem])
  }

  const handleAdminLogin = () => {
    login()
    setShowAdminLogin(false)
    setAdminPanelOpen(true)
  }

  const handleAdminLogout = () => {
    logout()
    setAdminPanelOpen(false)
  }

  // Group menu items by category
  const menuByCategory = localMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  const categories = [
    { id: 'zensai', name: '🥢 Zensai (Entrantes)', emoji: '🥢' },
    { id: 'sushi', name: '🍣 Sushi & Sashimi', emoji: '🍣' },
    { id: 'ramen', name: '🍜 Ramen & Sopas', emoji: '🍜' },
    { id: 'tempura', name: '🍤 Tempura & Yakitori', emoji: '🍤' },
    { id: 'donburi', name: '🍱 Donburi & Gohan', emoji: '🍱' },
    { id: 'postres', name: '🍡 Postres Japoneses', emoji: '🍡' },
    { id: 'bebidas', name: '🍵 Té & Sake', emoji: '🍵' },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const formatWhatsAppMessage = (type: 'reservation' | 'contact') => {
    const baseMessage = `Hola ${restaurant.name}! `
    if (type === 'reservation') {
      return `${baseMessage}Me gustaría hacer una reserva.`
    }
    return `${baseMessage}Tengo una consulta.`
  }

  const whatsappUrl = (type: 'reservation' | 'contact' = 'contact') => {
    const message = encodeURIComponent(formatWhatsAppMessage(type))
    return `https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-japanese-bg to-japanese-accent/10 relative overflow-x-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute text-2xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '10%' }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute text-xl opacity-15"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '60%', right: '15%' }}
        >
          🍃
        </motion.div>
        <motion.div
          className="absolute text-lg opacity-25"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '20%', left: '20%' }}
        >
          🥢
        </motion.div>
      </div>

      {/* Mobile Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-japanese-primary/10 sticky top-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌸</span>
            <h1 className="text-xl font-bold text-japanese-primary">{restaurant.name}</h1>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-japanese-primary rounded-lg"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`h-0.5 bg-japanese-primary transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`h-0.5 bg-japanese-primary transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-japanese-primary transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 pb-3">
          <a
            href={`tel:${restaurant.phone}`}
            className="w-12 h-12 bg-japanese-primary text-white rounded-full flex items-center justify-center hover:bg-japanese-primary/90 transition-all"
          >
            📞
          </a>
          <a
            href={whatsappUrl('contact')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-all"
          >
            💬
          </a>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-12 h-12 bg-japanese-secondary text-white rounded-full flex items-center justify-center hover:bg-japanese-secondary/90 transition-all"
          >
            📍
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleMobileMenu}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="w-80 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-japanese-primary">{restaurant.name}</h2>
                    <p className="text-gray-600">🥢 Cocina Japonesa de Autor</p>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="text-2xl text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <nav className="space-y-4">
                  <button
                    onClick={() => scrollToSection('menu')}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-japanese-bg rounded-lg transition-colors"
                  >
                    🍱 Menú
                  </button>
                  <button
                    onClick={() => scrollToSection('links')}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-japanese-bg rounded-lg transition-colors"
                  >
                    🌸 Experiencias
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-japanese-bg rounded-lg transition-colors"
                  >
                    📞 Contacto
                  </button>
                  <a
                    href={whatsappUrl('reservation')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left px-4 py-3 text-lg hover:bg-japanese-bg rounded-lg transition-colors"
                  >
                    📅 Reservas
                  </a>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md mx-auto"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌸
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-japanese-primary mb-4">
              {restaurant.name}
            </h1>
            <p className="text-2xl text-japanese-secondary mb-2 font-light">
              おもてなし
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {restaurant.description || 'La esencia de la hospitalidad japonesa'}
            </p>

            <motion.a
              href={whatsappUrl('reservation')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📅</span>
              <span>Hacer Reserva</span>
            </motion.a>
          </motion.div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-japanese-primary mb-4">
                🍱 Nuestro Menú
              </h2>
              <p className="text-gray-600">
                Platillos auténticos preparados con técnicas tradicionales
              </p>
            </div>

            <div className="space-y-8">
              {categories.map((category) => {
                const items = menuByCategory[category.id] || []
                if (items.length === 0) return null

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-semibold text-japanese-primary mb-4 flex items-center">
                      <span className="text-2xl mr-2">{category.emoji}</span>
                      {category.name}
                    </h3>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex justify-between items-start p-4 rounded-lg transition-all ${
                            item.available
                              ? 'bg-white hover:shadow-md'
                              : 'bg-gray-100 opacity-60'
                          }`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                              {!item.available && (
                                <span className="ml-2 text-sm text-red-500">
                                  (Agotado)
                                </span>
                              )}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <span className="text-lg font-bold text-japanese-primary">
                              €{item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section id="links" className="py-12 px-4 bg-white/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-japanese-primary mb-4">
                🌸 Experiencias
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                href={whatsappUrl('reservation')}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-xl font-semibold mb-2">Experiencia Omakase</h3>
                  <p className="text-gray-600">Déjanos sorprenderte con nuestra selección del chef</p>
                </div>
              </motion.a>

              <motion.a
                href={whatsappUrl('contact')}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🍵</div>
                  <h3 className="text-xl font-semibold mb-2">Ceremonia del Té</h3>
                  <p className="text-gray-600">Participa en una auténtica ceremonia del té japonesa</p>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-japanese-primary mb-4">
                📞 Contacto
              </h2>
              <p className="text-gray-600">Encuéntranos y haz tu reserva</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.a
                href={`tel:${restaurant.phone}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-japanese-primary text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">📞</div>
                <h3 className="text-lg font-semibold mb-1">Llamar</h3>
                <p>{restaurant.phone}</p>
              </motion.a>

              <motion.a
                href={whatsappUrl('contact')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-green-500 text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">💬</div>
                <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
                <p>Reservas y consultas</p>
              </motion.a>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-japanese-secondary text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">📍</div>
                <h3 className="text-lg font-semibold mb-1">Ubicación</h3>
                <p>{restaurant.address}</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-japanese-accent text-japanese-secondary"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">🕒</div>
                <h3 className="text-lg font-semibold mb-1">Horarios</h3>
                <p>{restaurant.hours}</p>
              </motion.div>
            </div>

            {/* Social Media */}
            <div className="text-center bg-white/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-japanese-primary mb-6">
                🌸 Síguenos
              </h3>
              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="w-12 h-12 bg-japanese-primary text-white rounded-full flex items-center justify-center hover:bg-japanese-primary/90 transition-all"
                >
                  📷
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all"
                >
                  📘
                </a>
                <a
                  href={whatsappUrl('contact')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-all"
                >
                  💬
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Section - Only visible if isAdmin */}
        {isAdmin && (
          <section className="fixed bottom-4 right-4 z-40">
            <motion.button
              onClick={() => {
                if (isAuthenticated) {
                  setAdminPanelOpen(true)
                } else {
                  setShowAdminLogin(true)
                }
              }}
              className="w-14 h-14 bg-japanese-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-japanese-primary/90 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isAuthenticated ? '⚙️' : '🔐'}
            </motion.button>
          </section>
        )}
      </main>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLogin
            restaurantPassword={restaurant.password}
            onLogin={handleAdminLogin}
            onCancel={() => setShowAdminLogin(false)}
            restaurantName={restaurant.name}
            theme="japanese"
          />
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {adminPanelOpen && isAuthenticated && (
          <AdminPanel
            restaurant={restaurant}
            menuItems={localMenuItems}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onAddMenuItem={handleAddMenuItem}
            onLogout={handleAdminLogout}
            theme="japanese"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
