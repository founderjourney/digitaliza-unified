import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { updateRestaurantSchema } from '@/lib/validations'

// D2-02: GET /api/restaurants/[slug] - Obtener restaurante (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Buscar restaurante
    const restaurants = await sql`
      SELECT id, slug, name, phone, whatsapp, address, description, theme, "businessMode", "logoUrl", hours
      FROM "Restaurant"
      WHERE slug = ${slug} AND "isActive" = true
    `

    if (restaurants.length === 0) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 404 }
      )
    }

    const restaurant = restaurants[0]

    // Buscar items del menú
    const menuItems = await sql`
      SELECT id, name, description, price, "imageUrl", category, available, "order"
      FROM "MenuItem"
      WHERE "restaurantId" = ${restaurant.id} AND available = true
      ORDER BY "order" ASC
    `

    // Transformar items
    const items = menuItems.map((item) => ({
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
      businessMode: restaurant.businessMode || 'restaurant',
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
    const restaurants = await sql`
      SELECT id FROM "Restaurant" WHERE slug = ${slug}
    `

    if (restaurants.length === 0) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 404 }
      )
    }

    const restaurant = restaurants[0]

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

    const { name, phone, whatsapp, email, address, description, hours } = validationResult.data
    const now = new Date().toISOString()

    // Actualizar restaurante
    await sql`
      UPDATE "Restaurant"
      SET
        name = COALESCE(${name}, name),
        phone = COALESCE(${phone}, phone),
        whatsapp = COALESCE(${whatsapp}, whatsapp),
        email = COALESCE(${email}, email),
        address = COALESCE(${address}, address),
        description = COALESCE(${description}, description),
        hours = COALESCE(${hours ? JSON.stringify(hours) : null}, hours),
        "updatedAt" = ${now}
      WHERE id = ${restaurant.id}
    `

    // Obtener datos actualizados
    const updated = await sql`
      SELECT id, slug, name, phone, whatsapp, address, description, theme, "logoUrl", hours
      FROM "Restaurant"
      WHERE id = ${restaurant.id}
    `

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
