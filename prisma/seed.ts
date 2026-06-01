import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with dummy data...')

  // 1. Agency
  await prisma.agency.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'PropertiHub',
      phone: '+62 812 3456 7890',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      kprInterest: 5.5,
    },
  })
  console.log('✅ Agency seeded')

  // 2. SEO
  await prisma.sEO.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      frontendUrl: 'https://propertihub.com',
      title: 'PropertiHub - Temukan Hunian Impian Anda',
      description: 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
      keywords: 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
  })
  console.log('✅ SEO seeded')

  // 3. Property Types
  const propertyTypes = [
    { name: 'Rumah', icon: 'home', order: 1 },
    { name: 'Apartemen', icon: 'building-2', order: 2 },
    { name: 'Tanah', icon: 'trees', order: 3 },
    { name: 'Ruko', icon: 'building', order: 4 },
  ]

  for (const pt of propertyTypes) {
    await prisma.propertyType.upsert({
      where: { id: `type-${pt.name}` },
      update: {},
      create: { id: `type-${pt.name}`, ...pt },
    })
  }
  console.log('✅ Property types seeded')

  // 4. Locations
  const locations = [
    {
      kabupaten: 'Bandung',
      kecamatan: JSON.stringify([
        'Andir', 'Antapani', 'Arcamanik', 'Astanaanyar',
        'Babakanciparay', 'Bandung Kidul', 'Bandung Kulon',
        'Bandung Wetan', 'Batununggal', 'Bojongloa Kidul',
        'Bojongloa Kaler', 'Buahbatu', 'Cibiru', 'Cicendo',
        'Cidadap', 'Cinambo', 'Coblong', 'Coblong'
      ]),
    },
    {
      kabupaten: 'Bogor',
      kecamatan: JSON.stringify([
        'Bogor Barat', 'Bogor Selatan', 'Bogor Tengah',
        'Bogor Timur', 'Bogor Utara', 'Tanah Sareal'
      ]),
    },
    {
      kabupaten: 'Bekasi',
      kecamatan: JSON.stringify([
        'Bekasi Barat', 'Bekasi Selatan', 'Bekasi Timur',
        'Bekasi Utara', 'Medan Satria', 'Pondok Gede',
        'Jatiasih', 'Cikarang Utara', 'Cikarang Selatan'
      ]),
    },
  ]

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: `loc-${loc.kabupaten}` },
      update: {},
      create: { id: `loc-${loc.kabupaten}`, ...loc },
    })
  }
  console.log('✅ Locations seeded')

  // 5. Promos
  const promos = [
    { badge: 'PROMO', title: 'Gratis Biaya KPR', subtitle: 'Hingga 10 Juta Rupiah' },
    { badge: 'HOT', title: 'Diskon DP 20%', subtitle: 'Khusus Bulan Ini' },
    { badge: 'BEST', title: 'Cashback 15 Juta', subtitle: 'Langsung Tanpa Undi' },
  ]

  for (const promo of promos) {
    await prisma.promo.upsert({
      where: { id: `promo-${promo.title.replace(/\s/g, '-')}` },
      update: {},
      create: { id: `promo-${promo.title.replace(/\s/g, '-')}`, ...promo },
    })
  }
  console.log('✅ Promos seeded')

  // 6. Agents
  const agents = [
    {
      name: 'Budi Santoso',
      role: 'Senior Marketing',
      phone: '+62 812 1111 2222',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Siti Rahayu',
      role: 'Marketing Property',
      phone: '+62 812 3333 4444',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  ]

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { id: `agent-${agent.name.replace(/\s/g, '-')}` },
      update: {},
      create: { id: `agent-${agent.name.replace(/\s/g, '-')}`, ...agent },
    })
  }
  console.log('✅ Agents seeded')

  // 7. Properties
  const properties = [
    {
      title: 'Rumah Mewah di Dago Atas',
      price: 2500000000,
      dp: 500000000,
      allInCost: 2600000000,
      kabupaten: 'Bandung',
      kecamatan: 'Coblong',
      type: 'Rumah',
      buildingType: '120/150',
      description: 'Rumah mewah dengan view kota Bandung yang indah. Lokasi strategis dekat pusat perbelanjaan dan tempat wisata. Fasilitas lengkap dengan kolam renang pribadi, taman yang luas, dan garasi 2 mobil.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      ]),
      brochure: '',
      permalink: 'rumah-mewah-dago-atas',
      seoTitle: 'Rumah Mewah di Dago Atas - 2.5 Milyar',
      seoDesc: 'Rumah mewah dengan view kota di Dago Atas, 3 kamar tidur, 3 kamar mandi, luas tanah 150m²',
      seoKeywords: 'rumah mewah, dago atas, bandung, rumah view kota',
      seoAuto: true,
    },
    {
      title: 'Apartemen Modern di Cibiru',
      price: 750000000,
      dp: 150000000,
      allInCost: 780000000,
      kabupaten: 'Bandung',
      kecamatan: 'Cibiru',
      type: 'Apartemen',
      buildingType: '2BR',
      description: 'Apartemen modern dengan desain minimalis dan fasilitas lengkap. Dekat dengan akses tol dan pintu tol Cibiru. Cocok untuk investasi atau hunian.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      ]),
      brochure: '',
      permalink: 'apartemen-cibiru',
      seoTitle: 'Apartemen Modern Cibiru - 750 Juta',
      seoDesc: 'Apartemen 2 bedroom di Cibiru, dekat akses tol, fasilitas lengkap',
      seoKeywords: 'apartemen, cibiru, bandung, investasi apartemen',
      seoAuto: true,
    },
    {
      title: 'Ruko Strategis di Bekasi',
      price: 1200000000,
      dp: 240000000,
      allInCost: 0,
      kabupaten: 'Bekasi',
      kecamatan: 'Cikarang Utara',
      type: 'Ruko',
      buildingType: '3 Lantai',
      description: 'Ruko 3 lantai di kawasan industri Cikarang. Lokasi sangat strategis dekat kawasan industri dan perumahan. Cocok untuk usaha atau kantor.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      ]),
      brochure: '',
      permalink: 'ruko-cikarang',
      seoTitle: 'Ruko 3 Lantai Cikarang - 1.2 Milyar',
      seoDesc: 'Ruko 3 lantai di kawasan industri Cikarang, cocok untuk usaha',
      seoKeywords: 'ruko, cikarang, bekasi, ruko usaha',
      seoAuto: true,
    },
    {
      title: 'Tanah Kavling di Bogor',
      price: 450000000,
      dp: 90000000,
      allInCost: 0,
      kabupaten: 'Bogor',
      kecamatan: 'Bogor Selatan',
      type: 'Tanah',
      buildingType: '',
      description: 'Tanah kavling siap bangun di kawasan sejuk Bogor. Lingkungan asri, dekat wisata air terjun. Cocok untuk rumah hunian atau villa.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      ]),
      brochure: '',
      permalink: 'tanah-bogor',
      seoTitle: 'Tanah Kavling Bogor - 450 Juta',
      seoDesc: 'Tanah kavling di Bogor Selatan, lingkungan asri, siap bangun',
      seoKeywords: 'tanah kavling, bogor, investasi tanah',
      seoAuto: true,
    },
    {
      title: 'Cluster Rumah Minimalis',
      price: 850000000,
      dp: 170000000,
      allInCost: 880000000,
      kabupaten: 'Bekasi',
      kecamatan: 'Jatiasih',
      type: 'Rumah',
      buildingType: '45/72',
      description: 'Rumah minimalis di cluster dengan keamanan 24 jam. Lingkungan nyaman, dekat sekolah dan pasar. Gratis biaya KPR khusus pembelian bulan ini.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
      ]),
      brochure: '',
      permalink: 'cluster-jatiasih',
      seoTitle: 'Cluster Rumah Jatiasih - 850 Juta',
      seoDesc: 'Rumah minimalis tipe 45/72 di cluster Jatiasih, keamanan 24 jam',
      seoKeywords: 'rumah minimalis, jatiasih, bekasi, cluster rumah',
      seoAuto: true,
    },
  ]

  const createdProperties = []
  for (const prop of properties) {
    const p = await prisma.property.upsert({
      where: { permalink: prop.permalink },
      update: {},
      create: { id: `prop-${prop.permalink}`, ...prop },
    })
    createdProperties.push(p)
  }
  console.log('✅ Properties seeded')

  // 8. Property-Promo Relations
  const promosInDb = await prisma.promo.findMany()
  await prisma.propertyPromo.create({
    data: {
      propertyId: createdProperties[0].id,
      promoId: promosInDb[0].id,
    },
  })
  await prisma.propertyPromo.create({
    data: {
      propertyId: createdProperties[4].id,
      promoId: promosInDb[0].id,
    },
  })
  await prisma.propertyPromo.create({
    data: {
      propertyId: createdProperties[1].id,
      promoId: promosInDb[1].id,
    },
  })
  console.log('✅ Property-Promo relations seeded')

  // 9. Visitors (Leads)
  const visitors = [
    {
      date: new Date().toISOString().split('T')[0],
      name: 'Andi Pratama',
      phone: '+62 811 2222 3333',
      type: 'Rumah',
      building: '45/72',
      location: 'Cibiru, Bandung',
      dp: 'Rp 150.000.000',
      promo: 'Gratis Biaya KPR',
      status: 'Menunggu Follow-up',
    },
    {
      date: new Date().toISOString().split('T')[0],
      name: 'Dewi Sartika',
      phone: '+62 811 4444 5555',
      type: 'Apartemen',
      building: '2BR',
      location: 'Cibiru, Bandung',
      dp: 'Rp 150.000.000',
      promo: '-',
      status: 'Dihubungi',
    },
    {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      name: 'Eko Wijaya',
      phone: '+62 811 6666 7777',
      type: 'Ruko',
      building: '3 Lantai',
      location: 'Cikarang Utara, Bekasi',
      dp: 'Rp 240.000.000',
      promo: 'Cashback 15 Juta',
      status: 'Visit Terjadwal',
    },
  ]

  for (const visitor of visitors) {
    await prisma.visitor.upsert({
      where: { id: `visitor-${visitor.name.replace(/\s/g, '-')}-${visitor.date}` },
      update: {},
      create: { id: `visitor-${visitor.name.replace(/\s/g, '-')}-${visitor.date}`, ...visitor },
    })
  }
  console.log('✅ Visitors seeded')

  // 10. Articles
  const articles = [
    {
      title: 'Tips Memilih Rumah Pertama yang Tepat',
      excerpt: 'Simak tips berikut sebelum membeli rumah pertama agar tidak menyesal di kemudian hari.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      category: 'Tips Properti',
      published: true,
      permalink: 'tips-rumah-pertama',
    },
    {
      title: 'Cara Menghitung Simulasi KPR yang Akurat',
      excerpt: 'Panduan lengkap menghitung cicilan KPR agar terhindar dari masalah keuangan di masa depan.',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      category: 'Keuangan',
      published: true,
      permalink: 'simulasi-kpr-akurat',
    },
    {
      title: 'Daftar Lokasi Investasi Properti Terbaik di Jawa Barat',
      excerpt: 'Pelajari daerah-daerah dengan potensi kenaikan harga properti tertinggi tahun ini.',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: 'https://images.unsplash.com/photo-1574332310539-f8e7a9d99fd8?auto=format&fit=crop&w=800&q=80',
      category: 'Investasi',
      published: true,
      permalink: 'lokasi-investasi-terbaik',
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { permalink: article.permalink },
      update: {},
      create: { id: `article-${article.permalink}`, ...article },
    })
  }
  console.log('✅ Articles seeded')

  // 11. Reviews
  const reviews = [
    {
      name: 'Rina Melati',
      review: 'Pelayanan sangat baik! Saya berhasil mendapatkan rumah impian dengan proses yang mudah dan cepat. Terima kasih tim PropertiHub!',
      rating: 5,
      featured: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Heri Setiawan',
      review: 'Agen yang sangat profesional dan membantu dari awal sampai akhir. Sangat merekomendasikan PropertiHub untuk mencari properti.',
      rating: 5,
      featured: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Linda Kusuma',
      review: 'Proses KPR dibantu sampai tuntas. Saya sangat puas dengan pelayanan dan rumah yang saya dapatkan.',
      rating: 4,
      featured: false,
      image: '',
    },
  ]

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: `review-${review.name.replace(/\s/g, '-')}` },
      update: {},
      create: { id: `review-${review.name.replace(/\s/g, '-')}`, ...review },
    })
  }
  console.log('✅ Reviews seeded')

  // 12. Admin User
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'admin-user',
      name: 'Administrator',
      username: 'admin',
      password: 'admin123', // In production, use bcrypt!
      role: 'admin',
    },
  })
  console.log('✅ Admin user seeded')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📝 Login Admin:')
  console.log('   Username: admin')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })