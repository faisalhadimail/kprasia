export function formatRupiah(num: number): string {
  return 'Rp. ' + new Intl.NumberFormat('id-ID').format(Math.round(num))
}

export function generatePermalink(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function autoFormatRupiahInput(value: string): string {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return 'Rp. ' + new Intl.NumberFormat('id-ID').format(Number(num))
}

export function parseRupiahInput(value: string): number {
  return Number(value.replace(/[^0-9]/g, '')) || 0
}

export function formatPriceShort(price: number): string {
  if (price >= 1000000000) {
    const val = price / 1000000000
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} Miliar`
  }
  return `${Math.round(price / 1000000)} Juta`
}

export function autoSeoTitle(title: string, kabupaten: string, type: string, price: number): string {
  return `${title} - ${type} di ${kabupaten} ${formatPriceShort(price)}`
}

export function autoSeoDesc(title: string, kabupaten: string, kecamatan: string, type: string, price: number, buildingType: string): string {
  const priceStr = new Intl.NumberFormat('id-ID').format(Math.round(price))
  const loc = kecamatan ? `${kecamatan}, ${kabupaten}` : kabupaten
  const building = buildingType ? ` tipe ${buildingType}` : ''
  return `Dijual ${type.toLowerCase()}${building} ${title} di ${loc}. Harga ${priceStr}. Temukan penawaran terbaik hanya di PropertiHub.`
}

export function autoSeoKeywords(title: string, kabupaten: string, kecamatan: string, type: string): string {
  const loc = kecamatan ? kecamatan : kabupaten
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 3)
  return `${words.join(', ')}, ${type.toLowerCase()} ${loc.toLowerCase()}, ${type.toLowerCase()} ${kabupaten.toLowerCase()}, properti ${kabupaten.toLowerCase()}, dijual ${type.toLowerCase()} ${loc.toLowerCase()}, propertihub`
}

export function generateSeoTitle(title: string): string {
  return `${title} - PropertiHub`
}

export function generateSeoDesc(title: string, kabupaten: string, type: string): string {
  return `Dijual ${type.toLowerCase()} ${title} di ${kabupaten}. Temukan penawaran terbaik hanya di PropertiHub.`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Baru': return 'bg-blue-50 text-blue-600'
    case 'Follow Up': return 'bg-yellow-50 text-yellow-600'
    case 'Hot Lead': return 'bg-orange-50 text-orange-600'
    case 'Closing': return 'bg-green-50 text-green-600'
    case 'Batal': return 'bg-red-50 text-red-500'
    default: return 'bg-gray-50 text-gray-600'
  }
}

export function exportVisitorsCSV(visitors: Array<{
  date: string
  name: string
  phone: string
  type: string
  building: string
  location: string
  dp: string
  promo: string
  status: string
}>): void {
  const headers = ['Tanggal', 'Nama', 'Telepon', 'Jenis', 'Tipe Bangunan', 'Lokasi', 'DP', 'Promo', 'Status']
  const rows = visitors.map(v => [v.date, v.name, v.phone, v.type, v.building, v.location, v.dp, v.promo, v.status])
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
