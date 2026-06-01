import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

const ARTICLE_SEED = [
  {
    id: 'article-1',
    title: '5 Tips Membeli Rumah Pertama untuk Milenial',
    slug: '5-tips-membeli-rumah-pertama-untuk-milenial',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    author: 'Admin PropertiHub',
    category: 'Tips Properti',
    excerpt: 'Panduan lengkap untuk milenial yang ingin membeli rumah pertama. Dari menabung DP hingga memilih lokasi yang tepat.',
    content: '<p>Membeli rumah pertama adalah pencapaian besar. Namun, banyak milenial yang merasa kesulitan memulai. Berikut 5 tips yang bisa membantu:</p><h3>1. Mulai Menabung DP Sejak Dini</h3><p>Uang muka minimal 10-20% dari harga rumah. Mulai menabung sedini mungkin.</p><h3>2. Pilih Lokasi Strategis</h3><p>Pertimbangkan akses transportasi, fasilitas umum, dan potensi kenaikan harga.</p><h3>3. Hitung Kemampuan KPR</h3><p>Cicilan KPR idealnya tidak lebih dari 30% penghasilan bulanan.</p><h3>4. Periksa Legalitas</h3><p>Pastikan sertifikat SHM dan IMB/PBG sudah lengkap.</p><h3>5. Manfaatkan Promo Developer</h3><p>Banyak developer menawarkan DP ringan, free biaya KPR, atau bonus furniture.</p>',
    published: true,
    seoTitle: '5 Tips Membeli Rumah Pertama untuk Milenial - Panduan Lengkap',
    seoDesc: 'Panduan lengkap untuk milenial yang ingin membeli rumah pertama. Tips menabung DP, memilih lokasi, dan menghitung KPR.',
    seoKeywords: 'rumah pertama, milenial, tips beli rumah, KPR, DP rumah',
  },
  {
    id: 'article-2',
    title: 'Prediksi Harga Properti Bali 2025: Apakah Masih Menguntungkan?',
    slug: 'prediksi-harga-properti-bali-2025',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    author: 'Admin PropertiHub',
    category: 'Market Update',
    excerpt: 'Analisis tren harga properti di Bali tahun 2025. Apakah investasi properti di Bali masih menjanjikan?',
    content: '<p>Pasar properti Bali terus menunjukkan pertumbuhan positif. Berikut analisis lengkapnya:</p><h3>Tren Harga 2024-2025</h3><p>Harga rumah di Bali rata-rata naik 8-12% per tahun. Kawasan Canggu dan Seminyak masih menjadi primadona.</p><h3>Faktor Pendorong</h3><p>Pariwisata yang pulih, infrastruktur baru, dan minat investor asing menjadi pendorong utama.</p><h3>Rekomendasi</h3><p>Kawasan seperti Tabanan dan Gianyar menawarkan harga yang masih terjangkau dengan potensi kenaikan tinggi.</p>',
    published: true,
    seoTitle: 'Prediksi Harga Properti Bali 2025 - Analisis & Tren',
    seoDesc: 'Analisis tren harga properti di Bali 2025. Apakah investasi properti di Bali masih menguntungkan?',
    seoKeywords: 'properti bali, harga properti bali 2025, investasi bali, tren properti',
  },
  {
    id: 'article-3',
    title: 'Cara Menghitung Cicilan KPR yang Tepat',
    slug: 'cara-menghitung-cicilan-kpr-yang-tepat',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    author: 'Admin PropertiHub',
    category: 'Tips Keuangan',
    excerpt: 'Panduan lengkap menghitung cicilan KPR agar tidak memberatkan keuangan bulanan Anda.',
    content: '<p>Menghitung cicilan KPR dengan benar sangat penting agar keuangan tetap sehat.</p><h3>Rumus Dasar</h3><p>Cicilan = (P x r x (1+r)^n) / ((1+r)^n - 1), dimana P=pokok pinjaman, r=bunga per bulan, n=jumlah bulan.</p><h3>Aturan 30%</h3><p>Cicilan KPR maksimal 30% dari penghasilan bulanan. Jika gaji Rp10 juta, cicilan maksimal Rp3 juta.</p><h3>Tips Menghemat</h3><p>Pilih tenor pendek, bayar DP besar, dan negosiasi suku bunga dengan bank.</p>',
    published: true,
    seoTitle: 'Cara Menghitung Cicilan KPR yang Tepat - Panduan Lengkap',
    seoDesc: 'Panduan lengkap menghitung cicilan KPR. Rumus, aturan 30%, dan tips menghemat bunga KPR.',
    seoKeywords: 'cicilan KPR, menghitung KPR, rumus KPR, tips KPR, suku bunga KPR',
  },
  {
    id: 'article-4',
    title: 'Kawasan Terbaik untuk Investasi Properti di Bali',
    slug: 'kawasan-terbaik-investasi-properti-bali',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    author: 'Admin PropertiHub',
    category: 'Lokasi',
    excerpt: 'Review kawasan-kawasan terbaik di Bali untuk investasi properti dengan ROI tinggi.',
    content: '<p>Bali memiliki banyak kawasan potensial untuk investasi properti. Berikut yang terbaik:</p><h3>1. Canggu</h3><p>ROI rental 12-15%. Populer di kalangan expat dan digital nomad.</p><h3>2. Seminyak</h3><p>Premium location. Cocok untuk villa mewah dengan harga jual tinggi.</p><h3>3. Ubud</h3><p>Kawasan budaya dengan pertumbuhan 10% per tahun. Ideal untuk villa retreat.</p><h3>4. Sanur</h3><p>Kawasan yang lebih tenang dengan harga masih terjangkau. Potensi kenaikan 15-20%.</p><h3>5. Tabanan</h3><p>Harga paling terjangkau dengan potensi pertumbuhan tertinggi di Bali.</p>',
    published: true,
    seoTitle: 'Kawasan Terbaik Investasi Properti Bali - ROI Tinggi 2025',
    seoDesc: 'Review 5 kawasan terbaik di Bali untuk investasi properti dengan ROI tinggi. Canggu, Seminyak, Ubud, Sanur, Tabanan.',
    seoKeywords: 'investasi properti bali, kawasan bali, ROI properti bali, canggu, seminyak',
  },
  {
    id: 'article-5',
    title: 'Perbedaan SHM dan SHGB: Mana yang Lebih Baik?',
    slug: 'perbedaan-shm-dan-shgb',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    author: 'Admin PropertiHub',
    category: 'Umum',
    excerpt: 'Memahami perbedaan Sertifikat Hak Milik (SHM) dan Sertifikat Hak Guna Bangunan (SHGB) sebelum membeli properti.',
    content: '<p>Sebelum membeli properti, penting untuk memahami jenis sertifikat tanah.</p><h3>SHM (Sertifikat Hak Milik)</h3><p>Hak kepemilikan penuh dan permanen. Bisa dijadikan jaminan KPR dengan nilai tinggi. Harga properti SHM lebih tinggi 15-25%.</p><h3>SHGB (Sertifikat Hak Guna Bangunan)</h3><p>Berlaku 20-30 tahun, bisa diperpanjang. Biasanya untuk properti di atas tanah negara/perusahaan. Harga lebih terjangkau.</p><h3>Kesimpulan</h3><p>SHM lebih baik untuk investasi jangka panjang. SHGB bisa dipertimbangkan jika budget terbatas dan lokasi sangat strategis.</p>',
    published: true,
    seoTitle: 'Perbedaan SHM dan SHGB - Mana yang Lebih Baik untuk Investasi?',
    seoDesc: 'Panduan lengkap perbedaan SHM dan SHGB. Kelebihan, kekurangan, dan rekomendasi untuk investasi properti.',
    seoKeywords: 'SHM, SHGB, sertifikat tanah, hak milik, hak guna bangunan, investasi properti',
  },
]

const REVIEW_SEED = [
  {
    id: 'review-1',
    name: 'Budi Santoso',
    phone: '081234567890',
    rating: 5,
    review: 'Sangat puas dengan pelayanan PropertiHub. Agen sangat profesional dan membantu dari awal sampai akad kredit. Rumah yang saya beli sesuai ekspektasi.',
    propertyId: 'cb6818ff-d562-4b82-bd6a-49f91e81f7e7',
    image: '',
    featured: true,
  },
  {
    id: 'review-2',
    name: 'Sari Dewi',
    phone: '081298765432',
    rating: 5,
    review: 'Proses pembelian villa di Ubud sangat lancar. Tim PropertiHub sangat responsif dan informatif. Villa yang saya beli sekarang sudah beroperasi sebagai rental dengan ROI bagus!',
    propertyId: 'b6d0ec60-fe22-4b52-a176-d0f034d9f949',
    image: '',
    featured: true,
  },
  {
    id: 'review-3',
    name: 'Ahmad Rizki',
    phone: '085678901234',
    rating: 4,
    review: 'Bagus, pelayanannya ramah. Cuma sedikit lambat dalam proses dokumen. Tapi overall puas dengan properti yang didapatkan.',
    propertyId: 'dfa91b12-a926-4a45-a124-910f45e4afc5',
    image: '',
    featured: true,
  },
  {
    id: 'review-4',
    name: 'Linda Kusuma',
    phone: '087890123456',
    rating: 5,
    review: 'Investasi tanah di Sanur melalui PropertiHub sangat menguntungkan. Dalam 1 tahun harga sudah naik 20%. Terima kasih rekomendasinya!',
    propertyId: 'e50baccc-3795-4e7f-bbe3-06537b44e0c7',
    image: '',
    featured: true,
  },
  {
    id: 'review-5',
    name: 'Wayan Putra',
    phone: '089012345678',
    rating: 4,
    review: 'Sudah 2 kali beli properti lewat PropertiHub. Pelayanan konsisten bagus. Promo DP 0% sangat membantu!',
    propertyId: '6ab31323-fd6c-4320-9246-c57f439f93b2',
    image: '',
    featured: true,
  },
]

/**
 * Checks if Article and Review tables exist.
 */
function isTableNotFoundError(error: any): boolean {
  if (!error) return false
  const msg = (error.message || '').toLowerCase()
  const code = error.code || ''
  // PostgreSQL: 42P01, Supabase/PostgREST: PGRST205, or message contains "Could not find the table"
  return code === '42P01' || code === 'PGRST205' || msg.includes('could not find the table') || msg.includes('does not exist') || msg.includes('relation')
}

export async function GET() {
  try {
    let articlesNeeded = false
    let reviewsNeeded = false

    const articlesRes = await supabase.from('Article').select('id').limit(1)
    if (articlesRes.error && isTableNotFoundError(articlesRes.error)) {
      articlesNeeded = true
    }

    const reviewsRes = await supabase.from('Review').select('id').limit(1)
    if (reviewsRes.error && isTableNotFoundError(reviewsRes.error)) {
      reviewsNeeded = true
    }

    return Response.json({ articlesNeeded, reviewsNeeded })
  } catch {
    return Response.json({ articlesNeeded: true, reviewsNeeded: true })
  }
}

/**
 * Seeds articles and/or reviews into the database.
 * Body: { articles?: boolean, reviews?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const seedArticles = body.articles !== false
    const seedReviews = body.reviews !== false

    const results: { articles?: { success: boolean; count: number; error?: string }; reviews?: { success: boolean; count: number; error?: string } } = {}

    if (seedArticles) {
      const now = new Date().toISOString()
      const articles = ARTICLE_SEED.map(a => ({ ...a, createdAt: now, updatedAt: now }))
      const { error, count } = await supabase.from('Article').insert(articles)
      if (error) {
        results.articles = { success: false, count: 0, error: error.message }
      } else {
        results.articles = { success: true, count: count || articles.length }
      }
    }

    if (seedReviews) {
      const now = new Date().toISOString()
      const reviews = REVIEW_SEED.map(r => ({ ...r, createdAt: now, updatedAt: now }))
      const { error, count } = await supabase.from('Review').insert(reviews)
      if (error) {
        results.reviews = { success: false, count: 0, error: error.message }
      } else {
        results.reviews = { success: true, count: count || reviews.length }
      }
    }

    return Response.json(results)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal melakukan seed data'
    return Response.json({ error: message }, { status: 500 })
  }
}
