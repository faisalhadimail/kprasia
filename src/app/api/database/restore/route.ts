import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase environment variables' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const body = await request.json()

    // Validate backup data
    if (!body.data || typeof body.data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid backup data' },
        { status: 400 }
      )
    }

    const results: Record<string, { success: boolean; count: number; error?: string }> = {}

    // Restore each table
    for (const [tableName, records] of Object.entries(body.data)) {
      if (!Array.isArray(records) || records.length === 0) {
        results[tableName] = { success: true, count: 0 }
        continue
      }

      try {
        // Delete existing data (optional - depends on your needs)
        await supabase.from(tableName).delete().neq('id', '')

        // Insert new data
        const { error } = await supabase.from(tableName).insert(records)

        results[tableName] = {
          success: !error,
          count: records.length,
          error: error?.message
        }
      } catch (e: any) {
        results[tableName] = {
          success: false,
          count: 0,
          error: e.message
        }
      }
    }

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Restore failed' },
      { status: 500 }
    )
  }
}