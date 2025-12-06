// src/app/api/appointments/availability/route.ts
// API para obtener disponibilidad de horarios

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/appointments/availability?restaurantId=X&date=YYYY-MM-DD&menuItemId=Y
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const date = searchParams.get('date')
    const menuItemId = searchParams.get('menuItemId')

    if (!restaurantId || !date) {
      return NextResponse.json(
        { error: 'restaurantId y date son requeridos' },
        { status: 400 }
      )
    }

    // Obtener el negocio con sus horarios
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        hours: true,
        businessMode: true
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    // Obtener duración del servicio si se especifica
    let serviceDuration = 30 // Default 30 min
    if (menuItemId) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        select: { duration: true }
      })
      if (menuItem?.duration) {
        serviceDuration = menuItem.duration
      }
    }

    // Parsear horarios del negocio
    let businessHours: Record<string, string> = {}
    try {
      businessHours = JSON.parse(restaurant.hours || '{}')
    } catch {
      // Si no hay horarios configurados, usar default
      businessHours = {
        mon: '09:00-18:00',
        tue: '09:00-18:00',
        wed: '09:00-18:00',
        thu: '09:00-18:00',
        fri: '09:00-18:00',
        sat: '09:00-14:00',
        sun: ''
      }
    }

    // Obtener día de la semana
    const dateObj = new Date(date)
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const dayOfWeek = days[dateObj.getDay()]

    const dayHours = businessHours[dayOfWeek] || ''

    // Si no hay horario para ese día, no hay slots disponibles
    if (!dayHours) {
      return NextResponse.json({
        date,
        dayOfWeek,
        isOpen: false,
        slots: [],
        message: 'El negocio está cerrado este día'
      })
    }

    // Parsear horario de apertura y cierre
    const [openTime, closeTime] = dayHours.split('-')
    if (!openTime || !closeTime) {
      return NextResponse.json({
        date,
        dayOfWeek,
        isOpen: false,
        slots: [],
        message: 'Horario no configurado correctamente'
      })
    }

    // Generar todos los slots posibles
    const slots = generateTimeSlots(openTime, closeTime, serviceDuration)

    // Obtener citas existentes para ese día
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        restaurantId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          notIn: ['cancelled', 'no_show']
        }
      },
      select: {
        startTime: true,
        endTime: true,
        duration: true
      }
    })

    // Marcar slots ocupados
    const slotsWithAvailability = slots.map(slot => {
      // Calcular hora de fin del slot
      const [h, m] = slot.split(':').map(Number)
      const slotStart = new Date()
      slotStart.setHours(h, m, 0, 0)
      const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000)
      const slotEndTime = `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`

      // Verificar si hay conflicto con alguna cita existente
      const isOccupied = existingAppointments.some(apt => {
        return (
          (slot >= apt.startTime && slot < apt.endTime) ||
          (slotEndTime > apt.startTime && slotEndTime <= apt.endTime) ||
          (slot <= apt.startTime && slotEndTime >= apt.endTime)
        )
      })

      // Verificar si el slot ya pasó (para el día de hoy)
      const now = new Date()
      const isToday = dateObj.toDateString() === now.toDateString()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const isPast = isToday && slot <= currentTime

      return {
        time: slot,
        endTime: slotEndTime,
        available: !isOccupied && !isPast,
        reason: isOccupied ? 'occupied' : isPast ? 'past' : null
      }
    })

    return NextResponse.json({
      date,
      dayOfWeek,
      isOpen: true,
      openTime,
      closeTime,
      serviceDuration,
      slots: slotsWithAvailability,
      availableCount: slotsWithAvailability.filter(s => s.available).length,
      totalSlots: slotsWithAvailability.length
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Error al obtener disponibilidad' },
      { status: 500 }
    )
  }
}

// Función auxiliar para generar slots de tiempo
function generateTimeSlots(openTime: string, closeTime: string, duration: number): string[] {
  const slots: string[] = []

  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  let currentH = openH
  let currentM = openM

  // Generar slots hasta que no quede espacio para una cita completa
  while (true) {
    const slotTime = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`

    // Calcular fin del slot
    const endMinutes = currentH * 60 + currentM + duration
    const closeMinutes = closeH * 60 + closeM

    // Si el slot termina después del cierre, no lo agregamos
    if (endMinutes > closeMinutes) {
      break
    }

    slots.push(slotTime)

    // Avanzar al siguiente slot (cada 30 minutos o según la duración)
    const interval = Math.min(30, duration) // Slots cada 30 min máximo
    currentM += interval

    if (currentM >= 60) {
      currentH += Math.floor(currentM / 60)
      currentM = currentM % 60
    }

    // Seguridad: evitar loops infinitos
    if (slots.length > 100) break
  }

  return slots
}
