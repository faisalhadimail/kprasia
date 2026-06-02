import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { isSupabaseConfigured } = await import('@/lib/supabase')

    // Try to query AdminUser
    const { error: adminError, count: adminCount } = await supabase
      .from('AdminUser')
      .select('*', { count: 'exact', head: true })
      .catch((e) => ({ error: e, count: 0 }))

    // Try to query Visitor
    const { error: visitorError, count: visitorCount } = await supabase
      .from('Visitor')
      .select('*', { count: 'exact', head: true })
      .catch((e) => ({ error: e, count: 0 }))

    return Response.json({
      success: true,
      supabaseConfigured: isSupabaseConfigured,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      tables: {
        AdminUser: {
          exists: !adminError || adminError.code === 'PGRST116',
          count: adminCount || 0,
          error: adminError?.message || null
        },
        Visitor: {
          exists: !visitorError || visitorError.code === 'PGRST116',
          count: visitorCount || 0,
          error: visitorError?.message || null
        }
      }
    })
  } catch (error: unknown) {
    console.error('Check DB error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({
      success: false,
      error: message,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    }, { status: 500 })
  }
}