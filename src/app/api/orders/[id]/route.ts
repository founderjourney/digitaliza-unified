// src/app/api/orders/[id]/route.ts
// API para operaciones individuales de pedidos

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/orders/[id] - Obtener un pedido específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
                price: true
              }
            }
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

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Convertir Decimal a number
    const orderWithNumbers = {
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      tax: Number(order.tax),
      total: Number(order.total),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        menuItem: item.menuItem ? {
          ...item.menuItem,
          price: Number(item.menuItem.price)
        } : null
      }))
    }

    return NextResponse.json(orderWithNumbers)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedido' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Actualizar un pedido (principalmente estado)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      status,
      estimatedTime,
      adminNotes,
      deliveryAddress,
      deliveryNotes
    } = body

    // Verificar que el pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Validar transiciones de estado válidas
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['out_for_delivery', 'completed', 'cancelled'], // out_for_delivery solo para delivery
      out_for_delivery: ['delivered', 'cancelled'],
      delivered: ['completed'],
      completed: [], // Estado final
      cancelled: [] // Estado final
    }

    if (status && status !== existingOrder.status) {
      const allowedTransitions = validTransitions[existingOrder.status] || []
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json(
          {
            error: `Transición de estado no válida: ${existingOrder.status} -> ${status}`,
            allowedTransitions
          },
          { status: 400 }
        )
      }
    }

    // Construir datos de actualización
    const updateData: Record<string, unknown> = {}

    if (status !== undefined) updateData.status = status
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (deliveryAddress !== undefined) updateData.deliveryAddress = deliveryAddress
    if (deliveryNotes !== undefined) updateData.deliveryNotes = deliveryNotes

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    // Convertir Decimal a number
    const orderWithNumbers = {
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      tax: Number(order.tax),
      total: Number(order.total),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice)
      }))
    }

    return NextResponse.json(orderWithNumbers)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Error al actualizar pedido' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Eliminar un pedido (solo si está pendiente o cancelado)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Solo permitir eliminar pedidos pendientes o cancelados
    if (!['pending', 'cancelled'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Solo se pueden eliminar pedidos pendientes o cancelados' },
        { status: 400 }
      )
    }

    // Eliminar el pedido (cascade eliminará los items)
    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Pedido eliminado' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Error al eliminar pedido' },
      { status: 500 }
    )
  }
}
