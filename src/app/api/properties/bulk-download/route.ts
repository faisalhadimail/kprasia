import { NextRequest, NextResponse } from 'next/server'
import { getCollection, queryCollection } from '@/lib/firestore'
import { where } from 'firebase/firestore'
import ExcelJS from 'exceljs'

const COLUMNS = [
  { header: 'Judul', key: 'title', width: 35 },
  { header: 'Harga (Rp)', key: 'price', width: 20 },
  { header: 'DP (Rp)', key: 'dp', width: 18 },
  { header: 'All In Cost (Rp)', key: 'allInCost', width: 22 },
  { header: 'Kabupaten', key: 'kabupaten', width: 22 },
  { header: 'Kecamatan', key: 'kecamatan', width: 22 },
  { header: 'Jenis Properti', key: 'type', width: 20 },
  { header: 'Tipe Bangunan', key: 'buildingType', width: 18 },
  { header: 'Deskripsi', key: 'description', width: 50 },
  { header: 'Gambar (URL)', key: 'images', width: 60 },
  { header: 'Brosur (URL)', key: 'brochure', width: 40 },
  { header: 'Permalink', key: 'permalink', width: 30 },
  { header: 'SEO Title', key: 'seoTitle', width: 40 },
  { header: 'SEO Description', key: 'seoDesc', width: 50 },
  { header: 'SEO Keywords', key: 'seoKeywords', width: 40 },
  { header: 'Promo', key: 'promos', width: 30 },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || undefined
    const kabupaten = searchParams.get('kabupaten') || undefined
    const kecamatan = searchParams.get('kecamatan') || undefined

    // Build query constraints
    const constraints: any[] = []
    if (type) constraints.push(where('type', '==', type))
    if (kabupaten) constraints.push(where('kabupaten', '==', kabupaten))
    if (kecamatan) constraints.push(where('kecamatan', '==', kecamatan))

    // Fetch properties from Firebase
    let properties
    if (constraints.length > 0) {
      properties = await queryCollection('properties', constraints)
    } else {
      properties = await getCollection('properties')
    }

    // Fetch promos for mapping
    const promos = await getCollection('promos')
    const promoMap = new Map<string, string>()
    promos.forEach((p: any) => promoMap.set(p.id, p.badge))

    const formattedProperties = properties.map((p: any) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
    }))

    if (formattedProperties.length === 0) {
      return NextResponse.json({ error: 'Tidak ada listing untuk diunduh' }, { status: 404 })
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'PropertiHub'
    workbook.created = new Date()

    const ws = workbook.addWorksheet('Data Listing', {
      properties: { defaultColWidth: 15 },
    })

    // Title row
    ws.mergeCells(`A1:Q1`)
    const titleCell = ws.getCell('A1')
    titleCell.value = `DATA LISTING PROPERTIHUB - ${formattedProperties.length} Properti - ${new Date().toLocaleDateString('id-ID')}`
    titleCell.font = { bold: true, size: 14, color: { argb: 'FF1E40AF' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 36

    // Header row (row 3)
    const headerRow = ws.addRow(COLUMNS.map(c => c.header))
    headerRow.height = 28
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E40AF' },
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      }
    })

    // Data rows
    formattedProperties.forEach((p: any, idx) => {
      const images = p.images || []
      const promoIds = p.promos || []
      const promoNames = promoIds.map((pid: string) => promoMap.get(pid) || '').filter(Boolean).join(',')

      const row = ws.addRow([
        p.title,
        p.price,
        p.dp,
        p.allInCost,
        p.kabupaten,
        p.kecamatan,
        p.type,
        p.buildingType,
        p.description,
        images.join(','),
        p.brochure,
        p.permalink,
        p.seoTitle,
        p.seoDesc,
        p.seoKeywords,
        promoNames,
      ])

      row.height = 20
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        }
        cell.alignment = { vertical: 'middle', wrapText: true }
      })

      // Alternate row color
      if (idx % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' },
          }
        })
      }
    })

    // Set column widths
    ws.columns = COLUMNS.map(c => ({ width: c.width }))

    // Freeze header
    ws.views = [{ state: 'frozen', ySplit: 3, xSplit: 0, topLeftCell: 'A4' }]

    const buffer = await workbook.xlsx.writeBuffer()

    const filterLabel = [type, kabupaten, kecamatan].filter(Boolean).join('-') || 'semua'
    const filename = `listing-propertihub-${filterLabel}-${new Date().toISOString().split('T')[0]}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengunduh listing'
    console.error('Bulk download error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}