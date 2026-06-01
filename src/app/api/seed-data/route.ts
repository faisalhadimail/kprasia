import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, getDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[seed-data] Starting to fetch data...')

    // Fetch collections with fallback to empty arrays if queries fail
    const properties = await getCollection(COLLECTIONS.PROPERTIES).catch(e => {
      console.error('[seed-data] Properties error:', e)
      return []
    })

    const agents = await getCollection(COLLECTIONS.AGENTS).catch(e => {
      console.error('[seed-data] Agents error:', e)
      return []
    })

    const promos = await getCollection(COLLECTIONS.PROMOS).catch(e => {
      console.error('[seed-data] Promos error:', e)
      return []
    })

    const visitors = await getCollection(COLLECTIONS.VISITORS).catch(e => {
      console.error('[seed-data] Visitors error:', e)
      return []
    })

    const propertyTypes = await getCollection(COLLECTIONS.PROPERTY_TYPES).catch(e => {
      console.error('[seed-data] Property types error:', e)
      return []
    })

    const locations = await getCollection(COLLECTIONS.LOCATIONS).catch(e => {
      console.error('[seed-data] Locations error:', e)
      return []
    })

    const agency = await getDocument(COLLECTIONS.AGENCY, 'agency-1').catch(e => {
      console.error('[seed-data] Agency error:', e)
      return null
    })

    const seo = await getDocument(COLLECTIONS.SEO, 'seo-1').catch(e => {
      console.error('[seed-data] SEO error:', e)
      return null
    })

    const adminUsers = await getCollection(COLLECTIONS.ADMIN_USERS).catch(e => {
      console.error('[seed-data] Admin users error:', e)
      return []
    })

    const articles = await getCollection(COLLECTIONS.ARTICLES).catch(e => {
      console.error('[seed-data] Articles error:', e)
      return []
    })

    const reviews = await getCollection(COLLECTIONS.REVIEWS).catch(e => {
      console.error('[seed-data] Reviews error:', e)
      return []
    })

    console.log('[seed-data] Data fetched successfully')

    // Sort properties manually (client-side sorting instead of query orderBy)
    const sortedProperties = properties.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // Sort visitors manually
    const sortedVisitors = visitors.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // Sort property types by order
    const sortedPropertyTypes = propertyTypes.sort((a: any, b: any) => {
      return (a.order || 0) - (b.order || 0)
    })

    // Sort articles manually
    const sortedArticles = articles.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // Sort reviews manually
    const sortedReviews = reviews.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // Format properties with promo data
    const formattedProperties = sortedProperties.map((prop: any) => {
      // Handle images that might be stored as JSON string or already as array
      let images: string[] = []
      if (Array.isArray(prop.images)) {
        images = prop.images
      } else if (typeof prop.images === 'string') {
        try {
          images = JSON.parse(prop.images)
        } catch {
          // Try comma-separated fallback
          images = prop.images.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        }
      }

      return {
        ...prop,
        images,
        promos: prop.promoIds
          ? prop.promoIds.map((promoId: string) => promos.find((p: any) => p.id === promoId)).filter(Boolean)
          : [],
      }
    })

    // Format articles
    const formattedArticles = sortedArticles.map((art: any) => ({
      ...art,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    }))

    // Format reviews
    const formattedReviews = sortedReviews.map((rev: any) => ({
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
      visitors: sortedVisitors,
      propertyTypes: sortedPropertyTypes,
      locations,
      agency,
      seo,
      adminUsers: formattedAdminUsers,
      articles: formattedArticles,
      reviews: formattedReviews,
    })
  } catch (error: any) {
    console.error('[seed-data] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error.message },
      { status: 500 }
    )
  }
}