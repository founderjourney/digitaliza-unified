// D1-05: Sistema de autenticación
// Actualizado para usar SQL directo con Neon HTTP driver

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { sql, generateId } from './db'

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
  const id = generateId()
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)
  const now = new Date().toISOString()

  await sql`
    INSERT INTO "Session" (id, token, "expiresAt", "restaurantId", "createdAt")
    VALUES (${id}, ${token}, ${expiresAt.toISOString()}, ${restaurantId}, ${now})
  `

  return { token, expiresAt }
}

// Verificar sesión desde request (leer cookie)
export async function verifySession(request: NextRequest): Promise<{ restaurantId: string } | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const sessions = await sql`
    SELECT "restaurantId", "expiresAt"
    FROM "Session"
    WHERE token = ${token}
  `

  if (sessions.length === 0) {
    return null
  }

  const session = sessions[0]
  const expiresAt = new Date(session.expiresAt)

  if (expiresAt < new Date()) {
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

  const sessions = await sql`
    SELECT "restaurantId", "expiresAt"
    FROM "Session"
    WHERE token = ${token}
  `

  if (sessions.length === 0) {
    return null
  }

  const session = sessions[0]
  const expiresAt = new Date(session.expiresAt)

  if (expiresAt < new Date()) {
    return null
  }

  return { restaurantId: session.restaurantId }
}

// Eliminar sesión
export async function deleteSession(token: string): Promise<void> {
  try {
    await sql`
      DELETE FROM "Session"
      WHERE token = ${token}
    `
  } catch {
    // Si la sesión no existe, ignorar el error
  }
}

// Limpiar sesiones expiradas (opcional, para cron)
export async function cleanExpiredSessions(): Promise<void> {
  const now = new Date().toISOString()
  await sql`
    DELETE FROM "Session"
    WHERE "expiresAt" < ${now}
  `
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
