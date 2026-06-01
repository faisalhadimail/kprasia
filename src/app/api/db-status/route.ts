import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  const config = isSupabaseConfigured()

  if (!config.ok) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'Supabase belum dikonfigurasi dengan benar',
      issues: config.issues,
      hint: 'Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di file .env',
    }, { status: 503 })
  }

  try {
    // Try a lightweight query to verify connection
    const { count, error } = await supabase
      .from('Property')
      .select('*', { count: 'exact', head: true })

    if (error) {
      // Check for API key error
      if (error.message?.includes('Invalid API key') || error.message?.includes('api key')) {
        return NextResponse.json({
          status: 'invalid_key',
          message: 'API Key Supabase tidak valid',
          issues: ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY salah atau expired'],
          hint: 'Dapatkan anon key dari Supabase Dashboard > Settings > API > Project API keys > anon public',
        }, { status: 503 })
      }

      return NextResponse.json({
        status: 'error',
        message: 'Gagal terhubung ke database',
        error: error.message,
      }, { status: 503 })
    }

    return NextResponse.json({
      status: 'connected',
      message: 'Database terhubung',
      propertyCount: count ?? 0,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({
      status: 'error',
      message: 'Gagal terhubung ke database',
      error: message,
    }, { status: 503 })
  }
}
