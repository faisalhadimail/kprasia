import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const [propertiesRes, visitorsRes, agentsRes, promosRes] = await Promise.all([
      supabase.from('Property').select('*', { count: 'exact', head: true }),
      supabase.from('Visitor').select('*', { count: 'exact', head: true }),
      supabase.from('Agent').select('*', { count: 'exact', head: true }),
      supabase.from('Promo').select('*', { count: 'exact', head: true }),
    ])

    const properties = propertiesRes.count ?? 0
    const visitors = visitorsRes.count ?? 0
    const agents = agentsRes.count ?? 0
    const promos = promosRes.count ?? 0

    // Get visitor counts for last 7 days
    const weeklyLeads: number[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const { count } = await supabase.from('Visitor').select('*', { count: 'exact', head: true }).eq('date', dateStr)
      weeklyLeads.push(count ?? 0)
    }

    return Response.json({
      properties,
      visitors,
      agents,
      promos,
      weeklyLeads,
    })
  } catch {
    return Response.json({ error: 'Gagal mengambil data statistik' }, { status: 500 })
  }
}
