// Cliente de base de datos usando Neon HTTP (sin Prisma adapter)
// Este enfoque es más confiable para cold starts

import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL!

// Cliente SQL directo - funciona siempre
export const sql = neon(connectionString)

// Tipos para las tablas
export interface Restaurant {
  id: string
  slug: string
  name: string
  phone: string
  whatsapp: string
  email: string | null
  address: string
  description: string | null
  logoUrl: string | null
  theme: string
  hours: string
  password: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string
  available: boolean
  order: number
  restaurantId: string
  createdAt: Date
  updatedAt: Date
}

// Helpers para generar IDs
export function generateId(): string {
  return crypto.randomUUID()
}
