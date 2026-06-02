import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/firestore'

export async function GET() {
  try {
    // Fetch all data from Firebase collections
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
      getCollection('properties'),
      getCollection('agents'),
      getCollection('promos'),
      getCollection('visitors'),
      getCollection('propertyTypes'),
      getCollection('locations'),
      getCollection('agency').then(docs => docs[0] || null),
      getCollection('seo').then(docs => docs[0] || null),
      getCollection('adminUsers'),
      getCollection('articles'),
      getCollection('reviews'),
    ])

    return NextResponse.json({
      properties: properties || [],
      agents: agents || [],
      promos: promos || [],
      visitors: visitors || [],
      propertyTypes: propertyTypes || [],
      locations: locations || [],
      agency: agency || null,
      seo: seo || null,
      adminUsers: adminUsers || [],
      articles: articles || [],
      reviews: reviews || [],
    })
  } catch (error: any) {
    console.error('Error fetching data from Firebase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error.message },
      { status: 500 }
    )
  }
}