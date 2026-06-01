import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument } from '@/lib/firestore'
import ExcelJS from 'exceljs'

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
  const loc = kecamatan ? kecamatan : kabupaten
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 3)
  return `${words.join(', ')}, ${type.toLowerCase()} ${loc.toLowerCase()}, ${type.toLowerCase()} ${kabupaten.toLowerCase()}, properti ${kabupaten.toLowerCase()}, dijual ${type.toLowerCase()} ${loc.toLowerCase()}, propertihub`
}

interface RowError {
  row: number
  field: string
  message: string
}

interface UploadResult {
  success: number
  failed: number
  errors: RowError[]
  details: { row: number; title: string; status: string; error?: string }[]
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: 'Format file harus .xlsx atau .xls' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 10MB' }, { status: 400 })
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Load workbook
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const ws = workbook.worksheets[0]
    if (!ws) {
      return NextResponse.json({ error: 'File kosong atau tidak valid' }, { status: 400 })
    }

    // Find header row (look for "Judul" in first few rows)
    let headerRowIndex = -1
    let colMap: Record<string, number> = {}

    for (let r = 1; r <= Math.min(6, ws.rowCount); r++) {
      const row = ws.getRow(r)
      let found = false
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const val = String(cell.value || '').trim().replace(' *', '')
        if (val === 'Judul') {
          found = true
          headerRowIndex = r
        }
        if (headerRowIndex === r) {
          colMap[val] = colNumber
        }
      })
      if (found) break
    }

    if (headerRowIndex === -1) {
      return NextResponse.json({
        error: 'Header tidak ditemukan. Pastikan menggunakan template yang benar.',
      }, { status: 400 })
    }

    // Map columns
    const getCol = (names: string[]): number => {
      for (const name of names) {
        if (colMap[name] !== undefined) return colMap[name]
        // Also try with * suffix
        if (colMap[`${name} *`] !== undefined) return colMap[`${name} *`]
      }
      return -1
    }

    const colTitle = getCol(['Judul'])
    const colPrice = getCol(['Harga (Rp)', 'Harga(Rp)'])
    const colDp = getCol(['DP (Rp)', 'DP(Rp)'])
    const colAllInCost = getCol(['All In Cost (Rp)', 'All In Cost(Rp)'])
    const colKabupaten = getCol(['Kabupaten'])
    const colKecamatan = getCol(['Kecamatan'])
    const colType = getCol(['Jenis Properti'])
    const colBuildingType = getCol(['Tipe Bangunan'])
    const colDescription = getCol(['Deskripsi'])
    const colImages = getCol(['Gambar (URL, pisah koma)', 'Gambar (URL)', 'Gambar(URL, pisah koma)'])
    const colBrochure = getCol(['Brosur (URL)', 'Brosur(URL)'])
    const colPermalink = getCol(['Permalink'])
    const colSeoTitle = getCol(['SEO Title'])
    const colSeoDesc = getCol(['SEO Description'])
    const colSeoKeywords = getCol(['SEO Keywords'])
    const colPromos = getCol(['Promo (pisah koma)', 'Promo(pisah koma)', 'Promo'])

    // Pre-fetch existing promos by badge
    const allPromos = await getCollection('promos')
    const promoMap = new Map<string, string>()
    allPromos.forEach((p: any) => promoMap.set(p.badge.toUpperCase(), p.id))

    const result: UploadResult = {
      success: 0,
      failed: 0,
      errors: [],
      details: [],
    }

    const MAX_ROWS = 500
    let processed = 0

    for (let r = headerRowIndex + 1; r <= ws.rowCount && processed < MAX_ROWS; r++) {
      const row = ws.getRow(r)
      const rowErrors: RowError[] = []

      const getVal = (col: number): string => {
        if (col === -1) return ''
        const cell = row.getCell(col)
        const val = cell.value
        if (val === null || val === undefined) return ''
        if (typeof val === 'object' && 'result' in val) return String(val.result || '')
        if (typeof val === 'object' && 'formula' in val) return String((val as Record<string, unknown>).result || '')
        return String(val).trim()
      }

      const title = getVal(colTitle)
      const priceStr = getVal(colPrice)
      const dpStr = getVal(colDp)
      const allInCostStr = getVal(colAllInCost)
      const kabupaten = getVal(colKabupaten)
      const kecamatan = getVal(colKecamatan)
      const type = getVal(colType)
      const buildingType = getVal(colBuildingType)
      const description = getVal(colDescription)
      const imagesStr = getVal(colImages)
      const brochure = getVal(colBrochure)
      const permalink = getVal(colPermalink)
      const seoTitle = getVal(colSeoTitle)
      const seoDesc = getVal(colSeoDesc)
      const seoKeywords = getVal(colSeoKeywords)
      const promosStr = getVal(colPromos)

      // Skip empty rows
      if (!title && !priceStr && !kabupaten && !type) continue

      processed++

      // Validate required fields
      if (!title) rowErrors.push({ row: r, field: 'Judul', message: 'Wajib diisi' })
      if (!priceStr) {
        rowErrors.push({ row: r, field: 'Harga', message: 'Wajib diisi' })
      } else {
        const priceNum = Number(priceStr.replace(/[^0-9.-]/g, ''))
        if (isNaN(priceNum) || priceNum <= 0) {
          rowErrors.push({ row: r, field: 'Harga', message: 'Harus angka positif' })
        }
      }
      if (!kabupaten) rowErrors.push({ row: r, field: 'Kabupaten', message: 'Wajib diisi' })
      if (!type) rowErrors.push({ row: r, field: 'Jenis Properti', message: 'Wajib diisi' })

      if (rowErrors.length > 0) {
        result.failed++
        result.errors.push(...rowErrors)
        result.details.push({
          row: r,
          title: title || '(tanpa judul)',
          status: 'gagal',
          error: rowErrors.map(e => `${e.field}: ${e.message}`).join('; '),
        })
        continue
      }

      // Parse values
      const price = Number(priceStr.replace(/[^0-9.-]/g, ''))
      const dp = Number(dpStr.replace(/[^0-9.-]/g, '')) || 0
      const allInCost = Number(allInCostStr.replace(/[^0-9.-]/g, '')) || 0

      // Parse images
      const images = imagesStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      // Parse promos
      const promoIds: string[] = []
      if (promosStr) {
        const promoNames = promosStr.split(',').map(s => s.trim().toUpperCase())
        for (const name of promoNames) {
          const id = promoMap.get(name)
          if (id) {
            promoIds.push(id)
          } else {
            rowErrors.push({ row: r, field: 'Promo', message: `Promo "${name}" tidak ditemukan di sistem` })
          }
        }
      }

      // Auto-SEO if not provided
      const isAutoSeo = !seoTitle && !seoDesc && !seoKeywords
      const finalPermalink = permalink || generatePermalink(title)
      const finalSeoTitle = seoTitle || autoSeoTitle(title, kabupaten, type, price)
      const finalSeoDesc = seoDesc || autoSeoDesc(title, kabupaten, kecamatan, type, price, buildingType)
      const finalSeoKeywords = seoKeywords || autoSeoKeywords(title, kabupaten, kecamatan, type)

      try {
        // Create property in Firebase
        const newProperty = await createDocument('properties', {
          title,
          price,
          dp,
          allInCost,
          kabupaten,
          kecamatan,
          type,
          buildingType,
          description,
          images: JSON.stringify(images),
          brochure,
          permalink: finalPermalink,
          seoTitle: finalSeoTitle,
          seoDesc: finalSeoDesc,
          seoKeywords: finalSeoKeywords,
          seoAuto: isAutoSeo,
          promos: promoIds,
          isFeatured: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        result.success++
        result.details.push({
          row: r,
          title,
          status: 'berhasil',
        })
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Gagal membuat properti'
        result.details.push({
          row: r,
          title,
          status: 'gagal',
          error: message,
        })
        result.failed++
      }
    }

    if (processed === 0) {
      return NextResponse.json({
        error: 'Tidak ada data ditemukan di file. Pastikan data dimulai dari baris setelah header.',
      }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupload file'
    console.error('Bulk upload error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}