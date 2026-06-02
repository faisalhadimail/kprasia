import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/firestore'
import { COLLECTIONS } from '@/lib/firebase'

export async function GET() {
  try {
    const properties = await getCollection(COLLECTIONS.PROPERTIES)
    
    const results = properties.map((p: any) => ({
      id: p.id,
      title: p.title,
      images: p.images,
      imagesCount: Array.isArray(p.images) ? p.images.length : 0,
      imagesType: Array.isArray(p.images) ? 'array' : typeof p.images,
    }))

    return NextResponse.json({
      total: properties.length,
      withImages: results.filter(r => r.imagesCount > 0).length,
      properties: results
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ error: 'Failed to test' }, { status: 500 })
  }
}
