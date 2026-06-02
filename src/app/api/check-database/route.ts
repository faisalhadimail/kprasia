import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const results: any[] = []

  try {
    // Check if tables exist
    const { data: adminUsers, error: adminError } = await supabase
      .from('AdminUser')
      .select('count', { count: 'exact', head: true })

    results.push({
      table: 'AdminUser',
      count: adminUsers || 0,
      error: adminError?.message || null,
      status: adminError ? 'NOT FOUND' : 'OK'
    })

    const { data: visitors, error: visitorError } = await supabase
      .from('Visitor')
      .select('count', { count: 'exact', head: true })

    results.push({
      table: 'Visitor',
      count: visitors || 0,
      error: visitorError?.message || null,
      status: visitorError ? 'NOT FOUND' : 'OK'
    })

    // Check if tables need to be created
    const needsSetup = adminError || visitorError

    if (needsSetup) {
      return NextResponse.json({
        success: false,
        message: 'Database tables not found',
        results,
        instructions: [
          '1. Buka https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new',
          '2. Copy script dari file: /home/z/my-project/supabase-setup-v2.sql',
          '3. Paste ke SQL Editor',
          '4. Klik tombol "Run" untuk eksekusi',
          '5. Refresh halaman ini untuk cek status'
        ]
      })
    }

    // Insert sample data if tables are empty
    if (adminUsers === 0) {
      const { error: insertError } = await supabase
        .from('AdminUser')
        .insert([
          {
            name: 'Super Admin',
            username: 'admin',
            password: 'admin123',
            email: 'admin@propertihub.com',
            role: 'superadmin'
          }
        ])
      results.push({
        action: 'Insert sample admin user',
        status: insertError ? 'FAILED' : 'OK',
        error: insertError?.message || null
      })
    }

    if (visitors === 0) {
      const { error: insertError } = await supabase
        .from('Visitor')
        .insert([
          {
            name: 'Sample Lead',
            phone: '081234567890',
            email: 'sample@email.com',
            type: 'Rumah',
            location: 'Palembang',
            dp: 'Rp 50.000.000',
            status: 'new',
            interest: 'Tinggi'
          }
        ])
      results.push({
        action: 'Insert sample visitor',
        status: insertError ? 'FAILED' : 'OK',
        error: insertError?.message || null
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database is ready!',
      results
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 })
  }
}