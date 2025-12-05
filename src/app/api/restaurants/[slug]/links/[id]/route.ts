import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { z } from 'zod'

const linkUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/restaurants/[slug]/links/[id] - Obtener link y registrar click (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

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

    // Incrementar clicks y obtener link
    const now = new Date().toISOString()
    await sql`
      UPDATE "Link"
      SET clicks = clicks + 1, "updatedAt" = ${now}
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    const links = await sql`
      SELECT id, title, url, icon, "order", clicks, "isActive", "restaurantId", "createdAt", "updatedAt"
      FROM "Link"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    if (links.length === 0) {
      return NextResponse.json(
        { error: 'Link no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(links[0])
  } catch (error) {
    console.error('Error fetching link:', error)
    return NextResponse.json(
      { error: 'Link no encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/restaurants/[slug]/links/[id] - Actualizar link (PROTEGIDO)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const restaurants = await sql`
      SELECT id FROM "Restaurant"
      WHERE slug = ${slug}
    `

    if (restaurants.length === 0 || session.restaurantId !== restaurants[0].id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const restaurant = restaurants[0]

    const body = await request.json()
    const validationResult = linkUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const updates = validationResult.data
    const now = new Date().toISOString()

    // Build dynamic update
    await sql`
      UPDATE "Link"
      SET
        title = COALESCE(${updates.title ?? null}, title),
        url = COALESCE(${updates.url ?? null}, url),
        icon = COALESCE(${updates.icon ?? null}, icon),
        "order" = COALESCE(${updates.order ?? null}, "order"),
        "isActive" = COALESCE(${updates.isActive ?? null}, "isActive"),
        "updatedAt" = ${now}
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    const links = await sql`
      SELECT id, title, url, icon, "order", clicks, "isActive", "restaurantId", "createdAt", "updatedAt"
      FROM "Link"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    if (links.length === 0) {
      return NextResponse.json(
        { error: 'Link no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(links[0])
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json(
      { error: 'Error al actualizar link' },
      { status: 500 }
    )
  }
}

// DELETE /api/restaurants/[slug]/links/[id] - Eliminar link (PROTEGIDO)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const restaurants = await sql`
      SELECT id FROM "Restaurant"
      WHERE slug = ${slug}
    `

    if (restaurants.length === 0 || session.restaurantId !== restaurants[0].id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const restaurant = restaurants[0]

    await sql`
      DELETE FROM "Link"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { error: 'Error al eliminar link' },
      { status: 500 }
    )
  }
}
