import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, createDocument, updateDocument } from '@/lib/firestore'

// GET - Fetch SEO settings (single document)
export async function GET() {
  try {
    const seo = await getDocument(COLLECTIONS.SEO, 'seo-1')
    if (!seo) {
      return NextResponse.json(
        {
          id: 'seo-1',
          frontendUrl: '',
          title: 'PropertiHub - Temukan Hunian Impian Anda',
          description: 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
          keywords: 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        },
        { status: 200 }
      )
    }
    return NextResponse.json(seo)
  } catch (error) {
    console.error('Error fetching SEO:', error)
    return NextResponse.json({ error: 'Failed to fetch SEO' }, { status: 500 })
  }
}

// PUT - Update or create SEO settings
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const existing = await getDocument(COLLECTIONS.SEO, 'seo-1')

    if (existing) {
      await updateDocument(COLLECTIONS.SEO, 'seo-1', data)
      const updated = await getDocument(COLLECTIONS.SEO, 'seo-1')
      return NextResponse.json(updated)
    } else {
      const docId = await createDocument(COLLECTIONS.SEO, {
        id: 'seo-1',
        ...data,
      })
      const created = await getDocument(COLLECTIONS.SEO, docId)
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('Error updating SEO:', error)
    return NextResponse.json({ error: 'Failed to update SEO' }, { status: 500 })
  }
}