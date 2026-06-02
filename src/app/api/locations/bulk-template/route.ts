import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection } from '@/lib/firestore'
import ExcelJS from 'exceljs'

export async function GET() {
  try {
    const workbook = new ExcelJS.Workbook()

    // Sheet 1: Template Upload
    const worksheet = workbook.addWorksheet('Template Upload')

    // Title
    const titleRow = worksheet.addRow(['Template Upload Data Kabupaten'])
    titleRow.font = { bold: true, size: 14, color: { argb: 'FF1F4E78' } }
    worksheet.mergeCells('A1:C1')
    titleRow.height = 25

    // Instructions
    const instructions = [
      'Panduan Upload Data Kabupaten:',
      '1. Isi kolom Kabupaten dan Kecamatan sesuai format',
      '2. Kecamatan dipisahkan dengan tanda koma (,)',
      '3. Setiap kabupaten harus unik',
      '4. File harus berformat .xlsx atau .xls',
      '5. Maksimal 100 baris data per upload'
    ]

    instructions.forEach((instruction, index) => {
      const row = worksheet.addRow(instruction)
      row.font = { size: 10, color: { argb: 'FF7F7F7F' } }
      row.height = 18
    })

    // Empty row
    worksheet.addRow()

    // Header
    const headerRow = worksheet.addRow(['Kabupaten*', 'Kecamatan*', 'Contoh Kecamatan'])
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25

    // Example row
    const exampleRow = worksheet.addRow(['Bogor', 'Ciawi, Cisarua, Megamendung', '(Contoh baris ini tidak akan diupload)'])
    exampleRow.font = { italic: true, size: 10, color: { argb: 'FF7F7F7F' } }
    exampleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF2F2F2' }
    }

    // Empty data row
    worksheet.addRow([])

    // Set column widths
    worksheet.getColumn('A').width = 25
    worksheet.getColumn('B').width = 50
    worksheet.getColumn('C').width = 40

    // Sheet 2: Panduan Lengkap
    const guideSheet = workbook.addWorksheet('Panduan')
    guideSheet.addRow(['Panduan Upload Data Kabupaten'])
    guideSheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF1F4E78' } }
    guideSheet.mergeCells('A1:B1')

    guideSheet.addRow([])
    guideSheet.addRow(['Kolom', 'Deskripsi'])
    const guideHeader = guideSheet.getRow(4)
    guideHeader.font = { bold: true }
    guideHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE7E6E6' }
    }

    const guideData = [
      ['Kabupaten*', 'Nama kabupaten (wajib diisi, harus unik)'],
      ['Kecamatan*', 'Daftar kecamatan dipisahkan dengan koma (wajib diisi)'],
      ['Contoh Kecamatan', 'Baris contoh (tidak akan diupload)'],
      ['', ''],
      ['Format Kecamatan:', 'Ciawi, Cisarua, Megamendung'],
      ['', '(pisahkan dengan koma, spasi setelah kama opsional)'],
      ['', ''],
      ['Contoh Data Valid:', ''],
      ['Baris 1:', 'Bogor | Ciawi, Cisarua, Megamendung'],
      ['Baris 2:', 'Depok | Beji, Cinere, Cipayung, Limo'],
      ['Baris 3:', 'Bekasi | Cikarang Utara, Cikarang Selatan, Cibitung'],
      ['', ''],
      ['Catatan:', '- Kabupaten duplikat akan di-skip'],
      ['', '- Kecamatan kosong akan dianggap sebagai kabupaten tanpa kecamatan'],
      ['', '- Spasi depan/belakang akan dihapus otomatis'],
    ]

    guideData.forEach(([colA, colB]) => {
      guideSheet.addRow([colA, colB])
    })

    guideSheet.getColumn('A').width = 30
    guideSheet.getColumn('B').width = 60

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Return file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template-kabupaten.xlsx"',
      },
    })
  } catch (error) {
    console.error('Error generating kabupaten template:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}