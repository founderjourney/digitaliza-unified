// src/app/api/appointments/[id]/route.ts
// API para operaciones individuales de citas

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/appointments/[id] - Obtener una cita específica
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: true,
            imageUrl: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsapp: true,
            address: true
          }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Error al obtener cita' },
      { status: 500 }
    )
  }
}

// PUT /api/appointments/[id] - Actualizar una cita
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerEmail,
      date,
      startTime,
      status,
      notes,
      adminNotes
    } = body

    // Verificar que la cita existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: { menuItem: true }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    // Construir datos de actualización
    const updateData: Record<string, unknown> = {}

    if (customerName !== undefined) updateData.customerName = customerName
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail
    if (notes !== undefined) updateData.notes = notes
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (status !== undefined) updateData.status = status

    // Si se actualiza fecha u hora, recalcular
    if (date !== undefined || startTime !== undefined) {
      const newDate = date ? new Date(date) : existingAppointment.date
      const newStartTime = startTime || existingAppointment.startTime
      const duration = existingAppointment.duration

      // Calcular nueva hora de fin
      const [hours, minutes] = newStartTime.split(':').map(Number)
      const startDate = new Date()
      startDate.setHours(hours, minutes, 0, 0)
      const endDate = new Date(startDate.getTime() + duration * 60000)
      const newEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

      updateData.date = newDate
      updateData.startTime = newStartTime
      updateData.endTime = newEndTime

      // Verificar disponibilidad si cambió fecha u hora
      const appointmentDate = new Date(newDate)
      appointmentDate.setHours(0, 0, 0, 0)
      const endOfDay = new Date(appointmentDate)
      endOfDay.setHours(23, 59, 59, 999)

      const existingAppointments = await prisma.appointment.findMany({
        where: {
          restaurantId: existingAppointment.restaurantId,
          id: { not: id }, // Excluir la cita actual
          date: {
            gte: appointmentDate,
            lte: endOfDay
          },
          status: {
            notIn: ['cancelled', 'no_show']
          }
        }
      })

      const hasConflict = existingAppointments.some(apt => {
        const aptStart = apt.startTime
        const aptEnd = apt.endTime

        return (
          (newStartTime >= aptStart && newStartTime < aptEnd) ||
          (newEndTime > aptStart && newEndTime <= aptEnd) ||
          (newStartTime <= aptStart && newEndTime >= aptEnd)
        )
      })

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Ya existe una cita en ese horario' },
          { status: 409 }
        )
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cita' },
      { status: 500 }
    )
  }
}

// DELETE /api/appointments/[id] - Eliminar una cita
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Cita eliminada' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cita' },
      { status: 500 }
    )
  }
}
