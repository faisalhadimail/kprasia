import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, createDocument, updateDocument, deleteDocument, queryCollection, dbQuery } from '@/lib/firestore'

// GET - Fetch all visitors
export async function GET() {
  try {
    const visitors = await queryCollection(
      COLLECTIONS.VISITORS,
      [dbQuery.orderBy('createdAt', 'desc')]
    )
    return NextResponse.json(visitors)
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 })
  }
}

// POST - Create new visitor
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docId = await createDocument(COLLECTIONS.VISITORS, data)

    // Fetch the created document to return complete data
    const createdVisitor = await getCollection(COLLECTIONS.VISITORS).then(visitors =>
      visitors.find((v: any) => v.id === docId)
    )

    return NextResponse.json(
      { id: docId, ...createdVisitor, ...data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating visitor:', error)
    return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 })
  }
}

// PUT - Update visitor status
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    await updateDocument(COLLECTIONS.VISITORS, id, { status })
    return NextResponse.json({ id, status, success: true })
  } catch (error) {
    console.error('Error updating visitor:', error)
    return NextResponse.json({ error: 'Failed to update visitor' }, { status: 500 })
  }
}

// DELETE - Delete visitor by id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await deleteDocument(COLLECTIONS.VISITORS, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting visitor:', error)
    return NextResponse.json({ error: 'Failed to delete visitor' }, { status: 500 })
  }
}