'use client'

import { motion } from 'framer-motion'
import { MenuItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { StarIcon, FireIcon, LeafIcon, SparklesIcon, ImageIcon } from './icons'

interface ProductCardProps {
  item: MenuItem
  variant?: 'grid' | 'list' | 'compact'
  showImage?: boolean
  onSelect?: (item: MenuItem) => void
  accentColor?: string
}

// Badge configuration
const getBadges = (item: MenuItem) => {
  const badges: { icon: React.ReactNode; label: string; className: string }[] = []

  const name = item.name.toLowerCase()
  const desc = (item.description || '').toLowerCase()

  // Popular items (you could also add a 'popular' field to MenuItem)
  if (name.includes('especial') || name.includes('favorit') || name.includes('popular')) {
    badges.push({
      icon: <StarIcon size={12} />,
      label: 'Popular',
      className: 'badge-popular'
    })
  }

  // Spicy items
  if (name.includes('picant') || desc.includes('picant') || name.includes('spicy')) {
    badges.push({
      icon: <FireIcon size={12} />,
      label: 'Picante',
      className: 'badge-spicy'
    })
  }

  // Vegan/Vegetarian
  if (name.includes('vegan') || desc.includes('vegan') || name.includes('vegetarian')) {
    badges.push({
      icon: <LeafIcon size={12} />,
      label: 'Vegano',
      className: 'badge-vegan'
    })
  }

  // New items (based on creation date if available)
  if (item.createdAt) {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceCreation <= 14) {
      badges.push({
        icon: <SparklesIcon size={12} />,
        label: 'Nuevo',
        className: 'badge-new'
      })
    }
  }

  return badges
}

// Grid variant - Card with image
function GridCard({ item, showImage, onSelect, accentColor }: Omit<ProductCardProps, 'variant'>) {
  const badges = getBadges(item)
  const hasImage = showImage && item.imageUrl

  return (
    <motion.div
      className={`product-card group cursor-pointer ${!item.available ? 'opacity-60' : ''}`}
      onClick={() => item.available && onSelect?.(item)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="product-card-image">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon size={48} className="text-slate-300" />
          </div>
        )}

        {/* Badges overlay */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {badges.map((badge, i) => (
              <span key={i} className={`badge ${badge.className}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* Sold out overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="badge badge-sold-out text-sm">Agotado</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="product-card-content">
        <h3 className="product-card-title">{item.name}</h3>

        {item.description && (
          <p className="product-card-description">{item.description}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span
            className="product-card-price"
            style={accentColor ? { color: accentColor } : undefined}
          >
            {formatPrice(item.price)}
          </span>

          {item.available && (
            <motion.button
              className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(item)
              }}
            >
              +
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// List variant - Horizontal card with small image
function ListCard({ item, showImage, onSelect, accentColor }: Omit<ProductCardProps, 'variant'>) {
  const badges = getBadges(item)
  const hasImage = showImage && item.imageUrl

  return (
    <motion.div
      className={`menu-list-item group cursor-pointer ${!item.available ? 'opacity-60' : ''}`}
      onClick={() => item.available && onSelect?.(item)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Image */}
      {hasImage && (
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
          <span
            className="font-bold text-lg flex-shrink-0"
            style={accentColor ? { color: accentColor } : undefined}
          >
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="text-slate-500 text-sm line-clamp-2 mb-2">{item.description}</p>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, i) => (
              <span key={i} className={`badge ${badge.className}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        )}

        {!item.available && (
          <span className="badge badge-sold-out mt-1">Agotado</span>
        )}
      </div>
    </motion.div>
  )
}

// Compact variant - Minimal text only
function CompactCard({ item, onSelect, accentColor }: Omit<ProductCardProps, 'variant' | 'showImage'>) {
  return (
    <motion.div
      className={`flex items-start justify-between py-3 border-b border-slate-100 last:border-0 ${
        !item.available ? 'opacity-60' : 'cursor-pointer'
      }`}
      onClick={() => item.available && onSelect?.(item)}
      whileHover={item.available ? { x: 4 } : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1 pr-4">
        <h3 className="font-medium text-slate-900">
          {item.name}
          {!item.available && (
            <span className="ml-2 text-xs text-slate-400">(Agotado)</span>
          )}
        </h3>
        {item.description && (
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
        )}
      </div>
      <span
        className="font-semibold"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {formatPrice(item.price)}
      </span>
    </motion.div>
  )
}

export default function ProductCard({
  item,
  variant = 'grid',
  showImage = true,
  onSelect,
  accentColor
}: ProductCardProps) {
  switch (variant) {
    case 'list':
      return <ListCard item={item} showImage={showImage} onSelect={onSelect} accentColor={accentColor} />
    case 'compact':
      return <CompactCard item={item} onSelect={onSelect} accentColor={accentColor} />
    default:
      return <GridCard item={item} showImage={showImage} onSelect={onSelect} accentColor={accentColor} />
  }
}
