import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Available tables
const TABLES = ['Property', 'Article', 'Review', 'User', 'Availability'] as const

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase environment variables' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const backup: Record<string, any[]> = {}

    for (const table of TABLES) {
      try {
        const { data, error } = await supabase.from(table).select('*')
        if (!error) {
          backup[table] = data || []
        } else {
          backup[table] = [] // Table doesn't exist or error
        }
      } catch (e) {
        backup[table] = []
      }
    }

    return NextResponse.json({
      success: true,
      data: backup,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Backup failed' },
      { status: 500 }
    )
  }
}