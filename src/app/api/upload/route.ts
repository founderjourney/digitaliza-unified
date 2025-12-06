// src/app/api/upload/route.ts
// API para subir logos y otras imágenes

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'

// Tamaño máximo permitido: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024

// Tipos de imagen permitidos
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']

// POST /api/upload - Subir imagen
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const restaurantId = data.get('restaurantId') as string | null
    const type = data.get('type') as string | null // 'logo' | 'item' | 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'No se subió ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use JPG, PNG, WebP, SVG o GIF.' },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 2MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generar nombre único con extensión original
    const ext = file.name.split('.').pop() || 'png'
    const filename = `${uuidv4()}.${ext}`

    // Determinar directorio según tipo
    const subDir = type === 'logo' ? 'logos' : type === 'item' ? 'items' : 'uploads'
    const uploadDir = path.join(process.cwd(), 'public', subDir)

    // Crear directorio si no existe
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // El directorio ya existe
    }

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // URL pública
    const url = `/${subDir}/${filename}`

    // Si es un logo y viene restaurantId, actualizar el negocio
    if (type === 'logo' && restaurantId) {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
      })

      if (restaurant) {
        await prisma.restaurant.update({
          where: { id: restaurantId },
          data: { logoUrl: url }
        })

        return NextResponse.json({
          success: true,
          url,
          message: 'Logo actualizado correctamente',
          restaurant: {
            id: restaurant.id,
            name: restaurant.name
          }
        })
      }
    }

    return NextResponse.json({ url, success: true })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Eliminar logo de un negocio
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'restaurantId es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el restaurante existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    // TODO: Eliminar archivo físico si es necesario

    // Eliminar el logo de la BD
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { logoUrl: null }
    })

    return NextResponse.json({
      success: true,
      message: 'Logo eliminado correctamente'
    })
  } catch (error) {
    console.error('Error deleting logo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar logo' },
      { status: 500 }
    )
  }
}
