// D1-05: Sistema de autenticación
// Creado por DEV2 para desbloquear APIs

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { prisma } from './db'

const SALT_ROUNDS = 12
const SESSION_DURATION_HOURS = 24
const COOKIE_NAME = 'session'

// Hash password con bcrypt (12 rounds)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Verificar password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Crear sesión en BD + retornar token
export async function createSession(restaurantId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      token,
      expiresAt,
      restaurantId,
    },
  })

  return { token, expiresAt }
}

// Verificar sesión desde request (leer cookie)
export async function verifySession(request: NextRequest): Promise<{ restaurantId: string } | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { token },
    select: { restaurantId: true, expiresAt: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return { restaurantId: session.restaurantId }
}

// Verificar sesión desde cookies de servidor (para Route Handlers)
export async function getSessionFromCookies(): Promise<{ restaurantId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { token },
    select: { restaurantId: true, expiresAt: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return { restaurantId: session.restaurantId }
}

// Eliminar sesión
export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  }).catch(() => {
    // Si la sesión no existe, ignorar el error
  })
}

// Limpiar sesiones expiradas (opcional, para cron)
export async function cleanExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

// Configuración de cookie para respuestas
export function getSessionCookieOptions(expiresAt: Date) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    expires: expiresAt,
    path: '/',
  }
}

// Cookie para eliminar sesión
export function getClearSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  }
}

export const COOKIE_SESSION_NAME = COOKIE_NAME
