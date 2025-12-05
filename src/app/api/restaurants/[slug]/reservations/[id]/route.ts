import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { z } from 'zod'

const reservationUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(8).max(20).optional(),
  email: z.string().email().optional().nullable(),
  date: z.string().or(z.date()).optional(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  guests: z.number().int().min(1).max(50).optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  notes: z.string().max(500).optional().nullable(),
})

// GET /api/restaurants/[slug]/reservations/[id] - Obtener reserva (PROTEGIDO)
export async function GET(
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

    const reservations = await sql`
      SELECT * FROM "Reservation"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    if (reservations.length === 0) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservations[0])
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/restaurants/[slug]/reservations/[id] - Actualizar reserva (PROTEGIDO)
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
    const validationResult = reservationUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const updates = validationResult.data
    const now = new Date().toISOString()

    // Convert date if provided
    let dateValue = null
    if (updates.date) {
      dateValue = new Date(updates.date).toISOString()
    }

    await sql`
      UPDATE "Reservation"
      SET
        name = COALESCE(${updates.name ?? null}, name),
        phone = COALESCE(${updates.phone ?? null}, phone),
        email = COALESCE(${updates.email ?? null}, email),
        date = COALESCE(${dateValue}, date),
        time = COALESCE(${updates.time ?? null}, time),
        guests = COALESCE(${updates.guests ?? null}, guests),
        status = COALESCE(${updates.status ?? null}, status),
        notes = COALESCE(${updates.notes ?? null}, notes),
        "updatedAt" = ${now}
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    const reservations = await sql`
      SELECT * FROM "Reservation"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    if (reservations.length === 0) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservations[0])
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Error al actualizar reserva' },
      { status: 500 }
    )
  }
}

// DELETE /api/restaurants/[slug]/reservations/[id] - Eliminar reserva (PROTEGIDO)
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
      DELETE FROM "Reservation"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    return NextResponse.json(
      { error: 'Error al eliminar reserva' },
      { status: 500 }
    )
  }
}

// PATCH /api/restaurants/[slug]/reservations/[id] - Cambiar estado (PROTEGIDO)
export async function PATCH(
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
    const { status } = body

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    await sql`
      UPDATE "Reservation"
      SET status = ${status}, "updatedAt" = ${now}
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    const reservations = await sql`
      SELECT * FROM "Reservation"
      WHERE id = ${id} AND "restaurantId" = ${restaurant.id}
    `

    if (reservations.length === 0) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservations[0])
  } catch (error) {
    console.error('Error updating reservation status:', error)
    return NextResponse.json(
      { error: 'Error al actualizar estado' },
      { status: 500 }
    )
  }
}
