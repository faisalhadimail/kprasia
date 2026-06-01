import { NextRequest, NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getDocument, updateDocument, deleteDocument } from '@/lib/firestore'

// GET - Get agent by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const agent = await getDocument(COLLECTIONS.AGENTS, id)

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
  }
}

// PUT - Update agent
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Check if agent exists first
    const existingAgent = await getDocument(COLLECTIONS.AGENTS, id)
    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update the document
    await updateDocument(COLLECTIONS.AGENTS, id, body)

    // Fetch updated agent
    const updatedAgent = await getDocument(COLLECTIONS.AGENTS, id)
    return NextResponse.json(updatedAgent)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}

// DELETE - Delete agent
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if agent exists first
    const existingAgent = await getDocument(COLLECTIONS.AGENTS, id)
    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    await deleteDocument(COLLECTIONS.AGENTS, id)
    return NextResponse.json({ success: true, message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}
