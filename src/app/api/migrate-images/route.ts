import { NextResponse } from 'next/server'
import { getCollection, updateDocument, COLLECTIONS } from '@/lib/firestore'

/**
 * Migration API to fix images stored as JSON strings
 * Converts: "https://url1,https://url2" or "[\"https://url1\",\"https://url2\"]"
 * To: ["https://url1", "https://url2"]
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple secret check
    if (secret !== 'migrate-images') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Migration] Starting images migration...')

    // Get all properties
    const properties = await getCollection(COLLECTIONS.PROPERTIES)

    let fixed = 0
    let skipped = 0
    let errors = 0

    for (const prop of properties) {
      if (!prop.id) continue

      try {
        let images = prop.images

        // Check if images is a JSON string or comma-separated string
        if (typeof images === 'string') {
          let parsedImages: string[] = []

          // Try to parse as JSON
          try {
            parsedImages = JSON.parse(images)
          } catch {
            // If not JSON, split by comma
            parsedImages = images.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          }

          // Only update if parsed successfully and not already an array
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            await updateDocument(COLLECTIONS.PROPERTIES, prop.id, { images: parsedImages })
            fixed++
            console.log(`[Migration] Fixed images for property: ${prop.title}`)
          } else {
            console.warn(`[Migration] No valid images found for property: ${prop.title}`)
          }
        } else if (Array.isArray(images)) {
          skipped++
          console.log(`[Migration] Skipped (already array): ${prop.title}`)
        } else {
          console.warn(`[Migration] Unexpected images format for: ${prop.title}`, typeof images)
        }
      } catch (error) {
        errors++
        console.error(`[Migration] Error fixing property ${prop.id}:`, error)
      }
    }

    const result = {
      total: properties.length,
      fixed,
      skipped,
      errors,
      message: `Migration complete: ${fixed} fixed, ${skipped} skipped, ${errors} errors`,
    }

    console.log('[Migration] Result:', result)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[Migration] Error:', error)
    return NextResponse.json(
      { error: 'Migration failed', message: error.message },
      { status: 500 }
    )
  }
}