import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

const COLUMNS = [
  { header: 'Judul *', key: 'title', width: 35, example: 'Griya Asri Residence' },
  { header: 'Harga (Rp) *', key: 'price', width: 20, example: '750000000' },
  { header: 'DP (Rp)', key: 'dp', width: 18, example: '75000000' },
  { header: 'All In Cost (Rp)', key: 'allInCost', width: 22, example: '0' },
  { header: 'Kabupaten *', key: 'kabupaten', width: 22, example: 'Tangerang Selatan' },
  { header: 'Kecamatan', key: 'kecamatan', width: 22, example: 'Serpong' },
  { header: 'Jenis Properti *', key: 'type', width: 20, example: 'Rumah' },
  { header: 'Tipe Bangunan', key: 'buildingType', width: 18, example: '36/72' },
  { header: 'Deskripsi', key: 'description', width: 50, example: 'Rumah modern minimalis dengan 2 kamar tidur...' },
  { header: 'Gambar (URL, pisah koma)', key: 'images', width: 60, example: 'https://example.com/image1.jpg,https://example.com/image2.jpg' },
  { header: 'Brosur (URL)', key: 'brochure', width: 40, example: 'https://example.com/brosur.pdf' },
  { header: 'Permalink', key: 'permalink', width: 30, example: '' },
  { header: 'SEO Title', key: 'seoTitle', width: 40, example: '' },
  { header: 'SEO Description', key: 'seoDesc', width: 50, example: '' },
  { header: 'SEO Keywords', key: 'seoKeywords', width: 40, example: '' },
  { header: 'Promo (pisah koma)', key: 'promos', width: 30, example: 'DISKON,FREE AC' },
]

export async function GET() {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'PropertiHub'
    workbook.created = new Date()

    // ─── Sheet 1: Template Upload ───
    const ws = workbook.addWorksheet('Template Upload', {
      properties: { defaultColWidth: 15 },
    })

    // Title row
    ws.mergeCells('A1:Q1')
    const titleCell = ws.getCell('A1')
    titleCell.value = 'TEMPLATE UPLOAD MASSAL LISTING - PROPERTIHUB'
    titleCell.font = { bold: true, size: 14, color: { argb: 'FF1E40AF' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(1).height = 36

    // Instruction row
    ws.mergeCells('A2:Q2')
    const instrCell = ws.getCell('A2')
    instrCell.value = 'Kolom bertanda * wajib diisi. Kosongkan permalink & SEO jika ingin auto-generate. Harga dalam angka tanpa titik/koma (contoh: 750000000).'
    instrCell.font = { italic: true, size: 10, color: { argb: 'FF6B7280' } }
    instrCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
    ws.getRow(2).height = 30

    // Empty row
    ws.addRow([])

    // Header row (row 4)
    const headerRow = ws.addRow(COLUMNS.map(c => c.header))
    headerRow.height = 32
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

    // Example row (row 5)
    const exampleRow = ws.addRow(COLUMNS.map(c => c.example))
    exampleRow.height = 24
    exampleRow.eachCell((cell, colNumber) => {
      cell.font = { italic: true, size: 10, color: { argb: 'FF9CA3AF' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9FAFB' },
      }
      cell.alignment = { vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      }
    })

    // Empty data row (row 6) with borders
    const emptyRow = ws.addRow(COLUMNS.map(() => ''))
    emptyRow.height = 24
    emptyRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      }
    })

    // Set column widths
    ws.columns = COLUMNS.map(c => ({ width: c.width }))

    // Freeze header
    ws.views = [{ state: 'frozen', ySplit: 4, xSplit: 0, topLeftCell: 'A5' }]

    // ─── Sheet 2: Panduan ───
    const wsGuide = workbook.addWorksheet('Panduan', {
      properties: { defaultColWidth: 25 },
    })

    const guides = [
      ['PANDUAN UPLOAD MASSAL', ''],
      ['', ''],
      ['Kolom', 'Keterangan'],
      ['Judul *', 'Nama listing properti. Wajib diisi.'],
      ['Harga (Rp) *', 'Harga jual dalam angka tanpa format. Contoh: 750000000 (bukan 750.000.000). Wajib diisi.'],
      ['DP (Rp)', 'Uang muka dalam angka. Kosongkan jika 0.'],
      ['All In Cost (Rp)', 'Biaya all-in dalam angka. Kosongkan jika 0.'],
      ['Kabupaten *', 'Nama kabupaten/kota. Harus sesuai dengan data lokasi di sistem. Wajib diisi.'],
      ['Kecamatan', 'Nama kecamatan. Harus sesuai dengan data lokasi di sistem.'],
      ['Jenis Properti *', 'Jenis properti (Rumah, Apartemen, Tanah, dll). Harus sesuai dengan Jenis Properti di sistem. Wajib diisi.'],
      ['Tipe Bangunan', 'Tipe bangunan contoh: 36/72, 45/90.'],
      ['Deskripsi', 'Deskripsi lengkap properti.'],
      ['Gambar (URL, pisah koma)', 'URL gambar dipisah dengan koma. Contoh: https://a.jpg,https://b.jpg'],
      ['Brosur (URL)', 'URL file brosur (PDF/IMG).'],
      ['Permalink', 'URL slug custom. Kosongkan untuk auto-generate dari judul.'],
      ['SEO Title', 'Judul SEO. Kosongkan untuk auto-generate.'],
      ['SEO Description', 'Deskripsi SEO. Kosongkan untuk auto-generate.'],
      ['SEO Keywords', 'Kata kunci SEO. Kosongkan untuk auto-generate.'],
      ['Promo (pisah koma)', 'Nama badge promo dipisah koma. Harus sesuai dengan promo di sistem. Contoh: DISKON,FREE AC'],
      ['', ''],
      ['CATATAN:', ''],
      ['', '1. Jangan mengubah header kolom (baris ke-4)'],
      ['', '2. Hapus baris contoh (baris ke-5) sebelum upload'],
      ['', '3. Baris kosong akan diabaikan'],
      ['', '4. Pastikan Kabupaten, Kecamatan, Jenis Properti, dan Promo sesuai dengan data di sistem'],
      ['', '5. Harga dalam angka murni tanpa titik, koma, atau "Rp"'],
      ['', '6. Maksimal 500 listing per upload'],
    ]

    guides.forEach((row, idx) => {
      const r = wsGuide.addRow(row)
      if (idx === 0) {
        r.getCell(1).font = { bold: true, size: 14, color: { argb: 'FF1E40AF' } }
      } else if (idx === 2) {
        r.eachCell((cell) => {
          cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
        })
      } else if (idx === guides.length - 5) {
        r.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFDC2626' } }
      }
      r.getCell(2).alignment = { wrapText: true, vertical: 'top' }
    })

    wsGuide.getColumn(2).width = 80

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template-upload-listing-propertihub.xlsx"',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat template'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
