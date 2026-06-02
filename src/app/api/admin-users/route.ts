import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('AdminUser').select('*').order('createdAt', { ascending: false })

    if (error) throw error
    return Response.json(data || [])
  } catch (error: unknown) {
    console.error('Error fetching admin users:', error)
    return Response.json({ error: 'Gagal mengambil data admin users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, name, email, role } = body

    if (!username || !password || !name) {
      return Response.json({ error: 'Username, password, dan name wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('AdminUser').insert({
      username,
      password,
      name,
      email,
      role: role || 'admin',
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    console.error('Error creating admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal membuat admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID diperlukan' }, { status: 400 })
    }

    const { error } = await supabase.from('AdminUser').delete().eq('id', id)

    if (error) throw error
    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal menghapus admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, username, password, name, email, role } = body

    const updateFields: Record<string, unknown> = {}
    if (username !== undefined) updateFields.username = username
    if (password !== undefined) updateFields.password = password
    if (name !== undefined) updateFields.name = name
    if (email !== undefined) updateFields.email = email
    if (role !== undefined) updateFields.role = role

    const { data, error } = await supabase.from('AdminUser').update(updateFields).eq('id', id).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    console.error('Error updating admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}