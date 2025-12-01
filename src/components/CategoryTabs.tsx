'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  categories: string[]
  selected: string | null // null = "Todos"
  onSelect: (category: string | null) => void
  accentColor: string
}

export function CategoryTabs({
  categories,
  selected,
  onSelect,
  accentColor,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current
      const tab = activeTabRef.current
      const containerRect = container.getBoundingClientRect()
      const tabRect = tab.getBoundingClientRect()

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selected])

  const allCategories = ['Todos', ...categories]

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 -mx-1"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {allCategories.map((category) => {
        const isActive = category === 'Todos' ? selected === null : selected === category

        return (
          <button
            key={category}
            ref={isActive ? activeTabRef : null}
            onClick={() => onSelect(category === 'Todos' ? null : category)}
            className={cn(
              // Base styles - touch target 44px minimum
              'flex-shrink-0 px-4 py-2 min-h-[44px]',
              'rounded-full text-sm font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              // Active vs inactive states
              isActive
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            style={
              isActive
                ? { backgroundColor: accentColor, boxShadow: `0 2px 8px ${accentColor}40` }
                : {}
            }
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
