import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('AdminUser').select('id, name, username, role, createdAt, updatedAt').order('createdAt', { ascending: false })
    if (error) throw error
    return Response.json(data || [])
  } catch {
    return Response.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, username, password, role } = body

    if (!username || !password) {
      return Response.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('AdminUser').insert({
      name: name || '',
      username,
      password,
      role: role || 'admin',
    }).select('id, name, username, role, createdAt, updatedAt').single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat user'
    return Response.json({ error: message }, { status: 400 })
  }
}
