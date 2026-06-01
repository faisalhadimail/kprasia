import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, deleteDocument } from '@/lib/firestore'

const FIREBASE_COLLECTIONS = [
  'properties',
  'agents',
  'articles',
  'reviews',
  'promos',
  'propertyTypes',
  'locations',
  'visitors',
  'agency',
  'seo',
  'adminUsers'
] as const

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('[Delete API] Received request:', body)

    // Validate confirmation
    if (body.confirmation !== 'hapus') {
      return NextResponse.json(
        { success: false, error: 'Konfirmasi tidak valid. Ketik "hapus" untuk melanjutkan.' },
        { status: 400 }
      )
    }

    // Get selected collections to delete
    const selectedCollections = body.collections || []

    console.log('[Delete API] Selected collections:', selectedCollections)

    // Validate selected collections
    const invalidCollections = selectedCollections.filter((c: string) => !FIREBASE_COLLECTIONS.includes(c as any))
    if (invalidCollections.length > 0) {
      console.log('[Delete API] Invalid collections:', invalidCollections)
      return NextResponse.json(
        { success: false, error: `Collection tidak valid: ${invalidCollections.join(', ')}` },
        { status: 400 }
      )
    }

    if (selectedCollections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pilih minimal satu collection untuk dihapus' },
        { status: 400 }
      )
    }

    const results: Record<string, { success: boolean; count?: number; error?: string }> = {}

    // Delete data from selected collections
    for (const collection of selectedCollections) {
      try {
        console.log(`[Delete API] Processing collection: ${collection}`)

        // Get all documents in the collection
        const documents = await getCollection(collection)
        console.log(`[Delete API] Found ${documents.length} documents in ${collection}`)

        // Delete each document
        let deletedCount = 0
        let errorMessage = ''

        for (const doc of documents) {
          console.log(`[Delete API] Processing doc:`, doc)
          if (doc.id) {
            try {
              await deleteDocument(collection, doc.id)
              deletedCount++
              console.log(`[Delete API] Deleted document ${doc.id} from ${collection}`)
            } catch (error) {
              errorMessage = error instanceof Error ? error.message : 'Unknown error'
              console.error(`[Delete API] Failed to delete document ${doc.id} from ${collection}:`, error)
            }
          } else {
            console.warn(`[Delete API] Document without ID in ${collection}:`, doc)
          }
        }

        results[collection] = {
          success: errorMessage === '',
          count: deletedCount,
          error: errorMessage || undefined
        }

        console.log(`[Delete API] Completed ${collection}: ${deletedCount} deleted, error: ${errorMessage}`)
      } catch (e: any) {
        results[collection] = {
          success: false,
          count: 0,
          error: e.message
        }
        console.error(`[Delete API] Error processing collection ${collection}:`, e)
      }
    }

    console.log('[Delete API] Final results:', results)

    // Check if any deletions were successful
    const totalDeleted = Object.values(results).reduce((sum: number, r: any) => sum + (r.count || 0), 0)
    const hasErrors = Object.values(results).some((r: any) => !r.success)

    return NextResponse.json({
      success: true,
      message: `Berhasil menghapus ${totalDeleted} data dari ${selectedCollections.length} collection`,
      results
    })
  } catch (error) {
    console.error('[Delete API] Delete failed:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    )
  }
}