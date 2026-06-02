import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, createDocument, updateDocument } from '@/lib/firestore'

// GET - Fetch agency settings (single document)
export async function GET() {
  try {
    const agency = await getDocument(COLLECTIONS.AGENCY, 'agency-1')
    if (!agency) {
      return NextResponse.json(
        {
          id: 'agency-1',
          name: 'PropertiHub',
          phone: '',
          address: '',
          kprInterest: 5.5,
        },
        { status: 200 }
      )
    }
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json({ error: 'Failed to fetch agency' }, { status: 500 })
  }
}

// PUT - Update or create agency settings
export async function PUT(request: Request) {
  try {
    const data = await request.json()

    // Remove 'id' from data - Firebase document ID is separate
    const { id, ...dataWithoutId } = data

    const existing = await getDocument(COLLECTIONS.AGENCY, 'agency-1')

    if (existing) {
      await updateDocument(COLLECTIONS.AGENCY, 'agency-1', dataWithoutId)
      const updated = await getDocument(COLLECTIONS.AGENCY, 'agency-1')
      return NextResponse.json(updated)
    } else {
      // Create with explicit ID
      const docId = await createDocument(COLLECTIONS.AGENCY, dataWithoutId, 'agency-1')
      const created = await getDocument(COLLECTIONS.AGENCY, docId)
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('Error updating agency:', error)
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 })
  }
}