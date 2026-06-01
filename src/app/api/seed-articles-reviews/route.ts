import { supabase } from '@/lib/supabase'
import { invalidateCache } from '@/lib/cache'

export async function POST() {
  try {
    const articles = [
      {
        title: 'Tips Memilih Rumah Pertama untuk Milenial',
        slug: 'tips-memilih-rumah-pertama-untuk-milenial',
        content: '<h2>Pendahuluan</h2><p>Membeli rumah pertama adalah langkah besar dalam kehidupan setiap milenial. Dengan harga properti yang terus meningkat, penting untuk memiliki strategi yang tepat agar investasi ini tidak menjadi beban finansial.</p><h2>1. Tentukan Anggaran secara Realistis</h2><p>Aturan umumnya, cicilan rumah sebaiknya tidak melebihi 30% dari penghasilan bulanan Anda. Hitung juga biaya lain seperti DP, notaris, dan biaya renovasi awal.</p><h2>2. Pilih Lokasi Strategis</h2><p>Lokasi adalah faktor paling penting dalam investasi properti. Pilih area yang dekat dengan akses transportasi publik, fasilitas kesehatan, pendidikan, dan pusat perbelanjaan.</p><h2>3. Periksa Legalitas</h2><p>Pastikan sertifikat tanah sudah SHM (Sertifikat Hak Milik), bukan SHGB atau girik. Cek juga IMB/PBG dan status tanah di BPN.</p><h2>4. Manfaatkan KPR</h2><p>Kredit Pemilikan Rumah (KPR) adalah solusi terbaik untuk milenial. Bandingkan suku bunga dari beberapa bank dan pilih yang paling menguntungkan.</p><h2>Kesimpulan</h2><p>Dengan perencanaan yang matang, membeli rumah pertama bukan lagi mimpi. Mulailah menabung sekarang dan riset pasar properti secara berkala.</p>',
        excerpt: 'Panduan lengkap bagi milenial yang ingin membeli rumah pertama. Dari menentukan anggaran hingga tips memilih lokasi strategis.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
        author: 'Admin PropertiHub', category: 'Tips Properti', published: true,
        publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        seoTitle: 'Tips Memilih Rumah Pertama untuk Milenial - PropertiHub',
        seoDesc: 'Panduan lengkap cara memilih rumah pertama untuk generasi milenial.',
        seoKeywords: 'rumah pertama, milenial, tips properti, KPR, investasi rumah',
      },
      {
        title: 'Tren Properti 2025: Apa yang Perlu Anda Ketahui',
        slug: 'tren-properti-2025-apa-yang-perlu-anda-ketahui',
        content: '<h2>Tren Properti yang Menggebrak di 2025</h2><p>Tahun 2025 membawa beberapa perubahan signifikan di industri properti Indonesia.</p><h2>1. Rumah Compact Makin Diminati</h2><p>Ukuran rumah yang lebih kecil namun efisien menjadi tren utama. Rumah tipe 36/72 dengan desain modern minimalis laris manis di pasar.</p><h2>2. Hunian Vertikal Terus Berkembang</h2><p>Apartemen dan kondominium di kawasan penyangga Jakarta seperti Tangerang, Bekasi, dan Depok terus mengalami pertumbuhan permintaan.</p><h2>3. Green Living</h2><p>Konsep ramah lingkungan seperti solar panel, taman vertikal, dan sistem daur ulang air menjadi value added yang dicari pembeli.</p><h2>4. Smart Home</h2><p>Integrasi teknologi IoT dalam rumah bukan lagi kemewahan, melainkan kebutuhan.</p><h2>Kesimpulan</h2><p>Tahun 2025 adalah waktu yang tepat untuk berinvestasi properti dengan memperhatikan tren-tren di atas.</p>',
        excerpt: 'Ringkasan tren properti terbaru di Indonesia tahun 2025 yang wajib diketahui calon pembeli.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
        author: 'Admin PropertiHub', category: 'Market Update', published: true,
        publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        seoTitle: 'Tren Properti 2025 - PropertiHub',
        seoDesc: 'Tren properti Indonesia 2025: rumah compact, hunian vertikal, green living.',
        seoKeywords: 'tren properti 2025, properti indonesia, rumah compact',
      },
      {
        title: 'Cara Menghitung KPR: Panduan Lengkap',
        slug: 'cara-menghitung-kpr-panduan-lengkap',
        content: '<h2>Apa itu KPR?</h2><p>Kredit Pemilikan Rumah (KPR) adalah fasilitas pinjaman dari bank untuk membeli rumah. Anda membayar uang muka (DP) kemudian mencicil sisa pembayaran dalam jangka waktu tertentu.</p><h2>Komponen Perhitungan KPR</h2><p><strong>1. Uang Muka (DP)</strong><br/>Minimal 10-20% dari harga rumah. Semakin besar DP, semakin kecil cicilan bulanan.</p><p><strong>2. Suku Bunga</strong><br/>Ada dua jenis: fixed rate (tetap untuk 1-5 tahun) dan floating rate (berubah mengikuti suku bunga acuan).</p><p><strong>3. Tenor</strong><br/>Jangka waktu cicilan, biasanya 10-25 tahun.</p><h2>Contoh Perhitungan</h2><p>Harga rumah: Rp 500.000.000<br/>DP 20%: Rp 100.000.000<br/>Pinjaman: Rp 400.000.000<br/>Suku bunga: 8% per tahun<br/>Tenor: 20 tahun (240 bulan)<br/>Cicilan per bulan: ±Rp 3.350.000</p><h2>Tips Mengajukan KPR</h2><ul><li>Pastikan rekam jejak kredit bersih di SLIK OJK</li><li>Siapkan dokumen lengkap: KTP, NPWP, slip gaji 3 bulan terakhir</li><li>Bandigkan minimal 3 bank untuk mendapat bunga terbaik</li></ul>',
        excerpt: 'Panduan lengkap cara menghitung cicilan KPR beserta contoh perhitungan dan tips pengajuan.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
        author: 'Admin PropertiHub', category: 'Tips Keuangan', published: true,
        publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        seoTitle: 'Cara Menghitung KPR Panduan Lengkap - PropertiHub',
        seoDesc: 'Panduan lengkap menghitung cicilan KPR dengan contoh perhitungan.',
        seoKeywords: 'KPR, cara menghitung KPR, cicilan rumah, tips KPR',
      },
      {
        title: 'Keunggulan Tinggal di Tangerang Selatan',
        slug: 'keunggulan-tinggal-di-tangerang-selatan',
        content: '<h2>Mengapa Tangerang Selatan?</h2><p>Tangerang Selatan (Tangsel) telah menjadi salah satu kota penyangga Jakarta yang paling diminati. Berikut alasan mengapa Tangsel menjadi pilihan utama keluarga muda.</p><h2>1. Akses Transportasi</h2><p>Dekat dengan tol JORR, BSD Link, dan rencana MRT fase 2. Akses ke Jakarta pusat hanya 30-45 menit. Juga dilalui Transjakarta koridor 13.</p><h2>2. Pendidikan Berkualitas</h2><p>Berbagai universitas ternama seperti Universitas Pamulang, BINUS, dan sekolah internasional tersedia di kawasan ini.</p><h2>3. Fasilitas Komersial</h2><p>BSD City, AEON Mall, The Breeze, dan berbagai lifestyle center membuat kehidupan sehari-hari lebih nyaman.</p><h2>4. Lingkungan Asri</h2><p>Banyak kawasan hunian dengan konsep green living dan taman kota yang terawat.</p><h2>5. Harga Masih Terjangkau</h2><p>Dibandingkan Jakarta Selatan, harga properti di Tangsel masih 30-40% lebih murah dengan fasilitas sebanding.</p>',
        excerpt: 'Temukan 5 keunggulan tinggal di Tangerang Selatan untuk keluarga muda.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop',
        author: 'Admin PropertiHub', category: 'Lokasi', published: true,
        publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        seoTitle: 'Keunggulan Tinggal di Tangerang Selatan - PropertiHub',
        seoDesc: '5 alasan mengapa Tangerang Selatan menjadi kota pilihan keluarga muda.',
        seoKeywords: 'tangerang selatan, tinggal di tangsel, properti tangsel',
      },
      {
        title: '5 Kesalahan Umum Saat Beli Rumah Secondary',
        slug: '5-kesalahan-umum-saat-beli-rumah-secondary',
        content: '<h2>Mengapa Rumah Secondary Menarik?</h2><p>Rumah secondary atau bekas sering kali menawarkan harga lebih terjangkau dibanding rumah baru. Namun, ada risiko yang perlu diwaspadai.</p><h2>1. Tidak Mengecek Sertifikat Secara Detail</h2><p>Banyak pembeli terburu-buru tanpa memverifikasi keaslian sertifikat di BPN. Pastikan nama di sertifikat sesuai dengan penjual dan tidak ada sengketa.</p><h2>2. Mengabaikan Kondisi Struktur</h2><p>Periksa retak dinding, kebocoran atap, dan kondisi fondasi. Gunakan jasa inspektor properti jika perlu.</p><h2>3. Tidak Survei Lingkungan</h2><p>Datanglah ke lokasi pada waktu yang berbeda (pagi, siang, malam) untuk mengetahui kondisi lingkungan sebenarnya.</p><h2>4. Terjebak Harga Murah Tanpa Perhitungan Renovasi</h2><p>Rumah murah bisa jadi butuh renovasi besar. Hitung total biaya (harga beli + renovasi) sebelum memutuskan.</p><h2>5. Tidak Melakukan Negosiasi</h2><p>Harga rumah secondary selalu bisa dinegosiasi. Riset harga pasar di sekitar lokasi sebagai dasar tawar-menawar.</p>',
        excerpt: 'Hindari 5 kesalahan fatal saat membeli rumah bekas agar tidak menyesal di kemudian hari.',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop',
        author: 'Admin PropertiHub', category: 'Tips Properti', published: false,
        publishedAt: null, seoTitle: '', seoDesc: '', seoKeywords: '',
      },
    ]

    const reviews = [
      { name: 'Budi Santoso', phone: '081234567890', rating: 5, review: 'Pelayanan sangat memuaskan! Agen PropertiHub sangat membantu dari awal sampai proses akad kredit. Rumah yang kami beli sesuai dengan ekspektasi. Sangat direkomendasikan!', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', featured: true },
      { name: 'Siti Rahayu', phone: '082345678901', rating: 5, review: 'Sudah 2 tahun tinggal di rumah yang kami beli melalui PropertiHub. Kualitas bangunan bagus, lokasi strategis dekat dengan sekolah anak-anak. Terima kasih PropertiHub!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', featured: true },
      { name: 'Ahmad Fauzi', phone: '083456789012', rating: 4, review: 'Proses pencarian properti sangat mudah melalui website PropertiHub. Filter pencarian lengkap, informasi properti detail. Tinggal pilih dan hubungi agen.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', featured: true },
      { name: 'Dewi Lestari', phone: '084567890123', rating: 5, review: 'Awalnya ragu beli properti online, tapi setelah dikonsultasikan dengan tim PropertiHub, kami jadi yakin. Rumahnya indah banget, sesuai foto!', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', featured: false },
      { name: 'Rizky Pratama', phone: '085678901234', rating: 4, review: 'Harga properti di PropertiHub kompetitif dibanding marketplace lain. Ada banyak pilihan promo dan diskon. Proses KPR-nya juga dibantu sampai tuntas.', image: '', featured: false },
    ]

    const [aRes, rRes] = await Promise.all([
      supabase.from('Article').insert(articles).select(),
      supabase.from('Review').insert(reviews).select(),
    ])

    invalidateCache()

    const results: Record<string, unknown> = {}
    if (aRes.error) {
      results.articlesError = aRes.error.message
    } else {
      results.articlesInserted = aRes.data?.length || 0
    }
    if (rRes.error) {
      results.reviewsError = rRes.error.message
    } else {
      results.reviewsInserted = rRes.data?.length || 0
    }

    return Response.json(results)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyisipkan data sample'
    return Response.json({ error: message }, { status: 500 })
  }
}
