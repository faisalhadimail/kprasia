import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing Supabase environment variables'
    }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if AdminUser table has data
    const { data: existingAdminUsers, error: adminUsersError } = await supabase
      .from('AdminUser')
      .select('id')
      .limit(1)

    if (adminUsersError) {
      return NextResponse.json({
        success: false,
        error: `AdminUser error: ${adminUsersError.message}`
      }, { status: 500 })
    }

    // Insert dummy AdminUser only if table is empty
    let adminUsersResult = { success: true, count: 0, message: 'Data already exists' }
    if (!existingAdminUsers || existingAdminUsers.length === 0) {
      const dummyAdminUsers = [
        {
          name: 'Administrator',
          username: 'admin',
          password: 'admin123',
          role: 'superadmin'
        },
        {
          name: 'Marketing Manager',
          username: 'marketing',
          password: 'marketing123',
          role: 'admin'
        },
        {
          name: 'Sales Agent',
          username: 'sales',
          password: 'sales123',
          role: 'admin'
        }
      ]

      const { data, error } = await supabase
        .from('AdminUser')
        .insert(dummyAdminUsers)
        .select('id, name, username, role, createdAt, updatedAt')

      if (error) {
        adminUsersResult = { success: false, count: 0, message: error.message }
      } else {
        adminUsersResult = { success: true, count: data?.length || 0, message: 'Data inserted' }
      }
    }

    // Check if Visitor table has data
    const { data: existingVisitors, error: visitorsError } = await supabase
      .from('Visitor')
      .select('id')
      .limit(1)

    if (visitorsError) {
      return NextResponse.json({
        success: false,
        error: `Visitor error: ${visitorsError.message}`
      }, { status: 500 })
    }

    // Insert dummy Visitor only if table is empty
    let visitorsResult = { success: true, count: 0, message: 'Data already exists' }
    if (!existingVisitors || existingVisitors.length === 0) {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0]

      const dummyVisitors = [
        {
          date: twoDaysAgo,
          name: 'Rina Wati',
          phone: '0812-1111-2222',
          type: 'Rumah',
          building: '36/72',
          location: 'Serpong, Tangerang Selatan',
          dp: '75 Juta',
          promo: 'DISKON',
          status: 'Follow Up'
        },
        {
          date: yesterday,
          name: 'Dedi Kurniawan',
          phone: '0813-2222-3333',
          type: 'Apartemen',
          building: 'Studio',
          location: 'Pamulang, Tangerang Selatan',
          dp: '0',
          promo: 'DP 0%',
          status: 'Hot Lead'
        },
        {
          date: today,
          name: 'Linda Permata',
          phone: '0857-3333-4444',
          type: 'Rumah',
          building: '45/90',
          location: 'Karawaci, Tangerang',
          dp: '100 Juta',
          promo: 'BONUS FURNITURE',
          status: 'Baru'
        },
        {
          date: today,
          name: 'Joko Prasetyo',
          phone: '0878-4444-5555',
          type: 'Tanah',
          building: '-',
          location: 'Cikarang, Bekasi',
          dp: '200 Juta',
          promo: '',
          status: 'Baru'
        },
        {
          date: today,
          name: 'Maya Sari',
          phone: '0899-5555-6666',
          type: 'Ruko',
          building: '3 Lantai',
          location: 'Bintaro, Tangerang Selatan',
          dp: '500 Juta',
          promo: 'FREE BIAYA KPR',
          status: 'Closing'
        }
      ]

      const { data, error } = await supabase
        .from('Visitor')
        .insert(dummyVisitors)
        .select()

      if (error) {
        visitorsResult = { success: false, count: 0, message: error.message }
      } else {
        visitorsResult = { success: true, count: data?.length || 0, message: 'Data inserted' }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dummy data berhasil diperiksa/ditambahkan',
      results: {
        adminUsers: adminUsersResult,
        visitors: visitorsResult
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}