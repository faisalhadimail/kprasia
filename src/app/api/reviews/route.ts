import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'

// GET - Fetch all reviews or single by query param id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const review = await getDocument(COLLECTIONS.REVIEWS, id)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      return NextResponse.json(review)
    }

    const reviews = await getCollection(COLLECTIONS.REVIEWS)
    // Sort by createdAt desc
    const sortedReviews = reviews.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return NextResponse.json(sortedReviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST - Create new review
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docId = await createDocument(COLLECTIONS.REVIEWS, data)

    // Fetch the created document to return complete data
    const createdReview = await getDocument(COLLECTIONS.REVIEWS, docId)

    if (!createdReview) {
      return NextResponse.json(
        { error: 'Failed to retrieve created review' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { id: docId, ...createdReview },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

// DELETE - Delete review by id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await deleteDocument(COLLECTIONS.REVIEWS, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}