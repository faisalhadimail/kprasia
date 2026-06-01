import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, phone, type, building, location, dp, promo, status } = body

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (type !== undefined) updateFields.type = type
    if (building !== undefined) updateFields.building = building
    if (location !== undefined) updateFields.location = location
    if (dp !== undefined) updateFields.dp = dp
    if (promo !== undefined) updateFields.promo = promo
    if (status !== undefined) updateFields.status = status

    const { data, error } = await supabase.from('Visitor').update(updateFields).eq('id', id).select().single()
    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('Visitor').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus pengunjung' }, { status: 400 })
  }
}
