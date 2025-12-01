'use client'

import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  // Touch target: min 44x44px
  const sizeStyles = {
    sm: 'min-h-[44px] min-w-[44px] px-3 text-sm',
    md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base',
    lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-lg',
  }

  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      focus:ring-blue-500
    `,
    secondary: `
      bg-gray-600 text-white
      hover:bg-gray-700
      focus:ring-gray-500
    `,
    outline: `
      border-2 border-gray-300 text-gray-700 bg-transparent
      hover:bg-gray-50
      focus:ring-gray-500
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100
      focus:ring-gray-500
    `,
  }

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
