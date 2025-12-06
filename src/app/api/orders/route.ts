// src/app/api/orders/route.ts
// API para gestión de pedidos (Tiendas y Restaurantes)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

// GET /api/orders - Listar pedidos de un negocio
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const status = searchParams.get('status')
    const orderType = searchParams.get('orderType')
    const limit = searchParams.get('limit')

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'restaurantId es requerido' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: Record<string, unknown> = { restaurantId }

    if (status) {
      // Permitir múltiples estados separados por coma
      const statuses = status.split(',')
      where.status = statuses.length > 1 ? { in: statuses } : status
    }

    if (orderType) {
      where.orderType = orderType
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    // Convertir Decimal a number para JSON
    const ordersWithNumbers = orders.map(order => ({
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
    }))

    return NextResponse.json(ordersWithNumbers)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Crear un nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryNotes,
      orderType = 'pickup',
      items, // Array de { menuItemId, quantity, notes }
      notes,
      paymentMethod
    } = body

    // Validaciones básicas
    if (!restaurantId || !customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos o el pedido está vacío' },
        { status: 400 }
      )
    }

    // Validar que el negocio existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    // Obtener los menuItems para validar y obtener precios actuales
    const menuItemIds = items.map((item: { menuItemId: string }) => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId,
        available: true
      }
    })

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: 'Algunos productos no están disponibles' },
        { status: 400 }
      )
    }

    // Crear mapa de precios
    const priceMap = new Map(menuItems.map(item => [item.id, item]))

    // Calcular totales
    let subtotal = new Decimal(0)
    const orderItems: {
      menuItemId: string
      quantity: number
      unitPrice: Decimal
      totalPrice: Decimal
      notes: string | null
      itemName: string
      itemCategory: string | null
    }[] = []

    for (const item of items) {
      const menuItem = priceMap.get(item.menuItemId)
      if (!menuItem) continue

      const quantity = item.quantity || 1
      const unitPrice = menuItem.price
      const totalPrice = unitPrice.mul(quantity)

      subtotal = subtotal.add(totalPrice)

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity,
        unitPrice,
        totalPrice,
        notes: item.notes || null,
        itemName: menuItem.name,
        itemCategory: menuItem.category
      })
    }

    // TODO: Calcular delivery fee basado en distancia o configuración del negocio
    const deliveryFee = orderType === 'delivery' ? new Decimal(0) : new Decimal(0)
    const tax = new Decimal(0) // TODO: Configurar impuestos por negocio
    const total = subtotal.add(deliveryFee).add(tax)

    // Generar número de orden
    const orderCount = await prisma.order.count({
      where: { restaurantId }
    })
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`

    // Crear el pedido con sus items
    const order = await prisma.order.create({
      data: {
        restaurantId,
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        deliveryNotes: orderType === 'delivery' ? deliveryNotes : null,
        orderType,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: 'pending',
        notes,
        paymentMethod,
        items: {
          create: orderItems
        }
      },
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
        },
        restaurant: {
          select: {
            name: true,
            whatsapp: true,
            phone: true
          }
        }
      }
    })

    // Convertir Decimal a number para JSON
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

    return NextResponse.json(orderWithNumbers, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    )
  }
}
