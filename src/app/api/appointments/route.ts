// src/app/api/appointments/route.ts
// API para gestión de citas (Servicios: Barbería, Spa, Salón)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/appointments - Listar citas de un negocio
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const menuItemId = searchParams.get('menuItemId')

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'restaurantId es requerido' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: Record<string, unknown> = { restaurantId }

    if (status) {
      where.status = status
    }

    if (date) {
      // Filtrar por fecha específica
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      where.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    if (menuItemId) {
      where.menuItemId = menuItemId
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Error al obtener citas' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Crear una nueva cita
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      restaurantId,
      menuItemId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      startTime,
      notes
    } = body

    // Validaciones básicas
    if (!restaurantId || !menuItemId || !customerName || !customerPhone || !date || !startTime) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Obtener el servicio para saber la duración
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    })

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    const duration = menuItem.duration || 30 // Default 30 min si no tiene duración

    // Calcular hora de fin
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + duration * 60000)
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

    // Verificar disponibilidad (no hay citas que se superpongan)
    const appointmentDate = new Date(date)
    appointmentDate.setHours(0, 0, 0, 0)
    const endOfDay = new Date(appointmentDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        restaurantId,
        date: {
          gte: appointmentDate,
          lte: endOfDay
        },
        status: {
          notIn: ['cancelled', 'no_show']
        }
      }
    })

    // Verificar superposición
    const hasConflict = existingAppointments.some(apt => {
      const aptStart = apt.startTime
      const aptEnd = apt.endTime

      // Hay conflicto si:
      // - La nueva cita empieza durante una existente
      // - La nueva cita termina durante una existente
      // - La nueva cita contiene completamente una existente
      return (
        (startTime >= aptStart && startTime < aptEnd) ||
        (endTime > aptStart && endTime <= aptEnd) ||
        (startTime <= aptStart && endTime >= aptEnd)
      )
    })

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Ya existe una cita en ese horario' },
        { status: 409 }
      )
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        restaurantId,
        menuItemId,
        customerName,
        customerPhone,
        customerEmail,
        date: appointmentDate,
        startTime,
        endTime,
        duration,
        notes,
        status: 'pending'
      },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true
          }
        },
        restaurant: {
          select: {
            name: true,
            whatsapp: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Error al crear cita' },
      { status: 500 }
    )
  }
}
