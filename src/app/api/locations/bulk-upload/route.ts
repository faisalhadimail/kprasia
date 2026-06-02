import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, createDocument, deleteDocument, getDocument } from '@/lib/firestore'
import ExcelJS from 'exceljs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream'
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak valid. Gunakan format .xlsx atau .xls' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB' },
        { status: 400 }
      )
    }

    // Read file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)

    // Get first worksheet
    const worksheet = workbook.worksheets[0]

    if (!worksheet) {
      return NextResponse.json(
        { success: false, error: 'File tidak memiliki worksheet' },
        { status: 400 }
      )
    }

    // Find header row (looking for "Kabupaten" column)
    let headerRowIndex = -1
    let kabupatenCol = -1
    let kecamatanCol = -1

    for (let row = 1; row <= Math.min(10, worksheet.rowCount); row++) {
      const rowData = worksheet.getRow(row).values as any[]
      if (!rowData || rowData.length === 0) continue

      const kabupatenIndex = rowData.findIndex((cell: any) => {
        const val = String(cell || '').toLowerCase().trim()
        return val === 'kabupaten' || val === 'kabupaten*'
      })

      const kecamatanIndex = rowData.findIndex((cell: any) => {
        const val = String(cell || '').toLowerCase().trim()
        return val === 'kecamatan' || val === 'kecamatan*'
      })

      if (kabupatenIndex !== -1 && kecamatanIndex !== -1) {
        headerRowIndex = row
        kabupatenCol = kabupatenIndex
        kecamatanCol = kecamatanIndex
        break
      }
    }

    if (headerRowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Header tidak ditemukan. Pastikan file memiliki kolom "Kabupaten" dan "Kecamatan"' },
        { status: 400 }
      )
    }

    // Parse data
    const data: Array<{ kabupaten: string; kecamatan: string[] }> = []
    const errors: Array<{ row: number; error: string }> = []

    for (let row = headerRowIndex + 1; row <= worksheet.rowCount; row++) {
      const rowData = worksheet.getRow(row).values as any[]
      if (!rowData || rowData.length === 0) continue

      const kabupaten = rowData[kabupatenCol]
      const kecamatan = rowData[kecamatanCol]

      // Skip empty rows
      if (!kabupaten || String(kabupaten).trim() === '') continue

      const kabupatenStr = String(kabupaten).trim()

      // Skip example rows
      if (kabupatenStr.toLowerCase().includes('contoh') ||
          kabupatenStr === 'Kabupaten*' ||
          kabupatenStr.toLowerCase() === 'kabupaten') {
        continue
      }

      // Validate kabupaten
      if (!kabupatenStr) {
        errors.push({ row, error: 'Kabupaten tidak boleh kosong' })
        continue
      }

      // Parse kecamatan (split by comma)
      let kecamatanList: string[] = []
      if (kecamatan && String(kecamatan).trim()) {
        kecamatanList = String(kecamatan)
          .split(',')
          .map(k => k.trim())
          .filter(k => k !== '')
      }

      data.push({
        kabupaten: kabupatenStr,
        kecamatan: kecamatanList
      })

      // Max 100 rows
      if (data.length >= 100) {
        break
      }
    }

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada data valid untuk diupload' },
        { status: 400 }
      )
    }

    // Get existing locations
    const existingLocations = await getCollection(COLLECTIONS.LOCATIONS)
    const existingKabupaten = new Set(
      existingLocations.map((l: any) => String(l.kabupaten).toLowerCase().trim())
    )

    // Upload to Firebase
    const results: Array<{
      kabupaten: string
      kecamatanCount: number
      status: 'success' | 'duplicate'
    }> = []
    let successCount = 0
    let duplicateCount = 0

    for (const item of data) {
      const kabupatenLower = item.kabupaten.toLowerCase().trim()

      if (existingKabupaten.has(kabupatenLower)) {
        results.push({
          kabupaten: item.kabupaten,
          kecamatanCount: item.kecamatan.length,
          status: 'duplicate'
        })
        duplicateCount++
        continue
      }

      try {
        await createDocument(COLLECTIONS.LOCATIONS, {
          kabupaten: item.kabupaten,
          kecamatan: item.kecamatan
        })

        results.push({
          kabupaten: item.kabupaten,
          kecamatanCount: item.kecamatan.length,
          status: 'success'
        })
        successCount++
        existingKabupaten.add(kabupatenLower)
      } catch (error) {
        errors.push({
          row: data.indexOf(item) + headerRowIndex + 1,
          error: `Gagal upload: ${error instanceof Error ? error.message : String(error)}`
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Upload selesai! ${successCount} kabupaten berhasil ditambahkan, ${duplicateCount} kabupaten duplikat di-skip`,
      results,
      summary: {
        total: data.length,
        success: successCount,
        duplicate: duplicateCount,
        errors: errors.length
      },
      details: errors
    })
  } catch (error) {
    console.error('Error processing kabupaten upload:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memproses file',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}