'use client'

import { motion } from 'framer-motion'
import { Restaurant } from '@/types'
import { WhatsAppIcon, PhoneIcon, MapPinIcon, ClockIcon } from './icons'
import { formatHours, generateWhatsAppUrl } from '@/lib/utils'

interface HeroSectionProps {
  restaurant: Restaurant
  variant?: 'minimal' | 'centered' | 'split' | 'overlay'
  showQuickActions?: boolean
  showInfo?: boolean
  backgroundImage?: string
  accentColor?: string
  className?: string
}

export default function HeroSection({
  restaurant,
  variant = 'centered',
  showQuickActions = true,
  showInfo = true,
  backgroundImage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accentColor = '#0f172a',
  className = ''
}: HeroSectionProps) {
  const whatsappUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `¡Hola ${restaurant.name}! Me gustaría hacer una reserva.`
  )

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    })
  }

  // Minimal variant - Just logo and name
  if (variant === 'minimal') {
    return (
      <header className={`px-6 py-8 ${className}`}>
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4"
        >
          {restaurant.logoUrl && (
            <motion.img
              custom={0}
              variants={fadeUpVariants}
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <motion.h1
              custom={1}
              variants={fadeUpVariants}
              className="text-2xl font-bold text-slate-900"
            >
              {restaurant.name}
            </motion.h1>
            {restaurant.description && (
              <motion.p
                custom={2}
                variants={fadeUpVariants}
                className="text-slate-500 text-sm"
              >
                {restaurant.description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </header>
    )
  }

  // Overlay variant - With background image
  if (variant === 'overlay' && backgroundImage) {
    return (
      <header
        className={`relative min-h-[50vh] flex items-end ${className}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <motion.div
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full p-6 pb-8 text-white"
        >
          <motion.h1
            custom={0}
            variants={fadeUpVariants}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            {restaurant.name}
          </motion.h1>

          {restaurant.description && (
            <motion.p
              custom={1}
              variants={fadeUpVariants}
              className="text-white/80 mb-6 max-w-md"
            >
              {restaurant.description}
            </motion.p>
          )}

          {showQuickActions && (
            <motion.div
              custom={2}
              variants={fadeUpVariants}
              className="flex gap-3"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon size={20} />
                Reservar
              </a>
              <a
                href={`tel:${restaurant.phone}`}
                className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <PhoneIcon size={20} />
                Llamar
              </a>
            </motion.div>
          )}
        </motion.div>
      </header>
    )
  }

  // Centered variant (default)
  return (
    <header className={`hero-modern py-12 px-6 ${className}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        className="hero-content"
      >
        {/* Logo */}
        {restaurant.logoUrl && (
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            className="mb-6"
          >
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-lg"
            />
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          className="hero-title"
        >
          {restaurant.name}
        </motion.h1>

        {/* Description */}
        {restaurant.description && (
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            className="hero-subtitle"
          >
            {restaurant.description}
          </motion.p>
        )}

        {/* Info Pills */}
        {showInfo && (
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
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
          </motion.div>
        )}

        {/* CTAs */}
        {showQuickActions && (
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon size={20} />
              Hacer Reserva
            </a>
            <a
              href={`tel:${restaurant.phone}`}
              className="btn-secondary"
            >
              <PhoneIcon size={20} />
              Llamar
            </a>
          </motion.div>
        )}
      </motion.div>
    </header>
  )
}
