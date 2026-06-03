import { COLLECTIONS } from '@/lib/firebase'
import { updateDocument, deleteDocument } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, phone, type, building, location, dp, promo, status } = body

    const updateFields: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (type !== undefined) updateFields.type = type
    if (building !== undefined) updateFields.building = building
    if (location !== undefined) updateFields.location = location
    if (dp !== undefined) updateFields.dp = dp
    if (promo !== undefined) updateFields.promo = promo
    if (status !== undefined) updateFields.status = status

    await updateDocument(COLLECTIONS.VISITORS, id, updateFields)

    return NextResponse.json({
      id,
      ...updateFields,
    })
  } catch (error: unknown) {
    console.error('[PUT /api/visitors/[id]] Error:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate pengunjung'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteDocument(COLLECTIONS.VISITORS, id)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[DELETE /api/visitors/[id]] Error:', error)
    return NextResponse.json({ error: 'Gagal menghapus pengunjung' }, { status: 400 })
  }
}