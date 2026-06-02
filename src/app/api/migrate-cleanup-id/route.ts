import { NextResponse } from 'next/server'
import { getCollection, updateDocument } from '@/lib/firestore'
import { COLLECTIONS } from '@/lib/firebase'

/**
 * Migrasi untuk menghapus field 'id' yang terduplikasi di Firestore
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collection = searchParams.get('collection')

  // Tampilkan semua collection yang tersedia
  if (!collection) {
    const collections = Object.values(COLLECTIONS)
    return NextResponse.json({
      message: 'Tentukan collection untuk dibersihkan',
      availableCollections: collections,
      usage: '?collection=properties'
    })
  }

  // Validasi collection
  if (!Object.values(COLLECTIONS).includes(collection as any)) {
    return NextResponse.json(
      { error: 'Invalid collection name' },
      { status: 400 }
    )
  }

  try {
    const docs = await getCollection(collection)
    let cleanedCount = 0
    const errors: string[] = []

    for (const doc of docs) {
      const docData = doc as any
      
      // Hapus field 'id' dari data
      const { id, ...dataWithoutId } = docData

      if (id) {
        try {
          // Update dokumen tanpa field 'id'
          await updateDocument(collection as any, id, dataWithoutId)
          cleanedCount++
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err)
          errors.push(`Failed to clean doc ${id}: ${errorMsg}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      collection,
      totalDocuments: docs.length,
      cleanedDocuments: cleanedCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Migration error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Migration failed', details: errorMsg },
      { status: 500 }
    )
  }
}
