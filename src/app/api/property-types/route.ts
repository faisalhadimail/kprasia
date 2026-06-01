import { COLLECTIONS } from '@/lib/firebase'
import { queryCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/firestore'

export interface PropertyType {
  id?: string
  name: string
  icon?: string
  order: number
  createdAt?: string
  updatedAt?: string
}

// GET all property types (ordered by 'order' field)
export async function GET() {
  try {
    const propertyTypes = await queryCollection<PropertyType>(
      COLLECTIONS.PROPERTY_TYPES,
      [dbQuery.orderBy('order', 'asc')]
    )
    return NextResponse.json(propertyTypes)
  } catch (error) {
    console.error('Error fetching property types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property types' },
      { status: 500 }
    )
  }
}

// POST create property type
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { id, name, icon, order } = data

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }

    if (order === undefined || order === null) {
      return NextResponse.json(
        { error: 'order is required' },
        { status: 400 }
      )
    }

    // If id is provided, update existing property type
    if (id) {
      const updateFields: Partial<PropertyType> = {}
      if (name !== undefined) updateFields.name = name
      if (icon !== undefined) updateFields.icon = icon
      if (order !== undefined) updateFields.order = order

      await updateDocument(COLLECTIONS.PROPERTY_TYPES, id, updateFields)
      return NextResponse.json({ id, ...updateFields }, { status: 200 })
    }

    // Otherwise create new property type
    const newId = await createDocument(COLLECTIONS.PROPERTY_TYPES, {
      name,
      icon,
      order,
    })

    const newPropertyType = await queryCollection<PropertyType>(
      COLLECTIONS.PROPERTY_TYPES,
      [dbQuery.where('__name__', '==', newId)]
    )

    return NextResponse.json(newPropertyType[0], { status: 201 })
  } catch (error) {
    console.error('Error saving property type:', error)
    return NextResponse.json(
      { error: 'Failed to save property type' },
      { status: 500 }
    )
  }
}

// DELETE property type by query parameter ?id=
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    await deleteDocument(COLLECTIONS.PROPERTY_TYPES, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property type:', error)
    return NextResponse.json(
      { error: 'Failed to delete property type' },
      { status: 500 }
    )
  }
}