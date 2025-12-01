'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseAdminAuthProps {
  restaurantName: string
  sessionTimeout?: number // in minutes
}

export function useAdminAuth({ restaurantName, sessionTimeout = 60 }: UseAdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const authKey = `digitaliza_admin_${restaurantName}`
  const timestampKey = `digitaliza_admin_timestamp`
  const checkAuthStatus = useCallback(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const isAuth = localStorage.getItem(authKey)
      const timestamp = localStorage.getItem(timestampKey)

      if (!isAuth || !timestamp) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Check if session has expired
      const sessionAge = Date.now() - parseInt(timestamp)
      const sessionLimit = sessionTimeout * 60 * 1000 // Convert to milliseconds

      if (sessionAge > sessionLimit) {
        // Session expired, clear auth
        localStorage.removeItem(authKey)
        localStorage.removeItem(timestampKey)
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.warn('Error checking auth status:', error)
      setIsAuthenticated(false)
    }

    setIsLoading(false)
  }, [authKey, timestampKey, sessionTimeout])

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = () => {
    if (typeof window === 'undefined') return

    localStorage.setItem(authKey, 'true')
    localStorage.setItem(timestampKey, Date.now().toString())
    setIsAuthenticated(true)
  }

  const logout = () => {
    if (typeof window === 'undefined') return

    localStorage.removeItem(authKey)
    localStorage.removeItem(timestampKey)
    setIsAuthenticated(false)
  }

  const extendSession = useCallback(() => {
    if (typeof window === 'undefined') return

    if (isAuthenticated) {
      localStorage.setItem(timestampKey, Date.now().toString())
    }
  }, [isAuthenticated, timestampKey])

  // Auto-extend session on user activity
  useEffect(() => {
    if (!isAuthenticated) return

    const handleUserActivity = () => {
      extendSession()
    }

    const events = ['mousedown', 'touchstart', 'keydown', 'scroll']
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity)
      })
    }
  }, [isAuthenticated, extendSession])

  // Check session validity periodically
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, checkAuthStatus])

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession,
    checkAuthStatus
  }
}
