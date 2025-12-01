import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File

        if (!file) {
            return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generar nombre único
        const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`

        // Ruta absoluta para guardar (en public/uploads)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        const filepath = path.join(uploadDir, filename)

        console.log('Saving file to:', filepath)

        await writeFile(filepath, buffer)
        console.log('File saved successfully')

        // Retornar URL pública
        const url = `/uploads/${filename}`

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
    }
}
