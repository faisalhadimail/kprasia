import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument, queryCollection, dbQuery } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      properties,
      agents,
      promos,
      visitors,
      propertyTypes,
      locations,
      agency,
      seo,
      adminUsers,
      articles,
      reviews,
    ] = await Promise.all([
      queryCollection(COLLECTIONS.PROPERTIES, [dbQuery.orderBy('createdAt', 'desc')]),
      getCollection(COLLECTIONS.AGENTS),
      getCollection(COLLECTIONS.PROMOS),
      queryCollection(COLLECTIONS.VISITORS, [dbQuery.orderBy('createdAt', 'desc')]),
      queryCollection(COLLECTIONS.PROPERTY_TYPES, [dbQuery.orderBy('order', 'asc')]),
      getCollection(COLLECTIONS.LOCATIONS),
      getDocument(COLLECTIONS.AGENCY, 'agency-1'),
      getDocument(COLLECTIONS.SEO, 'seo-1'),
      getCollection(COLLECTIONS.ADMIN_USERS),
      queryCollection(COLLECTIONS.ARTICLES, [dbQuery.orderBy('createdAt', 'desc')]),
      queryCollection(COLLECTIONS.REVIEWS, [dbQuery.orderBy('createdAt', 'desc')]),
    ])

    // Format properties with promo data
    const formattedProperties = properties.map((prop: any) => ({
      ...prop,
      images: Array.isArray(prop.images) ? prop.images : [],
      promos: prop.promoIds
        ? prop.promoIds.map((promoId: string) => promos.find((p: any) => p.id === promoId)).filter(Boolean)
        : [],
    }))

    // Format articles
    const formattedArticles = articles.map((art: any) => ({
      ...art,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    }))

    // Format reviews
    const formattedReviews = reviews.map((rev: any) => ({
      ...rev,
      createdAt: rev.createdAt,
      updatedAt: rev.updatedAt,
    }))

    // Format admin users (exclude password)
    const formattedAdminUsers = adminUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    }))

    return NextResponse.json({
      properties: formattedProperties,
      agents,
      promos,
      visitors,
      propertyTypes,
      locations,
      agency,
      seo,
      adminUsers: formattedAdminUsers,
      articles: formattedArticles,
      reviews: formattedReviews,
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}