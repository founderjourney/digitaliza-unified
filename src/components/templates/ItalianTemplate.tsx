'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TemplateProps } from '@/types'
import { formatHours } from '@/lib/utils'

export default function ItalianTemplate({ restaurant, menuItems, isAdmin = false }: TemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>)

  const categories = [
    { id: 'antipasti', name: '🥖 Antipasti', emoji: '🥖' },
    { id: 'primi', name: '🍝 Primi Piatti', emoji: '🍝' },
    { id: 'secondi', name: '🥩 Secondi Piatti', emoji: '🥩' },
    { id: 'pizza', name: '🍕 Pizza', emoji: '🍕' },
    { id: 'contorni', name: '🥗 Contorni', emoji: '🥗' },
    { id: 'dolci', name: '🍨 Dolci', emoji: '🍨' },
    { id: 'bevande', name: '🍷 Bevande', emoji: '🍷' },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const toggleAdminPanel = () => setAdminPanelOpen(!adminPanelOpen)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const formatWhatsAppMessage = (type: 'reservation' | 'contact') => {
    const baseMessage = `Ciao ${restaurant.name}! `
    if (type === 'reservation') {
      return `${baseMessage}Vorrei prenotare un tavolo.`
    }
    return `${baseMessage}Ho una domanda.`
  }

  const whatsappUrl = (type: 'reservation' | 'contact' = 'contact') => {
    const message = encodeURIComponent(formatWhatsAppMessage(type))
    return `https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-italian-bg to-italian-accent/10 relative overflow-x-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute text-2xl opacity-20"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '15%', left: '15%' }}
        >
          🍝
        </motion.div>
        <motion.div
          className="absolute text-xl opacity-15"
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '55%', right: '20%' }}
        >
          🍷
        </motion.div>
        <motion.div
          className="absolute text-lg opacity-25"
          animate={{
            y: [0, -25, 0],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '25%', left: '25%' }}
        >
          🌿
        </motion.div>
      </div>

      {/* Mobile Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-italian-primary/10 sticky top-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🍝</span>
            <h1 className="text-xl font-bold text-italian-primary">{restaurant.name}</h1>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-italian-primary rounded-lg"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className={`h-0.5 bg-italian-primary transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`h-0.5 bg-italian-primary transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-italian-primary transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 pb-3">
          <a
            href={`tel:${restaurant.phone}`}
            className="w-12 h-12 bg-italian-primary text-white rounded-full flex items-center justify-center hover:bg-italian-primary/90 transition-all"
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
            className="w-12 h-12 bg-italian-secondary text-white rounded-full flex items-center justify-center hover:bg-italian-secondary/90 transition-all"
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
                    <h2 className="text-xl font-bold text-italian-primary">{restaurant.name}</h2>
                    <p className="text-gray-600">🍝 Auténtica Cocina Italiana</p>
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
                    className="w-full text-left px-4 py-3 text-lg hover:bg-italian-bg rounded-lg transition-colors"
                  >
                    🍝 Menù
                  </button>
                  <button
                    onClick={() => scrollToSection('links')}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-italian-bg rounded-lg transition-colors"
                  >
                    🍷 Especialidades
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="w-full text-left px-4 py-3 text-lg hover:bg-italian-bg rounded-lg transition-colors"
                  >
                    📞 Contatto
                  </button>
                  <a
                    href={whatsappUrl('reservation')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left px-4 py-3 text-lg hover:bg-italian-bg rounded-lg transition-colors"
                  >
                    📅 Prenotazioni
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
              🍝
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-italian-primary mb-4">
              {restaurant.name}
            </h1>
            <p className="text-2xl text-italian-secondary mb-2 font-light italic">
              Benvenuti alla Famiglia
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {restaurant.description || 'Auténtica cocina italiana de la nonna'}
            </p>

            <motion.a
              href={whatsappUrl('reservation')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-italian-primary hover:bg-italian-primary/90 inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>📅</span>
              <span>Prenota Tavolo</span>
            </motion.a>
          </motion.div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-italian-primary mb-4">
                🍝 Il Nostro Menù
              </h2>
              <p className="text-gray-600">
                Ricette tradizionali della nonna con ingredienti freschi
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-italian-primary/10"
                  >
                    <h3 className="text-xl font-semibold text-italian-primary mb-4 flex items-center">
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
                                  (Esaurito)
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
                            <span className="text-lg font-bold text-italian-primary">
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
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-italian-primary mb-4">
                🍷 Le Nostre Specialità
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                href={whatsappUrl('reservation')}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg transition-all border border-italian-primary/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🍝</div>
                  <h3 className="text-xl font-semibold mb-2">Pasta Fresca</h3>
                  <p className="text-gray-600">Hecha diariamente con las mejores harinas italianas</p>
                </div>
              </motion.a>

              <motion.a
                href={whatsappUrl('contact')}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover:shadow-lg transition-all border border-italian-primary/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🍷</div>
                  <h3 className="text-xl font-semibold mb-2">Vinos Italianos</h3>
                  <p className="text-gray-600">Selección de los mejores viñedos de Italia</p>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-italian-primary mb-4">
                📞 Contatto
              </h2>
              <p className="text-gray-600">Vieni a trovarci e prenota il tuo tavolo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.a
                href={`tel:${restaurant.phone}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-italian-primary text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">📞</div>
                <h3 className="text-lg font-semibold mb-1">Chiamare</h3>
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
                <p>Prenotazioni e informazioni</p>
              </motion.a>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-italian-secondary text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">📍</div>
                <h3 className="text-lg font-semibold mb-1">Indirizzo</h3>
                <p>{restaurant.address}</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-2xl text-center bg-italian-accent text-italian-secondary"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-2">🕒</div>
                <h3 className="text-lg font-semibold mb-1">Orari</h3>
                <p>{formatHours(restaurant.hours)}</p>
              </motion.div>
            </div>

            {/* Social Media */}
            <div className="text-center bg-white/50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-italian-primary mb-6">
                🍝 Seguici
              </h3>
              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="w-12 h-12 bg-italian-primary text-white rounded-full flex items-center justify-center hover:bg-italian-primary/90 transition-all"
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
              onClick={toggleAdminPanel}
              className="w-14 h-14 bg-italian-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-italian-primary/90 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ⚙️
            </motion.button>
          </section>
        )}
      </main>

      {/* Admin Panel */}
      <AnimatePresence>
        {adminPanelOpen && isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
            onClick={toggleAdminPanel}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Pannello Amministrazione
                  </h3>
                  <button
                    onClick={toggleAdminPanel}
                    className="text-2xl text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center text-gray-600">
                  <p>Gestione menù e configurazione</p>
                  <p className="text-sm mt-2">
                    Prossimamente: Gestione completa da mobile
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
