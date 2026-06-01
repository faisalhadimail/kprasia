import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, createDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/firestore'

export interface Location {
  id?: string
  kabupaten: string
  kecamatan: string[]
  createdAt?: string
  updatedAt?: string
}

// GET all locations
export async function GET() {
  try {
    const locations = await getCollection<Location>(COLLECTIONS.LOCATIONS)
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST create location
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { kabupaten, kecamatan } = data

    if (!kabupaten) {
      return NextResponse.json(
        { error: 'kabupaten is required' },
        { status: 400 }
      )
    }

    const id = await createDocument(
      COLLECTIONS.LOCATIONS,
      {
        kabupaten,
        kecamatan: kecamatan || [],
      }
    )

    const newLocation = await getDocument<Location>(COLLECTIONS.LOCATIONS, id)
    return NextResponse.json(newLocation, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    )
  }
}