import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Data dummy untuk Property Types
const propertyTypes = [
  { name: 'Rumah', icon: 'Home', order: 1 },
  { name: 'Apartemen', icon: 'Building2', order: 2 },
  { name: 'Ruko', icon: 'Store', order: 3 },
  { name: 'Tanah', icon: 'MapPin', order: 4 },
]

// Data dummy untuk Locations
const locations = [
  {
    kabupaten: 'Bogor',
    kecamatan: JSON.stringify(['Ciawi', 'Cisarua', 'Megamendung', 'Citeureup', 'Cibinong', 'Gunung Putri', 'Bojonggede', 'Cileungsi', 'Jonggol']),
  },
  {
    kabupaten: 'Depok',
    kecamatan: JSON.stringify(['Beji', 'Cinere', 'Cipayung', 'Limo', 'Pancoran Mas', 'Sawangan', 'Sukmajaya', 'Cilodong', 'Tapos']),
  },
  {
    kabupaten: 'Bekasi',
    kecamatan: JSON.stringify(['Cikarang Utara', 'Cikarang Selatan', 'Cikarang Barat', 'Cikarang Timur', 'Cibitung', 'Tambun Utara', 'Tambun Selatan']),
  },
  {
    kabupaten: 'Tangerang',
    kecamatan: JSON.stringify(['Ciledug', 'Pondok Aren', 'Serpong', 'BSD City', 'Gading Serpong', 'Bintaro', 'Ciputat']),
  },
]

// Data dummy untuk Agents
const agents = [
  {
    name: 'Budi Santoso',
    role: 'Senior Marketing',
    phone: '081234567890',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Siti Rahayu',
    role: 'Marketing Executive',
    phone: '082345678901',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Andi Wijaya',
    role: 'Property Consultant',
    phone: '083456789012',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Dewi Lestari',
    role: 'Senior Agent',
    phone: '084567890123',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
]

// Data dummy untuk Properties
const properties = [
  {
    title: 'Rumah Minimalis Modern di Ciawi Bogor',
    price: 650000000,
    dp: 65000000,
    allInCost: 72000000,
    kabupaten: 'Bogor',
    kecamatan: 'Ciawi',
    type: 'Rumah',
    buildingType: 'Type 36/72',
    description: 'Rumah minimalis modern dengan desain kontemporer. Lokasi strategis dekat akses tol dan pusat perbelanjaan. Dilengkapi dengan 2 kamar tidur, 1 kamar mandi, carport, dan taman.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'rumah-minimalis-modern-ciawi-bogor',
    seoTitle: 'Rumah Minimalis Modern di Ciawi Bogor - PropertiHub',
    seoDesc: 'Rumah minimalis modern siap huni di Ciawi Bogor dengan harga terjangkau. Lokasi strategis dan fasilitas lengkap.',
    seoKeywords: 'rumah ciawi, rumah bogor, rumah minimalis, rumah murah bogor',
    seoAuto: true,
  },
  {
    title: 'Apartemen Mewah di Depok',
    price: 850000000,
    dp: 85000000,
    allInCost: 95000000,
    kabupaten: 'Depok',
    kecamatan: 'Beji',
    type: 'Apartemen',
    buildingType: 'Type 2BR',
    description: 'Apartemen mewah dengan fasilitas lengkap: kolam renang, gym, area bermain anak, dan keamanan 24 jam. Dekat dengan stasiun KRL dan pusat perbelanjaan.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'apartemen-mewah-depok',
    seoTitle: 'Apartemen Mewah di Depok - PropertiHub',
    seoDesc: 'Apartemen mewah di Depok dengan fasilitas lengkap dan lokasi strategis. Investasi properti terbaik.',
    seoKeywords: 'apartemen depok, apartemen murah, kontrakan apartemen, sewa apartemen',
    seoAuto: true,
  },
  {
    title: 'Ruko 3 Lantai di Cikarang',
    price: 1200000000,
    dp: 120000000,
    allInCost: 135000000,
    kabupaten: 'Bekasi',
    kecamatan: 'Cikarang Utara',
    type: 'Ruko',
    buildingType: '3 Lantai',
    description: 'Ruko 3 lantai cocok untuk usaha atau kantor. Lokasi di area industri Cikarang dengan akses mudah dari tol. Parkir luas dan tata ruang fleksibel.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1596395819057-d983a4e4e83f?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'ruko-3-lantai-cikarang',
    seoTitle: 'Ruko 3 Lantai di Cikarang - PropertiHub',
    seoDesc: 'Ruko 3 lantai strategis di Cikarang untuk usaha dan kantor. Lokasi premium di kawasan industri.',
    seoKeywords: 'ruko cikarang, jual ruko, sewa ruko, ruko murah',
    seoAuto: true,
  },
  {
    title: 'Tanah Kavling Siap Bangun di Cisarua',
    price: 350000000,
    dp: 35000000,
    allInCost: 40000000,
    kabupaten: 'Bogor',
    kecamatan: 'Cisarua',
    type: 'Tanah',
    buildingType: 'Kavling 100m²',
    description: 'Tanah kavling siap bangun dengan pemandangan pegunungan yang indah. Lingkungan asri dan sejuk. Cocok untuk villa atau rumah tinggal.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'tanah-kavling-cisarua',
    seoTitle: 'Tanah Kavling Siap Bangun di Cisarua - PropertiHub',
    seoDesc: 'Tanah kavling siap bangun di Cisarua dengan pemandangan pegunungan. Investasi properti menguntungkan.',
    seoKeywords: 'tanah cisarua, kavling siap bangun, jual tanah, tanah murah bogor',
    seoAuto: true,
  },
  {
    title: 'Rumah Cluster di Cibinong',
    price: 750000000,
    dp: 75000000,
    allInCost: 82000000,
    kabupaten: 'Bogor',
    kecamatan: 'Cibinong',
    type: 'Rumah',
    buildingType: 'Type 45/90',
    description: 'Rumah cluster dengan sistem keamanan one gate system. 3 kamar tidur, 2 kamar mandi, carport, dan taman. Dekat stasiun KRL dan akses tol.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'rumah-cluster-cibinong',
    seoTitle: 'Rumah Cluster di Cibinong - PropertiHub',
    seoDesc: 'Rumah cluster modern di Cibinong dengan keamanan one gate system. Lokasi strategis dekat transportasi.',
    seoKeywords: 'rumah cibinong, cluster cibinong, rumah murah bogor, perumahan cibinong',
    seoAuto: true,
  },
  {
    title: 'Apartemen Studio di BSD City',
    price: 580000000,
    dp: 58000000,
    allInCost: 65000000,
    kabupaten: 'Tangerang',
    kecamatan: 'Serpong',
    type: 'Apartemen',
    buildingType: 'Type Studio',
    description: 'Apartemen studio compact di BSD City. Cocok untuk profesional atau mahasiswa. Fasilitas lengkap dan akses mudah ke pusat kota.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'apartemen-studio-bsd',
    seoTitle: 'Apartemen Studio di BSD City - PropertiHub',
    seoDesc: 'Apartemen studio murah di BSD City dengan fasilitas lengkap. Investasi properti menguntungkan.',
    seoKeywords: 'apartemen studio, apartemen bsd, studio murah, sewa studio',
    seoAuto: true,
  },
  {
    title: 'Rumah 2 Lantai di Bojonggede',
    price: 890000000,
    dp: 89000000,
    allInCost: 98000000,
    kabupaten: 'Bogor',
    kecamatan: 'Bojonggede',
    type: 'Rumah',
    buildingType: 'Type 70/90',
    description: 'Rumah 2 lantai modern dengan 4 kamar tidur dan 3 kamar mandi. Carport 2 mobil dan taman belakang. Lokasi dekat stasiun KRL.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'rumah-2-lantai-bojonggede',
    seoTitle: 'Rumah 2 Lantai di Bojonggede - PropertiHub',
    seoDesc: 'Rumah 2 lantai luas di Bojonggede dengan 4 kamar tidur. Investasi properti menguntungkan.',
    seoKeywords: 'rumah 2 lantai, rumah bojonggede, rumah luas, rumah murah',
    seoAuto: true,
  },
  {
    title: 'Tanah Kavling Premium di Citeureup',
    price: 420000000,
    dp: 42000000,
    allInCost: 48000000,
    kabupaten: 'Bogor',
    kecamatan: 'Citeureup',
    type: 'Tanah',
    buildingType: 'Kavling 120m²',
    description: 'Tanah kavling premium di area berkembang Citeureup. Akses mudah ke tol dan pusat industri. Potensi kenaikan nilai tinggi.',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ]),
    brochure: '',
    permalink: 'tanah-kavling-citeureup',
    seoTitle: 'Tanah Kavling Premium di Citeureup - PropertiHub',
    seoDesc: 'Tanah kavling premium di Citeureup dengan potensi kenaikan nilai tinggi. Investasi properti terbaik.',
    seoKeywords: 'tanah citeureup, kavling premium, investasi tanah, tanah murah',
    seoAuto: true,
  },
]

// Data dummy untuk Promos
const promos = [
  {
    badge: 'HOT',
    title: 'DP 0%',
    subtitle: 'Tanpa DP untuk unit tertentu',
  },
  {
    badge: 'PROMO',
    title: 'Diskon 50 Juta',
    subtitle: 'Khusus pembelian bulan ini',
  },
  {
    badge: 'BEST',
    title: 'Free All-in 50 Juta',
    subtitle: 'Gratis biaya KPR dan Notaris',
  },
]

// Data dummy untuk Articles
const articles = [
  {
    title: 'Tips Membeli Rumah Pertama untuk Milenial',
    excerpt: 'Panduan lengkap untuk milenial yang ingin membeli rumah pertama dengan budget terbatas namun tetap mendapatkan hunian impian.',
    content: 'Membeli rumah pertama adalah impian setiap milenial. Namun, dengan harga properti yang terus naik, banyak yang merasa tidak mungkin mewujudkannya. Artikel ini akan memberikan tips praktis untuk membeli rumah pertama dengan budget terbatas...\n\n1. Tentukan budget secara realistis\n2. Cari lokasi yang sedang berkembang\n3. Pertimbangkan rumah secondary\n4. Manfaatkan program subsidi pemerintah\n5. Hitung biaya tambahan',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    category: 'Tips Properti',
    published: true,
    permalink: 'tips-membeli-rumah-pertama-milenial',
  },
  {
    title: 'Kenapa Investasi Apartemen Lebih Menguntungkan?',
    excerpt: 'Pelajari keuntungan investasi apartemen dibandingkan dengan jenis properti lainnya untuk passive income jangka panjang.',
    content: 'Investasi apartemen menjadi pilihan banyak investor karena potensi keuntungan yang tinggi. Berikut alasan kenapa apartemen lebih menguntungkan:\n\n1. Biaya perawatan lebih rendah\n2. Potensi sewa yang tinggi\n3. Lokasi strategis di area perkotaan\n4. Fasilitas yang lengkap\n5. Mudah disewakan\n\nInvestasi apartemen membutuhkan analisis yang matang terutama mengenai lokasi dan pengembang properti.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    category: 'Investasi',
    published: true,
    permalink: 'kenapa-investasi-apartemen-lebih-menguntungkan',
  },
  {
    title: 'Panduan Lengkap KPR Rumah 2024',
    excerpt: 'Semua yang perlu Anda ketahui tentang KPR rumah tahun 2024, mulai dari syarat, prosedur, hingga tips agar disetujui bank.',
    content: 'KPR (Kredit Pemilikan Rumah) adalah solusi bagi yang ingin memiliki rumah namun tidak memiliki cukup dana tunai. Berikut panduan lengkap KPR rumah 2024:\n\nSyarat KPR:\n1. WNI berusia minimal 21 tahun\n2. Penghasilan tetap minimal 3 juta/bulan\n3. Memiliki NPWP\n4. Riwayat kredit baik\n5. Uang muka minimal 10-20%\n\nProsedur Pengajuan:\n1. Pilih properti\n2. Ajukan KPR ke bank\n3. Submit dokumen\n4. Proses verifikasi\n5. Persetujuan dan akad kredit\n\nTips Agar Disetujui:\n- Pertahankan skor kredit baik\n- Pilih tenor yang sesuai kemampuan\n- Siapkan dokumen lengkap',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    category: 'Finansial',
    published: true,
    permalink: 'panduan-kpr-rumah-2024',
  },
]

// Data dummy untuk Reviews
const reviews = [
  {
    name: 'Ahmad Fauzi',
    review: 'Sangat puas dengan pelayanan PropertiHub. Tim marketing sangat membantu dari awal hingga proses KPR selesai. Rumah yang saya beli sesuai ekspektasi.',
    rating: 5,
    featured: true,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Maya Putri',
    review: 'Proses pembelian apartemen sangat mudah dan transparan. Legalitas jelas dan pelayanan after sales juga baik. Recommended!',
    rating: 5,
    featured: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Rudi Hartono',
    review: 'Membeli tanah kavling di sini adalah keputusan terbaik. Lokasi strategis dan nilainya terus naik. Terima kasih PropertiHub!',
    rating: 4,
    featured: false,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Linda Susanti',
    review: 'Sangat profesional dan responsif. Pertanyaan-pertanyaan saya selalu dijawab dengan cepat dan jelas. Rumah impian saya akhirnya terwujud.',
    rating: 5,
    featured: true,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
]

// Data dummy untuk Agency
const agency = {
  name: 'PropertiHub',
  phone: '(021) 1234-5678',
  address: 'Jl. Raya Bogor No. 123, Bogor, Jawa Barat',
  kprInterest: 5.5,
}

// Data dummy untuk SEO
const seo = {
  frontendUrl: '',
  title: 'PropertiHub - Temukan Hunian Impian Anda',
  description: 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia. Temukan properti impian dengan mudah dan terpercaya.',
  keywords: 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub, tanah, kavling, investasi properti, KPR',
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
}

// Data dummy untuk Visitors (Lead)
const visitors = [
  {
    date: new Date().toISOString().split('T')[0],
    name: 'Budi',
    phone: '081234567890',
    type: 'Rumah',
    building: 'Type 36',
    location: 'Bogor - Ciawi',
    dp: '65 Juta',
    promo: 'DP 0%',
    status: 'Baru',
  },
  {
    date: new Date().toISOString().split('T')[0],
    name: 'Ani',
    phone: '082345678901',
    type: 'Apartemen',
    building: 'Type Studio',
    location: 'Depok - Beji',
    dp: '58 Juta',
    promo: 'Diskon 50 Juta',
    status: 'Follow Up',
  },
]

export async function POST() {
  try {
    console.log('Starting database seeding...')

    // Clear existing data
    await db.propertyPromo.deleteMany()
    await db.property.deleteMany()
    await db.promo.deleteMany()
    await db.agent.deleteMany()
    await db.visitor.deleteMany()
    await db.propertyType.deleteMany()
    await db.location.deleteMany()
    await db.article.deleteMany()
    await db.review.deleteMany()
    await db.agency.deleteMany()
    await db.sEO.deleteMany()
    await db.adminUser.deleteMany()

    console.log('Existing data cleared')

    // Create Property Types
    const createdPropertyTypes = await Promise.all(
      propertyTypes.map(pt => db.propertyType.create({ data: pt }))
    )
    console.log(`Created ${createdPropertyTypes.length} property types`)

    // Create Locations
    const createdLocations = await Promise.all(
      locations.map(loc => db.location.create({ data: loc }))
    )
    console.log(`Created ${createdLocations.length} locations`)

    // Create Agents
    const createdAgents = await Promise.all(
      agents.map(agent => db.agent.create({ data: agent }))
    )
    console.log(`Created ${createdAgents.length} agents`)

    // Create Properties
    const createdProperties = await Promise.all(
      properties.map(prop => db.property.create({ data: prop }))
    )
    console.log(`Created ${createdProperties.length} properties`)

    // Create Promos
    const createdPromos = await Promise.all(
      promos.map(promo => db.promo.create({ data: promo }))
    )
    console.log(`Created ${createdPromos.length} promos`)

    // Create Property-Promo relationships (assign random promos to properties)
    const promoRelations: { propertyId: string; promoId: string }[] = []
    for (let i = 0; i < Math.min(createdProperties.length, createdPromos.length); i++) {
      promoRelations.push({
        propertyId: createdProperties[i].id,
        promoId: createdPromos[i % createdPromos.length].id,
      })
    }
    await Promise.all(
      promoRelations.map(rel => db.propertyPromo.create({ data: rel }))
    )
    console.log(`Created ${promoRelations.length} property-promo relationships`)

    // Create Articles
    const createdArticles = await Promise.all(
      articles.map(article => db.article.create({ data: article }))
    )
    console.log(`Created ${createdArticles.length} articles`)

    // Create Reviews
    const createdReviews = await Promise.all(
      reviews.map(review => db.review.create({ data: review }))
    )
    console.log(`Created ${createdReviews.length} reviews`)

    // Create Agency
    await db.agency.create({ data: agency })
    console.log('Created agency settings')

    // Create SEO
    await db.sEO.create({ data: seo })
    console.log('Created SEO settings')

    // Create Admin User
    await db.adminUser.create({
      data: {
        name: 'Admin Utama',
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
      },
    })
    console.log('Created admin user (username: admin, password: admin123)')

    // Create Visitors
    await Promise.all(
      visitors.map(visitor => db.visitor.create({ data: visitor }))
    )
    console.log(`Created ${visitors.length} visitors`)

    console.log('Database seeding completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      stats: {
        propertyTypes: createdPropertyTypes.length,
        locations: createdLocations.length,
        agents: createdAgents.length,
        properties: createdProperties.length,
        promos: createdPromos.length,
        articles: createdArticles.length,
        reviews: createdReviews.length,
        visitors: visitors.length,
      },
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}