import { supabase } from '@/lib/supabase'
import { invalidateCache } from '@/lib/cache'

const dummyProperties = [
  {
    title: 'Rumah Modern Minimalis di Canggu',
    price: 1850000000,
    dp: 200000000,
    allInCost: 1950000000,
    kabupaten: 'Badung',
    kecamatan: 'Mengwi',
    type: 'Rumah',
    buildingType: '60/90',
    description: 'Rumah modern minimalis dengan desain tropis yang asri. Dilengkapi 2 kamar tidur, 2 kamar mandi, carport, dan taman depan. Lokasi strategis dekat dengan pusat kuliner Canggu dan pantai.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Villa Private Pool di Ubud',
    price: 3200000000,
    dp: 500000000,
    allInCost: 3450000000,
    kabupaten: 'Gianyar',
    kecamatan: 'Ubud',
    type: 'Villa',
    buildingType: '120/200',
    description: 'Villa mewah dengan private infinity pool menghadap sawah. 3 kamar tidur en-suite, fully furnished, cocok untuk hunian atau investasi rental.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Tanah Kavling Strategis di Sanur',
    price: 4500000000,
    dp: 0,
    allInCost: 4500000000,
    kabupaten: 'Denpasar',
    kecamatan: 'Sanur',
    type: 'Tanah',
    buildingType: '',
    description: 'Tanah kavling premium di kawasan Sanur, dekat pantai. Cocok untuk dibangun villa atau rumah tinggal. Akses jalan lebar 6 meter, sertifikat SHM.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Apartemen Studio di Kuta',
    price: 750000000,
    dp: 100000000,
    allInCost: 800000000,
    kabupaten: 'Badung',
    kecamatan: 'Kuta',
    type: 'Apartemen',
    buildingType: 'Studio/28',
    description: 'Apartemen studio fully furnished di pusat Kuta. Dekat Beachwalk Mall dan pantai Kuta. Ideal untuk investasi rental atau tempat tinggal.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Rumah Cluster di Jimbaran',
    price: 2100000000,
    dp: 300000000,
    allInCost: 2200000000,
    kabupaten: 'Badung',
    kecamatan: 'Kuta Selatan',
    type: 'Rumah',
    buildingType: '70/100',
    description: 'Rumah cluster one-gate system di Jimbaran. 3 kamar tidur, 2 kamar mandi, taman, dan carport 1 mobil. Keamanan 24 jam, dekat dengan pusat perbelanjaan.',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Villa 2 Lantai di Seminyak',
    price: 5500000000,
    dp: 800000000,
    allInCost: 5800000000,
    kabupaten: 'Badung',
    kecamatan: 'Kuta',
    type: 'Villa',
    buildingType: '200/250',
    description: 'Villa 2 lantai dengan kolam renang di jantung Seminyak. 4 kamar tidur, rooftop lounge, fully furnished dengan interior modern. Sangat cocok untuk villa rental.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Rumah Tinggal di Tabanan',
    price: 950000000,
    dp: 100000000,
    allInCost: 1000000000,
    kabupaten: 'Tabanan',
    kecamatan: 'Tabanan',
    type: 'Rumah',
    buildingType: '45/72',
    description: 'Rumah tinggal sederhana namun nyaman di Tabanan. 2 kamar tidur, 1 kamar mandi, dapur, dan halaman luas. Suasana sejuk dan asri jauh dari hiruk pikuk kota.',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Tanah Sawah View di Tegallalang',
    price: 2800000000,
    dp: 0,
    allInCost: 2800000000,
    kabupaten: 'Gianyar',
    kecamatan: 'Tegallalang',
    type: 'Tanah',
    buildingType: '',
    description: 'Tanah dengan pemandangan sawah terasering yang ikonik di Tegallalang. Luas 500 m², sertifikat SHM, sangat cocok untuk villa boutique atau homestay.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Ruko 3 Lantai di Denpasar',
    price: 3600000000,
    dp: 500000000,
    allInCost: 3750000000,
    kabupaten: 'Denpasar',
    kecamatan: 'Denpasar Selatan',
    type: 'Ruko',
    buildingType: '3 Lantai/75',
    description: 'Ruko strategis 3 lantai di jalan utama Denpasar Selatan. Cocok untuk usaha, kantor, atau investasi sewa. Parkiran luas di depan.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Apartemen 2BR di Denpasar Barat',
    price: 1250000000,
    dp: 200000000,
    allInCost: 1320000000,
    kabupaten: 'Denpasar',
    kecamatan: 'Denpasar Barat',
    type: 'Apartemen',
    buildingType: '2BR/52',
    description: 'Apartemen 2 kamar tidur di kawasan Denpasar Barat. Fully furnished, fasilitas kolam renang, gym, dan keamanan 24 jam. Dekat dengan kampus dan rumah sakit.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
  },
]

function generatePermalink(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function autoSeoTitle(title: string, kabupaten: string, type: string, price: number): string {
  const priceStr = price >= 1000000000 ? `${(price / 1000000000).toFixed(1).replace('.0', '')} Miliar` : `${Math.round(price / 1000000)} Juta`
  return `${title} - ${type} di ${kabupaten} ${priceStr}`
}

function autoSeoDesc(title: string, kabupaten: string, kecamatan: string, type: string, price: number, buildingType: string): string {
  const priceStr = new Intl.NumberFormat('id-ID').format(Math.round(price))
  const loc = kecamatan ? `${kecamatan}, ${kabupaten}` : kabupaten
  const building = buildingType ? ` tipe ${buildingType}` : ''
  return `Dijual ${type.toLowerCase()}${building} ${title} di ${loc}. Harga ${priceStr}. Temukan penawaran terbaik hanya di PropertiHub.`
}

function autoSeoKeywords(title: string, kabupaten: string, kecamatan: string, type: string): string {
  const loc = kecamatan ? `${kecamatan}` : kabupaten
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 3)
  return `${words.join(', ')}, ${type.toLowerCase()} ${loc.toLowerCase()}, ${type.toLowerCase()} ${kabupaten.toLowerCase()}, properti ${kabupaten.toLowerCase()}, dijual ${type.toLowerCase()} ${loc.toLowerCase()}, propertihub`
}

export async function POST() {
  try {
    const rows = dummyProperties.map((p) => ({
      title: p.title,
      price: p.price,
      dp: p.dp,
      allInCost: p.allInCost,
      kabupaten: p.kabupaten,
      kecamatan: p.kecamatan,
      type: p.type,
      buildingType: p.buildingType,
      description: p.description,
      images: p.images,
      brochure: '',
      permalink: generatePermalink(p.title),
      seoTitle: autoSeoTitle(p.title, p.kabupaten, p.type, p.price),
      seoDesc: autoSeoDesc(p.title, p.kabupaten, p.kecamatan, p.type, p.price, p.buildingType),
      seoKeywords: autoSeoKeywords(p.title, p.kabupaten, p.kecamatan, p.type),
      seoAuto: true,
    }))

    const { data, error } = await supabase.from('Property').insert(rows).select('*')

    if (error) throw error

    invalidateCache()

    return Response.json({
      success: true,
      message: `${data?.length || 0} dummy properties inserted`,
      count: data?.length || 0,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal insert dummy data'
    return Response.json({ error: message }, { status: 500 })
  }
}
