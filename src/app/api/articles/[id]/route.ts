import { NextRequest, NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firestore'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      title,
      slug,
      image,
      author,
      category,
      excerpt,
      content,
      published,
      seoTitle,
      seoDesc,
      seoKeywords,
      updatedAt,
    } = body

    // Extract and exclude 'id' from update data - Firebase document ID is separate
    const { id: bodyId, ...dataWithoutId } = body

    const updateFields: Record<string, unknown> = {
      updatedAt: updatedAt || new Date().toISOString(),
    }
    if (title !== undefined) updateFields.title = title
    if (slug !== undefined) updateFields.slug = slug
    if (image !== undefined) updateFields.image = image
    if (author !== undefined) updateFields.author = author
    if (category !== undefined) updateFields.category = category
    if (excerpt !== undefined) updateFields.excerpt = excerpt
    if (content !== undefined) updateFields.content = content
    if (published !== undefined) updateFields.published = published
    if (seoTitle !== undefined) updateFields.seoTitle = seoTitle
    if (seoDesc !== undefined) updateFields.seoDesc = seoDesc
    if (seoKeywords !== undefined) updateFields.seoKeywords = seoKeywords

    await updateDocument(COLLECTIONS.ARTICLES, id, updateFields)
    const updated = await getDocument(COLLECTIONS.ARTICLES, id)
    return NextResponse.json(updated)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate artikel'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteDocument(COLLECTIONS.ARTICLES, id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 400 })
  }
}