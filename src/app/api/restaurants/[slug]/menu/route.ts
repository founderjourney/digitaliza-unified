import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { menuItemSchema } from '@/lib/validations'

// D2-06: GET /api/restaurants/[slug]/menu - Listar items (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Buscar restaurante y sus items
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true,
            available: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 404 }
      )
    }

    // Transformar items
    const items = restaurant.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      category: item.category || 'General',
      available: item.available,
    }))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// D2-06: POST /api/restaurants/[slug]/menu - Crear item (PROTEGIDO)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 1. Verificar sesión
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar restaurante
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la sesión pertenece a este restaurante
    if (session.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este menú' },
        { status: 403 }
      )
    }

    // 2. Validar con menuItemSchema
    const body = await request.json()
    const validationResult = menuItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, description, price, imageUrl, category, available } = validationResult.data

    // Obtener el orden máximo actual
    const maxOrder = await prisma.menuItem.aggregate({
      where: { restaurantId: restaurant.id },
      _max: { order: true },
    })

    // 3. Crear item en BD
    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        category: category || 'General',
        available,
        order: (maxOrder._max.order || 0) + 1,
        restaurantId: restaurant.id,
      },
    })

    // 4. Retornar item creado
    return NextResponse.json(
      {
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        imageUrl: item.imageUrl,
        category: item.category,
        available: item.available,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
