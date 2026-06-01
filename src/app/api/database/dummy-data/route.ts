import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase environment variables' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Dummy Articles
    const dummyArticles = [
      {
        title: 'Cara Memilih Villa yang Tepat untuk Liburan Keluarga',
        slug: 'cara-memilih-villa-untuk-liburan-keluarga',
        content: 'Memilih villa untuk liburan keluarga membutuhkan pertimbangan yang matang. Pertimbangkan lokasi, fasilitas, dan kapasitas yang sesuai dengan kebutuhan keluarga Anda.',
        author: 'Admin',
        category: 'Tips',
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        published: true,
        created_at: new Date().toISOString()
      },
      {
        title: 'Destinasi Wisata Terbaik di Bali Tahun 2024',
        slug: 'destinasi-wisata-terbaik-bali-2024',
        content: 'Bali menawarkan berbagai destinasi wisata yang menakjubkan. Dari pantai indah hingga tempat bersejarah, ada banyak pilihan untuk liburan Anda.',
        author: 'Admin',
        category: 'Wisata',
        image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        published: true,
        created_at: new Date().toISOString()
      },
      {
        title: 'Tips Menjaga Kebersihan Villa Saat Sewa',
        slug: 'tips-menjaga-kebersihan-villa-sewa',
        content: 'Menjaga kebersihan villa saat disewa adalah tanggung jawab bersama. Berikut tips-tips untuk menjaga villa tetap bersih dan nyaman.',
        author: 'Admin',
        category: 'Tips',
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        published: true,
        created_at: new Date().toISOString()
      },
      {
        title: 'Pengalaman Menginap di Villa dengan Pemandangan Sawah',
        slug: 'pengalaman-menginap-villa-pemandangan-sawah',
        content: 'Menginap di villa dengan pemandangan sawah memberikan pengalaman yang unik dan menenangkan. Suasana pedesaan yang asri membuat liburan semakin berkesan.',
        author: 'Admin',
        category: 'Review',
        image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        published: true,
        created_at: new Date().toISOString()
      },
      {
        title: 'Harga Villa Musim Liburan vs Musim Biasa',
        slug: 'harga-villa-musim-liburan-vs-biasa',
        content: 'Perbedaan harga villa antara musim liburan dan musim biasa bisa cukup signifikan. Pelajari tips mendapatkan harga terbaik untuk liburan Anda.',
        author: 'Admin',
        category: 'Info',
        image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
        published: true,
        created_at: new Date().toISOString()
      }
    ]

    // Dummy Users
    const dummyUsers = [
      {
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phone: '+6281234567890',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        name: 'Siti Rahayu',
        email: 'siti@example.com',
        phone: '+6282345678901',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        name: 'Ahmad Wijaya',
        email: 'ahmad@example.com',
        phone: '+6283456789012',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        name: 'Dewi Lestari',
        email: 'dewi@example.com',
        phone: '+6284567890123',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        name: 'Rudi Hermawan',
        email: 'rudi@example.com',
        phone: '+6285678901234',
        role: 'user',
        created_at: new Date().toISOString()
      }
    ]

    // Insert dummy articles
    const { error: articlesError } = await supabase.from('Article').insert(dummyArticles)

    // Insert dummy users
    const { error: usersError } = await supabase.from('User').insert(dummyUsers)

    // Insert dummy reviews
    const dummyReviews = dummyUsers.slice(0, 3).map((user, index) => ({
      user_id: user.email,
      rating: 5,
      comment: `Pengalaman menginap yang sangat menyenangkan! Villa ${index + 1} sangat nyaman dan bersih.`,
      created_at: new Date().toISOString()
    }))

    const { error: reviewsError } = await supabase.from('Review').insert(dummyReviews)

    return NextResponse.json({
      success: true,
      message: 'Dummy data berhasil ditambahkan',
      results: {
        articles: articlesError ? { success: false, error: articlesError.message } : { success: true, count: dummyArticles.length },
        users: usersError ? { success: false, error: usersError.message } : { success: true, count: dummyUsers.length },
        reviews: reviewsError ? { success: false, error: reviewsError.message } : { success: true, count: dummyReviews.length }
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}