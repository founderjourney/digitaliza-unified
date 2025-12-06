import { NextRequest, NextResponse } from 'next/server'
import { sql, generateId } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { getSampleMenuItems } from '@/lib/sample-menu-items'

// D2-01: POST /api/restaurants - Crear restaurante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Validar con registerSchema
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, phone, whatsapp, email, address, theme, password } = validationResult.data
    const businessMode = body.businessMode || 'restaurant' // Default to restaurant

    // Colores personalizados (opcionales)
    const customPrimaryColor = body.customPrimaryColor || null
    const customSecondaryColor = body.customSecondaryColor || null
    const customAccentColor = body.customAccentColor || null

    // 2. Generar slug único
    let slug = generateSlug(name)

    // 3. Verificar que el slug no existe
    const existingSlug = await sql`SELECT slug FROM "Restaurant" WHERE slug = ${slug}`

    if (existingSlug.length > 0) {
      // Agregar número al slug si ya existe
      let counter = 2
      let newSlug = `${slug}-${counter}`
      let exists = await sql`SELECT slug FROM "Restaurant" WHERE slug = ${newSlug}`

      while (exists.length > 0) {
        counter++
        newSlug = `${slug}-${counter}`
        exists = await sql`SELECT slug FROM "Restaurant" WHERE slug = ${newSlug}`
      }
      slug = newSlug
    }

    // 4. Hash password con bcrypt
    const hashedPassword = await hashPassword(password)

    // 5. Crear en BD usando SQL directo
    const id = generateId()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO "Restaurant" (
        id, slug, name, phone, whatsapp, email, address, theme, "businessMode", password, hours, "isActive",
        "customPrimaryColor", "customSecondaryColor", "customAccentColor",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${slug}, ${name}, ${phone}, ${whatsapp}, ${email || null}, ${address}, ${theme}, ${businessMode}, ${hashedPassword}, '{}', true,
        ${customPrimaryColor}, ${customSecondaryColor}, ${customAccentColor},
        ${now}, ${now}
      )
    `

    // 6. Crear items de ejemplo basados en el tema seleccionado
    const sampleItems = getSampleMenuItems(theme)
    for (let i = 0; i < sampleItems.length; i++) {
      const item = sampleItems[i]
      const itemId = generateId()
      const itemNow = new Date().toISOString()

      await sql`
        INSERT INTO "MenuItem" (
          id, name, description, price, "imageUrl", category, available, "order",
          "restaurantId", "createdAt", "updatedAt"
        ) VALUES (
          ${itemId}, ${item.name}, ${item.description}, ${item.price}, null,
          ${item.category}, ${item.available}, ${i}, ${id}, ${itemNow}, ${itemNow}
        )
      `
    }

    // 7. NO crear sesión automática (el usuario hará login después)

    return NextResponse.json(
      {
        id,
        slug,
        name,
        message: 'Restaurante creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating restaurant:', error)

    // Manejar error de slug duplicado
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'Ya existe un restaurante con este nombre' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
