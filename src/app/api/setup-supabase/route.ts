import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action = 'all', reset = false } = body // 'tables', 'seed', or 'all'

    const results: Record<string, string> = {}

    // Seed Admin Users
    if (action === 'seed' || action === 'all') {
      try {
        if (reset) {
          await supabase.from('AdminUser').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        }

        const { error: adminError } = await supabase
          .from('AdminUser')
          .upsert([
            {
              username: 'admin',
              password: 'admin123',
              name: 'Super Admin',
              email: 'admin@example.com',
              role: 'superadmin',
            },
            {
              username: 'marketing',
              password: 'marketing123',
              name: 'Marketing Team',
              email: 'marketing@example.com',
              role: 'admin',
            },
            {
              username: 'sales',
              password: 'sales123',
              name: 'Sales Team',
              email: 'sales@example.com',
              role: 'admin',
            }
          ], { onConflict: 'username' })

        if (adminError) {
          results.seedAdmin = 'Failed: ' + adminError.message
        } else {
          results.seedAdmin = 'Success'
        }
      } catch (e) {
        results.seedAdmin = 'Failed: ' + (e instanceof Error ? e.message : 'Unknown error')
      }

      // Seed Visitors/Leads
      try {
        if (reset) {
          await supabase.from('Visitor').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        }

        const visitors = [
          { name: 'Budi Santoso', phone: '081234567890', email: 'budi@email.com', type: 'Rumah', building: '90m²', location: 'Jakarta Selatan', status: 'Baru', notes: 'Lead dari website', interest: 'Rumah Minimalis' },
          { name: 'Siti Rahayu', phone: '081234567891', email: 'siti@email.com', type: 'Apartemen', building: '2BR', location: 'Jakarta Pusat', status: 'Follow Up', notes: 'Ingin info unit 2BR', interest: 'Apartemen Mewah' },
          { name: 'Andi Wijaya', phone: '081234567892', email: 'andi@email.com', type: 'Rumah', building: '120m²', location: 'Bogor', status: 'Hot Lead', notes: 'Siap KPR, survey minggu depan', interest: 'Cluster Family' },
          { name: 'Dewi Lestari', phone: '081234567893', email: 'dewi@email.com', type: 'Ruko', building: '2 Lantai', location: 'Bandung', status: 'Closing', notes: 'Booking fee sudah dibayarkan', interest: 'Ruko Komersial' },
          { name: 'Eko Pratama', phone: '081234567894', email: 'eko@email.com', type: 'Tanah', building: '200m²', location: 'Bekasi', status: 'Baru', notes: 'Cari lokasi strategis dekat tol', interest: 'Tanah Kavling' },
        ]

        // Try to insert, ignore duplicates
        for (const visitor of visitors) {
          await supabase.from('Visitor').insert(visitor).ignore()
        }

        results.seedVisitors = 'Success'
      } catch (e) {
        results.seedVisitors = 'Failed: ' + (e instanceof Error ? e.message : 'Unknown error')
      }
    }

    // Get final counts
    const { count: adminCount, error: adminCountError } = await supabase.from('AdminUser').select('*', { count: 'exact', head: true })
    const { count: visitorCount, error: visitorCountError } = await supabase.from('Visitor').select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      results,
      counts: {
        adminUsers: adminCountError ? 0 : adminCount || 0,
        visitors: visitorCountError ? 0 : visitorCount || 0,
      },
      message: 'Supabase setup completed'
    })
  } catch (error: unknown) {
    console.error('Setup Supabase error:', error)
    const message = error instanceof Error ? error.message : 'Gagal setup Supabase'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}