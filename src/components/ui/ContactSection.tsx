'use client'

import { motion } from 'framer-motion'
import { Restaurant } from '@/types'
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from './icons'
import { formatHours, generateWhatsAppUrl } from '@/lib/utils'

interface ContactSectionProps {
  restaurant: Restaurant
  variant?: 'cards' | 'minimal' | 'banner'
  accentColor?: string
  className?: string
}

export default function ContactSection({
  restaurant,
  variant = 'cards',
  accentColor = '#0f172a',
  className = ''
}: ContactSectionProps) {
  const whatsappUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `¡Hola ${restaurant.name}! Tengo una consulta.`
  )

  const reservationUrl = generateWhatsAppUrl(
    restaurant.whatsapp || restaurant.phone,
    `¡Hola ${restaurant.name}! Me gustaría hacer una reserva.`
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <section className={`py-12 px-4 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="section-header">
            <h2 className="section-title">Contacto</h2>
            <p className="section-subtitle">Estamos aquí para atenderte</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {/* WhatsApp */}
            <motion.a
              variants={itemVariants}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group"
            >
              <div className="contact-icon bg-[#25D366]">
                <WhatsAppIcon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 group-hover:text-[#25D366] transition-colors">
                  WhatsApp
                </h3>
                <p className="text-slate-500 text-sm">Escríbenos directamente</p>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              variants={itemVariants}
              href={`tel:${restaurant.phone}`}
              className="contact-card group"
            >
              <div className="contact-icon" style={{ backgroundColor: accentColor }}>
                <PhoneIcon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 group-hover:opacity-70 transition-opacity">
                  Teléfono
                </h3>
                <p className="text-slate-500 text-sm">{restaurant.phone}</p>
              </div>
            </motion.a>

            {/* Address */}
            <motion.div variants={itemVariants} className="contact-card">
              <div className="contact-icon bg-slate-700">
                <MapPinIcon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">Ubicación</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{restaurant.address}</p>
              </div>
            </motion.div>

            {/* Hours */}
            {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
              <motion.div variants={itemVariants} className="contact-card">
                <div className="contact-icon bg-amber-500">
                  <ClockIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">Horarios</h3>
                  <p className="text-slate-500 text-sm">{formatHours(restaurant.hours)}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon size={20} />
              Hacer Reserva
            </a>
          </motion.div>
        </div>
      </section>
    )
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <section
        className={`py-12 px-4 text-white ${className}`}
        style={{ backgroundColor: accentColor }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para visitarnos?
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Haz tu reserva por WhatsApp o llámanos directamente
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href={reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modern bg-white text-slate-900 hover:bg-slate-100"
              >
                <WhatsAppIcon size={20} className="text-[#25D366]" />
                Reservar por WhatsApp
              </a>
              <a
                href={`tel:${restaurant.phone}`}
                className="btn-modern bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                <PhoneIcon size={20} />
                {restaurant.phone}
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <MapPinIcon size={16} />
                <span>{restaurant.address}</span>
              </div>
              {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
                <div className="flex items-center gap-2">
                  <ClockIcon size={16} />
                  <span>{formatHours(restaurant.hours)}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Minimal variant
  return (
    <section className={`py-8 px-4 border-t border-slate-100 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
          >
            <WhatsAppIcon size={18} />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${restaurant.phone}`}
            className="flex items-center gap-2 hover:text-slate-900 transition-colors"
          >
            <PhoneIcon size={18} />
            <span>{restaurant.phone}</span>
          </a>

          <span className="flex items-center gap-2">
            <MapPinIcon size={18} />
            <span className="line-clamp-1">{restaurant.address}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
