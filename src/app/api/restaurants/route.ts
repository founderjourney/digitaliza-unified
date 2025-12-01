import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'

// D2-01: POST /api/restaurants - Crear restaurante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Validar con registerSchema
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, phone, whatsapp, email, address, theme, password } = validationResult.data

    // 2. Generar slug único
    let slug = generateSlug(name)
    let slugExists = await prisma.restaurant.findUnique({ where: { slug } })
    let counter = 2

    // 3. Verificar slug no existe, si existe agregar número
    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`
      slugExists = await prisma.restaurant.findUnique({ where: { slug } })
      counter++
    }

    // 4. Hash password con bcrypt
    const hashedPassword = await hashPassword(password)

    // 5. Crear en BD
    const restaurant = await prisma.restaurant.create({
      data: {
        slug,
        name,
        phone,
        whatsapp,
        email: email || null,
        address,
        theme: theme as 'general' | 'italian' | 'japanese' | 'mexican' | 'coffee' | 'barber',
        password: hashedPassword,
      },
      select: {
        slug: true,
        name: true,
      },
    })

    // 6. NO crear sesión automática (el usuario hará login después)

    return NextResponse.json(
      {
        slug: restaurant.slug,
        name: restaurant.name,
        message: 'Restaurante creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating restaurant:', error)

    // Manejar error de slug duplicado (por si acaso)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe un restaurante con este nombre' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
