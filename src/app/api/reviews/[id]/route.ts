import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      name,
      phone,
      rating,
      review,
      propertyId,
      image,
      featured,
      updatedAt,
    } = body

    const updateFields: Record<string, unknown> = {
      updatedAt: updatedAt || new Date().toISOString(),
    }
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (rating !== undefined) updateFields.rating = Number(rating)
    if (review !== undefined) updateFields.review = review
    if (propertyId !== undefined) updateFields.propertyId = propertyId
    if (image !== undefined) updateFields.image = image
    if (featured !== undefined) updateFields.featured = featured

    const { data, error } = await supabase
      .from('Review')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate review'
    return Response.json({ error: message }, { status: 400 })
  }
}
