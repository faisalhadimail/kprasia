import { NextRequest, NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firestore'

// Helper functions for auto SEO
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

// GET - Fetch property by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await getDocument(COLLECTIONS.PROPERTIES, id)

    if (!property) {
      return NextResponse.json(
        { error: 'Properti tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data properti' },
      { status: 500 }
    )
  }
}

// PUT - Update property by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Extract all fields except 'id' - Firebase document ID is separate
    const {
      id: bodyId, // Extract and exclude from update
      title,
      price,
      dp,
      allInCost,
      kabupaten,
      kecamatan,
      type,
      buildingType,
      description,
      images,
      brochure,
      permalink,
      seoTitle,
      seoDesc,
      seoKeywords,
      seoAuto,
      promoIds,
    } = body

    // Get existing property for auto SEO
    const existing = await getDocument(COLLECTIONS.PROPERTIES, id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Properti tidak ditemukan' },
        { status: 404 }
      )
    }

    const isAutoSeo = seoAuto !== false
    const useTitle = title || existing.title || ''
    const useKabupaten = kabupaten || existing.kabupaten || ''
    const useKecamatan = kecamatan !== undefined ? kecamatan : (existing.kecamatan || '')
    const useType = type || existing.type || ''
    const usePrice = price !== undefined ? price : (existing.price || 0)
    const useBuildingType = buildingType !== undefined ? buildingType : (existing.buildingType || '')

    const finalSeoTitle = isAutoSeo ? autoSeoTitle(useTitle, useKabupaten, useType, usePrice) : (seoTitle !== undefined ? seoTitle : existing.seoTitle)
    const finalSeoDesc = isAutoSeo ? autoSeoDesc(useTitle, useKabupaten, useKecamatan, useType, usePrice, useBuildingType) : (seoDesc !== undefined ? seoDesc : existing.seoDesc)
    const finalSeoKeywords = isAutoSeo ? autoSeoKeywords(useTitle, useKabupaten, useKecamatan, useType) : (seoKeywords !== undefined ? seoKeywords : existing.seoKeywords)

    const updateFields: Record<string, unknown> = {
      seoTitle: finalSeoTitle || '',
      seoDesc: finalSeoDesc || '',
      seoKeywords: finalSeoKeywords || '',
      seoAuto: isAutoSeo,
    }

    if (title !== undefined) updateFields.title = title
    if (price !== undefined) updateFields.price = Number(price)
    if (dp !== undefined) updateFields.dp = Number(dp)
    if (allInCost !== undefined) updateFields.allInCost = Number(allInCost)
    if (kabupaten !== undefined) updateFields.kabupaten = kabupaten
    if (kecamatan !== undefined) updateFields.kecamatan = kecamatan
    if (type !== undefined) updateFields.type = type
    if (buildingType !== undefined) updateFields.buildingType = buildingType
    if (description !== undefined) updateFields.description = description
    if (images !== undefined) updateFields.images = images
    if (brochure !== undefined) updateFields.brochure = brochure
    if (permalink !== undefined) updateFields.permalink = permalink
    if (promoIds !== undefined) updateFields.promoIds = promoIds

    await updateDocument(COLLECTIONS.PROPERTIES, id, updateFields)

    // Fetch updated document
    const updatedProperty = await getDocument(COLLECTIONS.PROPERTIES, id)

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate properti'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// DELETE - Delete property by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await deleteDocument(COLLECTIONS.PROPERTIES, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus properti' },
      { status: 400 }
    )
  }
}
