// D1-08: Middleware de autenticación
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/api/restaurants', // POST para registro (sin slug)
  '/api/auth/login',
  '/api/auth/logout',
]

// Métodos que requieren autenticación en rutas de restaurante
const PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']

export function middleware(request: NextRequest) {
  const { pathname, method } = { pathname: request.nextUrl.pathname, method: request.method }

  // Rutas públicas explícitas
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next()
  }

  // GET en /api/restaurants/[slug] y /api/restaurants/[slug]/menu son públicos
  if (method === 'GET' && pathname.match(/^\/api\/restaurants\/[^/]+(?:\/menu)?$/)) {
    return NextResponse.next()
  }

  // Rutas protegidas: POST, PUT, DELETE en /api/restaurants/[slug]/*
  if (PROTECTED_METHODS.includes(method) && pathname.startsWith('/api/restaurants/')) {
    const sessionCookie = request.cookies.get('session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // La verificación completa (sesión válida + pertenece al restaurante)
    // se hace en cada route handler porque necesitamos acceso a Prisma
    // El middleware solo verifica que existe la cookie
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
