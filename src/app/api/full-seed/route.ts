import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SEED_DATA = {
  Agency: [
    {
      id: 'agency-1',
      name: 'PropertiHub Indonesia',
      phone: '+628123456789',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      kprInterest: 5.5,
    }
  ],
  AdminUser: [
    {
      id: 'admin-1',
      name: 'Admin',
      username: 'admin',
      password: 'admin123',
      role: 'Super Admin',
    }
  ],
  SEO: [
    {
      id: 'seo-1',
      frontendUrl: 'https://propertihub.com',
      title: 'PropertiHub - Temukan Hunian Impian Anda',
      description: 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
      keywords: 'properti,rumah,apartemen,jual rumah,beli rumah,propertihub',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    }
  ],
  Promo: [
    {
      id: 'promo-1',
      badge: 'DP 0%',
      title: 'DP 0 Rupiah',
      subtitle: 'Beli tanpa uang muka, cicilan ringan',
    },
    {
      id: 'promo-2',
      badge: 'FREE BIAYA',
      title: 'Free Biaya KPR',
      subtitle: 'Gratis provisi, notaris, dan administrasi',
    },
  ],
  Agent: [
    {
      id: 'agent-1',
      name: 'Budi Santoso',
      role: 'Senior Agent',
      phone: '6281234567890',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'agent-2',
      name: 'Sari Dewi',
      role: 'Agent',
      phone: '6281987654321',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  ],
  PropertyType: [
    { id: 'pt-1', name: 'Rumah', icon: 'home', order: 1 },
    { id: 'pt-2', name: 'Apartemen', icon: 'building-2', order: 2 },
    { id: 'pt-3', name: 'Villa', icon: 'building', order: 3 },
    { id: 'pt-4', name: 'Tanah', icon: 'trees', order: 4 },
    { id: 'pt-5', name: 'Ruko', icon: 'tent', order: 5 },
    { id: 'pt-6', name: 'Kavling', icon: 'layers', order: 6 },
  ],
  Location: [
    {
      id: 'loc-1',
      kabupaten: 'Badung',
      kecamatan: ['Kuta', 'Kuta Selatan', 'Mengwi', 'Abiansemal'],
    },
    {
      id: 'loc-2',
      kabupaten: 'Denpasar',
      kecamatan: ['Denpasar Barat', 'Denpasar Selatan', 'Denpasar Timur', 'Denpasar Utara'],
    },
    {
      id: 'loc-3',
      kabupaten: 'Gianyar',
      kecamatan: ['Ubud', 'Tegallalang', 'Gianyar', 'Sukawati'],
    },
  ],
}

export async function POST() {
  try {
    const results: Record<string, number> = {}

    for (const [table, data] of Object.entries(SEED_DATA)) {
      if (Array.isArray(data) && data.length > 0) {
        const { count, error } = await supabase.from(table).insert(data)
        if (error && !error.message.includes('duplicate key')) {
          console.error(`Seed ${table} error:`, error)
        }
        results[table] = count ?? data.length
      }
    }

    // Invalidate cache
    try {
      const { invalidateCache } = await import('@/lib/cache')
      invalidateCache()
    } catch { /* ignore */ }

    return NextResponse.json({
      success: true,
      message: 'Data dasar berhasil di-seed.',
      results,
    })
  } catch (error) {
    console.error('Full seed failed:', error)
    return NextResponse.json(
      { error: 'Gagal seed data: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
