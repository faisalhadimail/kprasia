import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, createDocument, deleteDocument } from '@/lib/firestore'

// GET - Fetch all promos or single by query param id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const promo = await getDocument(COLLECTIONS.PROMOS, id)
      if (!promo) {
        return NextResponse.json({ error: 'Promo not found' }, { status: 404 })
      }
      return NextResponse.json(promo)
    }

    const promos = await getCollection(COLLECTIONS.PROMOS)
    // Sort by createdAt asc
    const sortedPromos = promos.sort((a: any, b: any) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    return NextResponse.json(sortedPromos)
  } catch (error) {
    console.error('Error fetching promos:', error)
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 })
  }
}

// POST - Create new promo
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Remove 'id' from data - Firebase document ID is separate
    const { id, ...dataWithoutId } = data

    const docId = await createDocument(COLLECTIONS.PROMOS, dataWithoutId)

    // Fetch the created document to return complete data
    const createdPromo = await getDocument(COLLECTIONS.PROMOS, docId)

    if (!createdPromo) {
      return NextResponse.json(
        { error: 'Failed to retrieve created promo' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { id: docId, ...createdPromo },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating promo:', error)
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 })
  }
}

// DELETE - Delete promo by id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await deleteDocument(COLLECTIONS.PROMOS, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo:', error)
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 })
  }
}