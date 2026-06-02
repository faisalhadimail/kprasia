import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { action = 'all' } = await req.json()

    const results: Record<string, any> = {
      tables: {},
      data: {}
    }

    // Try to create AdminUser table
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from('AdminUser')
        .select('count')
        .limit(1)

      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE AdminUser (
              id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT DEFAULT '',
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              email TEXT,
              role TEXT DEFAULT 'admin',
              createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE INDEX idx_adminuser_username ON AdminUser(username);
          `
        })

        if (createError) {
          results.tables.AdminUser = 'Failed to create: ' + createError.message
        } else {
          results.tables.AdminUser = 'Created successfully'
        }
      } else {
        results.tables.AdminUser = 'Already exists'
      }
    } catch (e: unknown) {
      results.tables.AdminUser = 'Error: ' + (e instanceof Error ? e.message : 'Unknown')
    }

    // Try to create Visitor table
    try {
      const { error: checkError } = await supabase
        .from('Visitor')
        .select('count')
        .limit(1)

      if (checkError && checkError.code === '42P01') {
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE Visitor (
              id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
              date TEXT DEFAULT '',
              name TEXT DEFAULT '',
              phone TEXT DEFAULT '',
              email TEXT,
              type TEXT DEFAULT '',
              building TEXT DEFAULT '',
              location TEXT DEFAULT '',
              dp TEXT DEFAULT '',
              promo TEXT DEFAULT '',
              status TEXT DEFAULT 'Baru',
              notes TEXT,
              interest TEXT,
              createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE INDEX idx_visitor_created_at ON Visitor(createdAt DESC);
            CREATE INDEX idx_visitor_status ON Visitor(status);
          `
        })

        if (createError) {
          results.tables.Visitor = 'Failed to create: ' + createError.message
        } else {
          results.tables.Visitor = 'Created successfully'
        }
      } else {
        results.tables.Visitor = 'Already exists'
      }
    } catch (e: unknown) {
      results.tables.Visitor = 'Error: ' + (e instanceof Error ? e.message : 'Unknown')
    }

    // Seed Admin Users
    if (action === 'all' || action === 'seed') {
      try {
        const { error } = await supabase
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

        if (error) {
          results.data.adminUsers = 'Failed to seed: ' + error.message
        } else {
          results.data.adminUsers = 'Seeded successfully'
        }
      } catch (e: unknown) {
        results.data.adminUsers = 'Error: ' + (e instanceof Error ? e.message : 'Unknown')
      }

      // Seed Visitors
      try {
        const visitors = [
          { name: 'Budi Santoso', phone: '081234567890', email: 'budi@email.com', type: 'Rumah', building: '90m²', location: 'Jakarta Selatan', status: 'Baru', notes: 'Lead dari website', interest: 'Rumah Minimalis' },
          { name: 'Siti Rahayu', phone: '081234567891', email: 'siti@email.com', type: 'Apartemen', building: '2BR', location: 'Jakarta Pusat', status: 'Follow Up', notes: 'Ingin info unit 2BR', interest: 'Apartemen Mewah' },
          { name: 'Andi Wijaya', phone: '081234567892', email: 'andi@email.com', type: 'Rumah', building: '120m²', location: 'Bogor', status: 'Hot Lead', notes: 'Siap KPR, survey minggu depan', interest: 'Cluster Family' },
          { name: 'Dewi Lestari', phone: '081234567893', email: 'dewi@email.com', type: 'Ruko', building: '2 Lantai', location: 'Bandung', status: 'Closing', notes: 'Booking fee sudah dibayarkan', interest: 'Ruko Komersial' },
          { name: 'Eko Pratama', phone: '081234567894', email: 'eko@email.com', type: 'Tanah', building: '200m²', location: 'Bekasi', status: 'Baru', notes: 'Cari lokasi strategis dekat tol', interest: 'Tanah Kavling' },
        ]

        const { error } = await supabase
          .from('Visitor')
          .insert(visitors)

        if (error && !error.message.includes('duplicate')) {
          results.data.visitors = 'Failed to seed: ' + error.message
        } else {
          results.data.visitors = 'Seeded successfully'
        }
      } catch (e: unknown) {
        results.data.visitors = 'Error: ' + (e instanceof Error ? e.message : 'Unknown')
      }
    }

    // Get final counts
    const { count: adminCount } = await supabase.from('AdminUser').select('*', { count: 'exact', head: true }).catch(() => ({ count: 0 }))
    const { count: visitorCount } = await supabase.from('Visitor').select('*', { count: 'exact', head: true }).catch(() => ({ count: 0 }))

    return Response.json({
      success: true,
      results,
      counts: {
        adminUsers: adminCount || 0,
        visitors: visitorCount || 0,
      },
      message: 'Database setup completed'
    })
  } catch (error: unknown) {
    console.error('Auto-setup error:', error)
    const message = error instanceof Error ? error.message : 'Gagal auto-setup database'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    const { count: adminCount, error: adminError } = await supabase.from('AdminUser').select('*', { count: 'exact', head: true })
    const { count: visitorCount, error: visitorError } = await supabase.from('Visitor').select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      connected: true,
      tables: {
        AdminUser: {
          exists: !adminError || adminError.code !== '42P01',
          count: adminCount || 0,
          error: adminError?.message || null
        },
        Visitor: {
          exists: !visitorError || visitorError.code !== '42P01',
          count: visitorCount || 0,
          error: visitorError?.message || null
        }
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
  } catch (error: unknown) {
    return Response.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}