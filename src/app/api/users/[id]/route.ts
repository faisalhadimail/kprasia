import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, username, password, role } = body

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (username !== undefined) updateFields.username = username
    if (password !== undefined) updateFields.password = password
    if (role !== undefined) updateFields.role = role

    const { data, error } = await supabase.from('AdminUser').update(updateFields).eq('id', id).select('id, name, username, role, createdAt, updatedAt').single()
    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate user'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { count, error: countError } = await supabase.from('AdminUser').select('*', { count: 'exact', head: true })
    if (countError) throw countError

    if ((count ?? 0) <= 1) {
      return Response.json({ error: 'Tidak dapat menghapus user terakhir' }, { status: 400 })
    }

    const { error } = await supabase.from('AdminUser').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus user' }, { status: 400 })
  }
}
