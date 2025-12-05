'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import LinksManager from './LinksManager'
import ReservationsManager from './ReservationsManager'

interface FloatingAdminButtonProps {
  slug: string
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
  accentColor?: string
}

export default function FloatingAdminButton({
  slug,
  isAuthenticated,
  onLogin,
  onLogout,
  accentColor = '#1a1a1a',
}: FloatingAdminButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const [showReservations, setShowReservations] = useState(false)

  const menuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${slug}`
    : `/${slug}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Mi Menú Digital',
        text: '¡Mira nuestro menú!',
        url: menuUrl,
      })
    } else {
      await navigator.clipboard.writeText(menuUrl)
      alert('URL copiada al portapapeles')
    }
    setIsExpanded(false)
  }

  const menuItems = isAuthenticated
    ? [
        { icon: '🔗', label: 'Enlaces', action: () => { setShowLinks(true); setIsExpanded(false) } },
        { icon: '📅', label: 'Reservas', action: () => { setShowReservations(true); setIsExpanded(false) } },
        { icon: '📱', label: 'QR', action: () => { setShowQR(true); setIsExpanded(false) } },
        { icon: '🔗', label: 'Compartir', action: handleShare },
        { icon: '🚪', label: 'Salir', action: () => { onLogout(); setIsExpanded(false) } },
      ]
    : [
        { icon: '🔐', label: 'Admin', action: onLogin },
      ]

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-16 right-0 mb-2"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px]">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left',
                      'hover:bg-gray-50 transition-colors',
                      'text-gray-700 font-medium',
                      index !== menuItems.length - 1 && 'border-b border-gray-100'
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg flex items-center justify-center',
            'text-white text-2xl transition-all',
            isExpanded ? 'rotate-45' : ''
          )}
          style={{ backgroundColor: accentColor }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isAuthenticated ? (isExpanded ? '✕' : '⚙️') : '🔐'}
        </motion.button>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tu Código QR</h3>

              {/* QR Code using external service */}
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <p className="text-sm text-gray-500 mb-4 break-all">{menuUrl}</p>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Compartir
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links Manager Modal */}
      <LinksManager
        slug={slug}
        isOpen={showLinks}
        onClose={() => setShowLinks(false)}
      />

      {/* Reservations Manager Modal */}
      <ReservationsManager
        slug={slug}
        isOpen={showReservations}
        onClose={() => setShowReservations(false)}
      />
    </>
  )
}
