import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const results: any[] = []

  try {
    // Check if AdminUser table exists
    try {
      const { count, error } = await supabase
        .from('AdminUser')
        .select('*', { count: 'exact', head: true })

      if (error) {
        results.push({
          table: 'AdminUser',
          status: 'NOT FOUND',
          error: error.message
        })
      } else {
        results.push({
          table: 'AdminUser',
          status: 'OK',
          count: count || 0
        })
      }
    } catch (e: any) {
      results.push({
        table: 'AdminUser',
        status: 'ERROR',
        error: e.message
      })
    }

    // Check if Visitor table exists
    try {
      const { count, error } = await supabase
        .from('Visitor')
        .select('*', { count: 'exact', head: true })

      if (error) {
        results.push({
          table: 'Visitor',
          status: 'NOT FOUND',
          error: error.message
        })
      } else {
        results.push({
          table: 'Visitor',
          status: 'OK',
          count: count || 0
        })
      }
    } catch (e: any) {
      results.push({
        table: 'Visitor',
        status: 'ERROR',
        error: e.message
      })
    }

    const hasErrors = results.some((r: any) => r.status === 'NOT FOUND')

    if (hasErrors) {
      return NextResponse.json({
        success: false,
        message: 'Tabel belum ada',
        results,
        instructions: [
          '1. Buka: https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new',
          '2. Copy SQL script dari /home/z/my-project/supabase-setup-v2.sql',
          '3. Paste dan klik "Run"',
          '4. Tunggu sampai success'
        ]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database is ready!',
      results,
      connectionType: 'Supabase REST API'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 })
  }
}