'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// Tipos
export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
  imageUrl?: string
  category?: string
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
  restaurantSlug: string | null
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> & { restaurantId: string; restaurantSlug: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_NOTES'; payload: { id: string; notes: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'id'>, restaurantId: string, restaurantSlug: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateNotes: (id: string, notes: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getItemById: (menuItemId: string) => CartItem | undefined
}

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantSlug: null,
  isOpen: false,
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { restaurantId, restaurantSlug, ...itemData } = action.payload

      // Si el carrito tiene items de otro restaurante, preguntar si limpiar
      if (state.restaurantId && state.restaurantId !== restaurantId && state.items.length > 0) {
        // En este caso, limpiamos el carrito y agregamos el nuevo item
        const newItem: CartItem = {
          ...itemData,
          id: `${itemData.menuItemId}-${Date.now()}`,
        }
        return {
          ...state,
          items: [newItem],
          restaurantId,
          restaurantSlug,
        }
      }

      // Verificar si el item ya existe
      const existingItemIndex = state.items.findIndex(
        item => item.menuItemId === itemData.menuItemId
      )

      if (existingItemIndex >= 0) {
        // Actualizar cantidad
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + itemData.quantity,
        }
        return {
          ...state,
          items: updatedItems,
          restaurantId,
          restaurantSlug,
        }
      }

      // Agregar nuevo item
      const newItem: CartItem = {
        ...itemData,
        id: `${itemData.menuItemId}-${Date.now()}`,
      }
      return {
        ...state,
        items: [...state.items, newItem],
        restaurantId,
        restaurantSlug,
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case 'UPDATE_NOTES':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, notes: action.payload.notes }
            : item
        ),
      }

    case 'CLEAR_CART':
      return {
        ...initialState,
        isOpen: state.isOpen,
      }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'LOAD_CART':
      return { ...action.payload, isOpen: false }

    default:
      return state
  }
}

// Storage key
const CART_STORAGE_KEY = 'digitaliza_cart'

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsed })
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantSlug: state.restaurantSlug,
      }))
    } catch (error) {
      console.error('Error saving cart to storage:', error)
    }
  }, [state.items, state.restaurantId, state.restaurantSlug])

  const addItem = useCallback((
    item: Omit<CartItem, 'id'>,
    restaurantId: string,
    restaurantSlug: string
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, restaurantId, restaurantSlug },
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const updateNotes = useCallback((id: string, notes: string) => {
    dispatch({ type: 'UPDATE_NOTES', payload: { id, notes } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' })
  }, [])

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' })
  }, [])

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' })
  }, [])

  const getTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [state.items])

  const getItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }, [state.items])

  const getItemById = useCallback((menuItemId: string) => {
    return state.items.find(item => item.menuItemId === menuItemId)
  }, [state.items])

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotal,
    getItemCount,
    getItemById,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
