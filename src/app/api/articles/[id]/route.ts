import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

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

    const { data, error } = await supabase
      .from('Article')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate artikel'
    return Response.json({ error: message }, { status: 400 })
  }
}
