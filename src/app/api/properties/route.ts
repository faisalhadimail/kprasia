import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, queryCollection, createDocument, deleteDocument, dbQuery } from '@/lib/firestore'

// GET - Fetch all properties with optional filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const kabupaten = searchParams.get('kabupaten')
  const kecamatan = searchParams.get('kecamatan')
  const type = searchParams.get('type')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  try {
    let constraints: any[] = []

    // Add filters based on query params
    if (kabupaten) {
      constraints.push(dbQuery.where('kabupaten', '==', kabupaten))
    }
    if (kecamatan) {
      constraints.push(dbQuery.where('kecamatan', '==', kecamatan))
    }
    if (type) {
      constraints.push(dbQuery.where('type', '==', type))
    }
    if (minPrice) {
      constraints.push(dbQuery.where('price', '>=', Number(minPrice)))
    }
    if (maxPrice) {
      constraints.push(dbQuery.where('price', '<=', Number(maxPrice)))
    }

    // Add ordering by createdAt desc
    constraints.push(dbQuery.orderBy('createdAt', 'desc'))

    // Query with constraints or get all
    let properties: any[]
    if (constraints.length > 0) {
      properties = await queryCollection(COLLECTIONS.PROPERTIES, constraints)
    } else {
      properties = await getCollection(COLLECTIONS.PROPERTIES)
      // Sort manually if no constraints
      properties.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST - Create new property
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Create document in Firestore
    const docId = await createDocument(COLLECTIONS.PROPERTIES, data)

    // Fetch the created document to return complete data
    const createdProperty = await getDocument(COLLECTIONS.PROPERTIES, docId)

    if (!createdProperty) {
      return NextResponse.json(
        { error: 'Failed to retrieve created property' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { id: docId, ...createdProperty },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a property by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    await deleteDocument(COLLECTIONS.PROPERTIES, id)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}