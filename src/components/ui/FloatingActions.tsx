'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WhatsAppIcon, PhoneIcon, XIcon, SettingsIcon } from './icons'

interface FloatingActionsProps {
  whatsappUrl: string
  phoneNumber: string
  isAdmin?: boolean
  onAdminClick?: () => void
  accentColor?: string
}

export default function FloatingActions({
  whatsappUrl,
  phoneNumber,
  isAdmin = false,
  onAdminClick,
  accentColor = '#0f172a'
}: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const actionVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 300, damping: 20 }
    }),
    exit: { opacity: 0, scale: 0.8, y: 20 }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Admin button */}
            {isAdmin && (
              <motion.button
                custom={2}
                variants={actionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onAdminClick}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                         bg-slate-700 text-white hover:bg-slate-600 transition-colors"
              >
                <SettingsIcon size={22} />
              </motion.button>
            )}

            {/* Phone button */}
            <motion.a
              custom={1}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              href={`tel:${phoneNumber}`}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                       text-white transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              <PhoneIcon size={22} />
            </motion.a>

            {/* WhatsApp button */}
            <motion.a
              custom={0}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                       bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
            >
              <WhatsAppIcon size={22} />
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center
                 text-white transition-all"
        style={{ backgroundColor: isOpen ? '#64748b' : '#25D366' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? <XIcon size={24} /> : <WhatsAppIcon size={26} />}
      </motion.button>
    </div>
  )
}
