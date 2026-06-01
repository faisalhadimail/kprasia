import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { badge, title, subtitle } = body

    const updateFields: Record<string, unknown> = {}
    if (badge !== undefined) updateFields.badge = badge
    if (title !== undefined) updateFields.title = title
    if (subtitle !== undefined) updateFields.subtitle = subtitle

    const { data, error } = await supabase.from('Promo').update(updateFields).eq('id', id).select().single()
    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate promo'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('Promo').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus promo' }, { status: 400 })
  }
}
