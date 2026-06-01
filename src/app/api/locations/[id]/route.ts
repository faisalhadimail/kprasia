import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'

export interface Location {
  id?: string
  kabupaten: string
  kecamatan: string[]
  createdAt?: string
  updatedAt?: string
}

// GET location by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const location = await getDocument<Location>(COLLECTIONS.LOCATIONS, id)

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}

// PUT update location
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { kabupaten, kecamatan } = body

    // Build update object with only provided fields
    const updateFields: Partial<Location> = {}
    if (kabupaten !== undefined) updateFields.kabupaten = kabupaten
    if (kecamatan !== undefined) updateFields.kecamatan = kecamatan

    // Update document
    await updateDocument(COLLECTIONS.LOCATIONS, id, updateFields)

    // Fetch and return updated document
    const updatedLocation = await getDocument<Location>(COLLECTIONS.LOCATIONS, id)
    return NextResponse.json(updatedLocation)
  } catch (error) {
    console.error('Error updating location:', error)
    const message = error instanceof Error ? error.message : 'Failed to update location'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE location
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteDocument(COLLECTIONS.LOCATIONS, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete location'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
