import { NextRequest, NextResponse } from 'next/server'
import { sql, generateId } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { menuItemSchema } from '@/lib/validations'

// D2-06: GET /api/restaurants/[slug]/menu - Listar items (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Buscar restaurante
    const restaurants = await sql`
      SELECT id FROM "Restaurant"
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
      WHERE "restaurantId" = ${restaurant.id}
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
    const restaurants = await sql`
      SELECT id FROM "Restaurant"
      WHERE slug = ${slug}
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
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX("order"), 0) as max_order
      FROM "MenuItem"
      WHERE "restaurantId" = ${restaurant.id}
    `
    const maxOrder = maxOrderResult[0]?.max_order || 0

    // 3. Crear item en BD
    const id = generateId()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO "MenuItem" (id, name, description, price, "imageUrl", category, available, "order", "restaurantId", "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${description || null}, ${price}, ${imageUrl || null}, ${category || 'General'}, ${available}, ${maxOrder + 1}, ${restaurant.id}, ${now}, ${now})
    `

    // 4. Retornar item creado
    return NextResponse.json(
      {
        id,
        name,
        description: description || null,
        price: Number(price),
        imageUrl: imageUrl || null,
        category: category || 'General',
        available,
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
