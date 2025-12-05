import { NextRequest, NextResponse } from 'next/server'
import { sql, generateId } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for reservations
const reservationSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(100),
  phone: z.string().min(8, 'Teléfono inválido').max(20),
  email: z.string().email().optional().nullable(),
  date: z.string().or(z.date()),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida'),
  guests: z.number().int().min(1).max(50),
  notes: z.string().max(500).optional().nullable(),
})

// GET /api/restaurants/[slug]/reservations - Listar reservas (PROTEGIDO para admin, filtrado para público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

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

    // Verificar si es admin
    const session = await getSessionFromCookies()
    const isAdmin = session?.restaurantId === restaurant.id

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Construir query con filtros
    let reservations
    if (status && date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      reservations = await sql`
        SELECT * FROM "Reservation"
        WHERE "restaurantId" = ${restaurant.id}
          AND status = ${status}
          AND date >= ${startDate.toISOString()}
          AND date < ${endDate.toISOString()}
        ORDER BY date ASC, time ASC
      `
    } else if (status) {
      reservations = await sql`
        SELECT * FROM "Reservation"
        WHERE "restaurantId" = ${restaurant.id}
          AND status = ${status}
        ORDER BY date ASC, time ASC
      `
    } else if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      reservations = await sql`
        SELECT * FROM "Reservation"
        WHERE "restaurantId" = ${restaurant.id}
          AND date >= ${startDate.toISOString()}
          AND date < ${endDate.toISOString()}
        ORDER BY date ASC, time ASC
      `
    } else {
      reservations = await sql`
        SELECT * FROM "Reservation"
        WHERE "restaurantId" = ${restaurant.id}
        ORDER BY date ASC, time ASC
      `
    }

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants/[slug]/reservations - Crear reserva (PÚBLICO)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const restaurants = await sql`
      SELECT id, name, whatsapp, phone FROM "Restaurant"
      WHERE slug = ${slug} AND "isActive" = true
    `

    if (restaurants.length === 0) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 404 }
      )
    }

    const restaurant = restaurants[0]

    // Validar datos
    const body = await request.json()
    const validationResult = reservationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, phone, email, date, time, guests, notes } = validationResult.data

    // Crear reserva
    const id = generateId()
    const now = new Date().toISOString()
    const reservationDate = new Date(date).toISOString()

    await sql`
      INSERT INTO "Reservation" (id, name, phone, email, date, time, guests, notes, status, "restaurantId", "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${phone}, ${email || null}, ${reservationDate}, ${time}, ${guests}, ${notes || null}, 'pending', ${restaurant.id}, ${now}, ${now})
    `

    const reservation = {
      id,
      name,
      phone,
      email: email || null,
      date: reservationDate,
      time,
      guests,
      notes: notes || null,
      status: 'pending',
      restaurantId: restaurant.id,
      createdAt: now,
      updatedAt: now,
    }

    // Generar URL de WhatsApp para notificar
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const whatsappMessage = encodeURIComponent(
      `Nueva reserva en ${restaurant.name}:\n\n` +
      `Nombre: ${name}\n` +
      `Teléfono: ${phone}\n` +
      `Fecha: ${formattedDate}\n` +
      `Hora: ${time}\n` +
      `Personas: ${guests}\n` +
      (notes ? `Notas: ${notes}\n` : '')
    )

    const whatsappNumber = (restaurant.whatsapp || restaurant.phone).replace(/[^0-9]/g, '')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    return NextResponse.json(
      {
        reservation,
        whatsappUrl,
        message: 'Reserva creada exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
