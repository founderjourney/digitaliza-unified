import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession, COOKIE_SESSION_NAME, getClearSessionCookieOptions } from '@/lib/auth'

// D2-05: POST /api/auth/logout
export async function POST() {
  try {
    // 1. Leer token de cookie
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_SESSION_NAME)?.value

    // 2. Eliminar sesión de BD con deleteSession()
    if (token) {
      await deleteSession(token)
    }

    // 3. Clear cookie
    const clearOptions = getClearSessionCookieOptions()
    cookieStore.set(clearOptions.name, '', {
      httpOnly: clearOptions.httpOnly,
      secure: clearOptions.secure,
      sameSite: clearOptions.sameSite,
      maxAge: clearOptions.maxAge,
      path: clearOptions.path,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
