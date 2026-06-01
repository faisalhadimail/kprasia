import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument, queryCollection } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/firestore'

export interface PropertyType {
  id?: string
  name: string
  icon?: string
  order: number
  createdAt?: string
  updatedAt?: string
}

// GET property type by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyType = await getDocument<PropertyType>(
      COLLECTIONS.PROPERTY_TYPES,
      id
    )

    if (!propertyType) {
      return NextResponse.json(
        { error: 'Property type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(propertyType)
  } catch (error) {
    console.error('Error fetching property type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property type' },
      { status: 500 }
    )
  }
}

// PUT update property type
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, icon, order } = body

    // Build update object with only provided fields
    const updateFields: Partial<PropertyType> = {}
    if (name !== undefined) updateFields.name = name
    if (icon !== undefined) updateFields.icon = icon
    if (order !== undefined) updateFields.order = order

    // Update document
    await updateDocument(COLLECTIONS.PROPERTY_TYPES, id, updateFields)

    // Fetch and return updated document
    const updatedPropertyType = await getDocument<PropertyType>(
      COLLECTIONS.PROPERTY_TYPES,
      id
    )
    return NextResponse.json(updatedPropertyType)
  } catch (error) {
    console.error('Error updating property type:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to update property type'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE property type
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteDocument(COLLECTIONS.PROPERTY_TYPES, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property type:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to delete property type'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
