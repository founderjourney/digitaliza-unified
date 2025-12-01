// D1-06: Schemas de validación Zod
// Creado por DEV2 para desbloquear APIs

import { z } from 'zod'

// Registro de restaurante
export const registerSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100),
  phone: z.string().min(8, 'Teléfono inválido'),
  whatsapp: z.string().min(8, 'WhatsApp inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().min(5, 'Dirección muy corta'),
  theme: z.enum(['general', 'italian', 'japanese', 'mexican', 'coffee', 'barber']),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// Login
export const loginSchema = z.object({
  slug: z.string().min(1, 'Slug requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

// Crear/editar item del menú
export const menuItemSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('Precio debe ser mayor a 0'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Categoría requerida'),
  available: z.boolean().default(true),
})

// Actualizar restaurante
export const updateRestaurantSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(8).optional(),
  whatsapp: z.string().min(8).optional(),
  email: z.string().email().optional(),
  address: z.string().min(5).optional(),
  description: z.string().max(500).optional(),
  hours: z.record(z.string(), z.string()).optional(),
})

// Types inferidos
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type MenuItemInput = z.infer<typeof menuItemSchema>
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>
