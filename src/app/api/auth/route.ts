import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, queryCollection, dbQuery } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json({ success: false, error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    // Get all admin users and find matching username
    const adminUsers = await getCollection(COLLECTIONS.ADMIN_USERS)
    const user = adminUsers.find((u: any) => u.username === username)

    if (!user || user.password !== password) {
      return Response.json({ success: false, error: 'Username atau password salah' }, { status: 401 })
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    return Response.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}