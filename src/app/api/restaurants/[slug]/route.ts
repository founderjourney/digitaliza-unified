import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { updateRestaurantSchema } from '@/lib/validations'

// D2-02: GET /api/restaurants/[slug] - Obtener restaurante (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        phone: true,
        whatsapp: true,
        address: true,
        description: true,
        theme: true,
        logoUrl: true,
        hours: true,
        items: {
          where: { available: true },
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
      order: item.order,
    }))

    return NextResponse.json({
      id: restaurant.id,
      slug: restaurant.slug,
      name: restaurant.name,
      phone: restaurant.phone,
      whatsapp: restaurant.whatsapp,
      address: restaurant.address,
      description: restaurant.description,
      theme: restaurant.theme,
      logoUrl: restaurant.logoUrl,
      hours: restaurant.hours || {},
      items,
    })
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// D2-03: PUT /api/restaurants/[slug] - Actualizar restaurante (PROTEGIDO)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Verificar sesión
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
        { error: 'No tienes permiso para modificar este restaurante' },
        { status: 403 }
      )
    }

    // Validar datos
    const body = await request.json()
    const validationResult = updateRestaurantSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Actualizar restaurante
    const { hours, ...restData } = validationResult.data
    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        ...restData,
        ...(hours && { hours: hours as Record<string, string> }),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        phone: true,
        whatsapp: true,
        address: true,
        description: true,
        theme: true,
        logoUrl: true,
        hours: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
