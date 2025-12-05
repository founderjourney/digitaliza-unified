import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { menuItemSchema } from '@/lib/validations'

// D2-06: PUT /api/restaurants/[slug]/menu/[id] - Actualizar item (PROTEGIDO)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

    // 1. Verificar sesión
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 2. Verificar que el item pertenece al restaurante correcto
    const items = await sql`
      SELECT m.id, m.category, r.id as "restaurantId", r.slug
      FROM "MenuItem" m
      JOIN "Restaurant" r ON m."restaurantId" = r.id
      WHERE m.id = ${id}
    `

    if (items.length === 0 || items[0].slug !== slug) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    const item = items[0]

    // Verificar que la sesión pertenece a este restaurante
    if (session.restaurantId !== item.restaurantId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este item' },
        { status: 403 }
      )
    }

    // 3. Validar con menuItemSchema
    const body = await request.json()
    const validationResult = menuItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, description, price, imageUrl, category, available } = validationResult.data
    const now = new Date().toISOString()

    // 4. Actualizar item
    await sql`
      UPDATE "MenuItem"
      SET name = ${name},
          description = ${description || null},
          price = ${price},
          "imageUrl" = ${imageUrl || null},
          category = ${category || item.category},
          available = ${available},
          "updatedAt" = ${now}
      WHERE id = ${id}
    `

    // 5. Retornar item actualizado
    return NextResponse.json({
      id,
      name,
      description: description || null,
      price: Number(price),
      imageUrl: imageUrl || null,
      category: category || item.category,
      available,
    })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// D2-06: DELETE /api/restaurants/[slug]/menu/[id] - Eliminar item (PROTEGIDO)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

    // 1. Verificar sesión
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 2. Verificar que el item pertenece al restaurante correcto
    const items = await sql`
      SELECT m.id, r.id as "restaurantId", r.slug
      FROM "MenuItem" m
      JOIN "Restaurant" r ON m."restaurantId" = r.id
      WHERE m.id = ${id}
    `

    if (items.length === 0 || items[0].slug !== slug) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la sesión pertenece a este restaurante
    if (session.restaurantId !== items[0].restaurantId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este item' },
        { status: 403 }
      )
    }

    // 3. Eliminar item
    await sql`
      DELETE FROM "MenuItem"
      WHERE id = ${id}
    `

    // 4. Retornar { success: true }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
