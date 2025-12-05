import { NextRequest, NextResponse } from 'next/server'
import { sql, generateId } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for links
const linkSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100),
  url: z.string().url('URL inválida'),
  icon: z.string().default('link'),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
})

// GET /api/restaurants/[slug]/links - Listar links (PÚBLICO)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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

    const links = await sql`
      SELECT id, title, url, icon, "order", clicks
      FROM "Link"
      WHERE "restaurantId" = ${restaurant.id} AND "isActive" = true
      ORDER BY "order" ASC
    `

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants/[slug]/links - Crear link (PROTEGIDO)
export async function POST(
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

    if (session.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar estos enlaces' },
        { status: 403 }
      )
    }

    // Validar datos
    const body = await request.json()
    const validationResult = linkSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { title, url, icon, isActive } = validationResult.data

    // Obtener orden máximo
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX("order"), 0) as max_order
      FROM "Link"
      WHERE "restaurantId" = ${restaurant.id}
    `
    const maxOrder = maxOrderResult[0]?.max_order || 0

    // Crear link
    const id = generateId()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO "Link" (id, title, url, icon, "isActive", "order", clicks, "restaurantId", "createdAt", "updatedAt")
      VALUES (${id}, ${title}, ${url}, ${icon || 'link'}, ${isActive}, ${maxOrder + 1}, 0, ${restaurant.id}, ${now}, ${now})
    `

    const link = {
      id,
      title,
      url,
      icon: icon || 'link',
      isActive,
      order: maxOrder + 1,
      clicks: 0,
      restaurantId: restaurant.id,
      createdAt: now,
      updatedAt: now,
    }

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/restaurants/[slug]/links - Reordenar links (PROTEGIDO)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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
    const { orderedIds } = body as { orderedIds: string[] }

    // Actualizar orden de todos los links
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`
        UPDATE "Link"
        SET "order" = ${i}
        WHERE id = ${orderedIds[i]} AND "restaurantId" = ${restaurant.id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering links:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
