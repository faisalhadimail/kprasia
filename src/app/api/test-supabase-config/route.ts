import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Test connection
  let testResult = 'Not tested'
  let error = null

  if (supabaseUrl && supabaseKey) {
    try {
      const { data, error: err } = await supabase
        .from('AdminUser')
        .select('count', { count: 'exact', head: true })

      if (err) {
        error = err.message
        testResult = 'Connection failed'
      } else {
        testResult = 'Connected!'
      }
    } catch (e: any) {
      error = e.message
      testResult = 'Connection failed'
    }
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl || 'NOT SET',
    supabaseKey: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET',
    keyLength: supabaseKey?.length || 0,
    keyFormat: supabaseKey ? (supabaseKey.startsWith('eyJ') ? 'VALID JWT format' : 'INVALID format - should start with eyJ') : 'NOT SET',
    testResult,
    error,
    instructions: [
      '1. Buka https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/settings/api',
      '2. Copy "anon public" key (JWT format)',
      '3. Format harus dimulai dengan: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      '4. Update di file .env: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here'
    ]
  })
}