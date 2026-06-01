import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'

// GET - Fetch all articles or single by query param id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const article = await getDocument(COLLECTIONS.ARTICLES, id)
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      return NextResponse.json(article)
    }

    const articles = await getCollection(COLLECTIONS.ARTICLES)
    // Sort by createdAt desc
    const sortedArticles = articles.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return NextResponse.json(sortedArticles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// POST - Create new article
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docId = await createDocument(COLLECTIONS.ARTICLES, data)

    // Fetch the created document to return complete data
    const createdArticle = await getDocument(COLLECTIONS.ARTICLES, docId)

    if (!createdArticle) {
      return NextResponse.json(
        { error: 'Failed to retrieve created article' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { id: docId, ...createdArticle },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

// DELETE - Delete article by id
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await deleteDocument(COLLECTIONS.ARTICLES, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}