import { NextRequest, NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firestore'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { badge, title, subtitle } = body

    // Extract and exclude 'id' from update data - Firebase document ID is separate
    const { id: bodyId, ...dataWithoutId } = body

    const updateFields: Record<string, unknown> = {}
    if (badge !== undefined) updateFields.badge = badge
    if (title !== undefined) updateFields.title = title
    if (subtitle !== undefined) updateFields.subtitle = subtitle

    await updateDocument(COLLECTIONS.PROMOS, id, updateFields)
    const updated = await getDocument(COLLECTIONS.PROMOS, id)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate promo'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteDocument(COLLECTIONS.PROMOS, id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus promo' }, { status: 400 })
  }
}