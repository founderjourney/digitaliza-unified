'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  count?: number
}

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  accentColor?: string
  variant?: 'pills' | 'underline' | 'minimal'
  showAll?: boolean
  allLabel?: string
  sticky?: boolean
  className?: string
}

export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  accentColor = '#0f172a',
  variant = 'pills',
  showAll = true,
  allLabel = 'Todo',
  sticky = true,
  className = ''
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)

  // Handle scroll gradients
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftGradient(scrollLeft > 10)
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    handleScroll()
  }, [categories])

  // Scroll active category into view
  useEffect(() => {
    if (scrollRef.current && activeCategory) {
      const activeElement = scrollRef.current.querySelector(`[data-category="${activeCategory}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeCategory])

  const allCategories: Category[] = showAll
    ? [{ id: '', name: allLabel }, ...categories]
    : categories

  const isActive = (categoryId: string) => {
    if (categoryId === '') return activeCategory === null
    return activeCategory === categoryId
  }

  const renderPillVariant = () => (
    <div className="relative">
      {/* Left gradient */}
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Right gradient */}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="category-nav-scroll"
      >
        {allCategories.map((category) => (
          <motion.button
            key={category.id}
            data-category={category.id}
            onClick={() => onCategoryChange(category.id || null)}
            className={`category-pill ${
              isActive(category.id) ? 'category-pill-active' : 'category-pill-inactive'
            }`}
            style={isActive(category.id) ? { backgroundColor: accentColor } : undefined}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-1.5 opacity-60">({category.count})</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )

  const renderUnderlineVariant = () => (
    <div className="relative">
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4"
      >
        {allCategories.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            onClick={() => onCategoryChange(category.id || null)}
            className={`relative py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive(category.id)
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-1 opacity-60">({category.count})</span>
            )}

            {isActive(category.id) && (
              <motion.div
                layoutId="category-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: accentColor }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )

  const renderMinimalVariant = () => (
    <div className="flex flex-wrap gap-2 px-4">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id || null)}
          className={`text-sm font-medium transition-colors ${
            isActive(category.id)
              ? 'text-slate-900'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {category.name}
          {category.count !== undefined && ` (${category.count})`}
        </button>
      ))}
    </div>
  )

  const content = () => {
    switch (variant) {
      case 'underline':
        return renderUnderlineVariant()
      case 'minimal':
        return renderMinimalVariant()
      default:
        return renderPillVariant()
    }
  }

  return (
    <nav
      className={`
        ${sticky ? 'sticky top-0 z-40' : ''}
        bg-white/95 backdrop-blur-lg border-b border-slate-100 py-3
        ${className}
      `}
    >
      {content()}
    </nav>
  )
}
