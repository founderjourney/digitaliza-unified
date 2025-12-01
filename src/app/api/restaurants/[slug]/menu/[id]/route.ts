import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { id: true, slug: true },
        },
      },
    })

    if (!item || item.restaurant.slug !== slug) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la sesión pertenece a este restaurante
    if (session.restaurantId !== item.restaurant.id) {
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

    // 4. Actualizar item
    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        category: category || item.category,
        available,
      },
    })

    // 5. Retornar item actualizado
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: Number(updated.price),
      imageUrl: updated.imageUrl,
      category: updated.category,
      available: updated.available,
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
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { id: true, slug: true },
        },
      },
    })

    if (!item || item.restaurant.slug !== slug) {
      return NextResponse.json(
        { error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la sesión pertenece a este restaurante
    if (session.restaurantId !== item.restaurant.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este item' },
        { status: 403 }
      )
    }

    // 3. Eliminar item
    await prisma.menuItem.delete({
      where: { id },
    })

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
