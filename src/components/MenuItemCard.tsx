'use client'

import { cn } from '@/lib/utils'

interface MenuItemCardProps {
  item: {
    name: string
    description?: string
    price: number | string
    imageUrl?: string
  }
  accentColor: string
}

export function MenuItemCard({ item, accentColor }: MenuItemCardProps) {
  const formatPrice = (price: number | string): string => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`
    }
    if (price.includes('$') || price.includes('€')) {
      return price
    }
    return `$${price}`
  }

  return (
    <div className="flex gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Image placeholder or actual image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              `
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>
        )}
        <p
          className={cn('mt-2 font-bold text-base')}
          style={{ color: accentColor }}
        >
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  )
}
