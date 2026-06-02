import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getCollection(COLLECTIONS.ADMIN_USERS)
    // Format users to exclude password and add timestamps
    const formattedUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }))
    return NextResponse.json(formattedUsers || [])
  } catch (error: any) {
    console.error('[GET /api/users] Error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, username, password, role } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    // Check if username already exists
    const existingUsers = await getCollection(COLLECTIONS.ADMIN_USERS)
    const usernameExists = existingUsers.some((u: any) => u.username === username && u.id !== id)
    if (usernameExists) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const dataToCreate = {
      name: name || '',
      username,
      password,
      role: role || 'admin',
      createdAt: now,
      updatedAt: now,
    }

    const userId = id || `user-${Date.now()}`
    const created = await createDocument(COLLECTIONS.ADMIN_USERS, dataToCreate, userId)

    if (!created) {
      return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
    }

    // Return formatted user (exclude password)
    const formattedUser = {
      id: userId,
      name: dataToCreate.name,
      username: dataToCreate.username,
      role: dataToCreate.role,
      createdAt: dataToCreate.createdAt,
      updatedAt: dataToCreate.updatedAt,
    }
    return NextResponse.json(formattedUser)
  } catch (error: unknown) {
    console.error('[POST /api/users] Error:', error)
    const message = error instanceof Error ? error.message : 'Gagal membuat user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
