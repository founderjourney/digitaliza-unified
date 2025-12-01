import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { verifyPassword, createSession, getSessionCookieOptions } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

// D2-04: POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Validar con loginSchema
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { slug, password } = validationResult.data

    // 2. Buscar restaurante por slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        password: true,
        isActive: true,
      },
    })

    if (!restaurant || !restaurant.isActive) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // 3. Verificar password con verifyPassword()
    const isValidPassword = await verifyPassword(password, restaurant.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // 4. Crear sesión con createSession()
    const { token, expiresAt } = await createSession(restaurant.id)

    // 5. Set cookie httpOnly
    const cookieStore = await cookies()
    const cookieOptions = getSessionCookieOptions(expiresAt)
    cookieStore.set(cookieOptions.name, token, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      expires: cookieOptions.expires,
      path: cookieOptions.path,
    })

    return NextResponse.json({
      success: true,
      restaurant: {
        slug: restaurant.slug,
        name: restaurant.name,
      },
    })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
