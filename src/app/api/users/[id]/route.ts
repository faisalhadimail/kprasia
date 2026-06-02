import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, username, password, role } = body

    // Check if user exists
    const users = await getCollection(COLLECTIONS.ADMIN_USERS)
    const user = users.find((u: any) => u.id === id)
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Check if username already exists (excluding current user)
    if (username && username !== user.username) {
      const usernameExists = users.some((u: any) => u.username === username && u.id !== id)
      if (usernameExists) {
        return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
      }
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }
    if (name !== undefined) updateFields.name = name
    if (username !== undefined) updateFields.username = username
    if (password !== undefined) updateFields.password = password
    if (role !== undefined) updateFields.role = role

    const updated = await updateDocument(COLLECTIONS.ADMIN_USERS, id, updateFields)

    if (!updated) {
      return NextResponse.json({ error: 'Gagal mengupdate user' }, { status: 500 })
    }

    // Return formatted user (exclude password)
    const formattedUser = {
      id,
      name: updateFields.name ?? user.name,
      username: updateFields.username ?? user.username,
      role: updateFields.role ?? user.role,
      createdAt: user.createdAt,
      updatedAt: updateFields.updatedAt,
    }
    return NextResponse.json(formattedUser)
  } catch (error: unknown) {
    console.error('[PUT /api/users/[id]] Error:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate user'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get all users to check if this is the last user
    const users = await getCollection(COLLECTIONS.ADMIN_USERS)

    if ((users ?? []).length <= 1) {
      return NextResponse.json({ error: 'Tidak dapat menghapus user terakhir' }, { status: 400 })
    }

    // Check if user exists
    const user = users.find((u: any) => u.id === id)
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    await deleteDocument(COLLECTIONS.ADMIN_USERS, id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[DELETE /api/users/[id]] Error:', error)
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 400 })
  }
}