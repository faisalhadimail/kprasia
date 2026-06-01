import { NextResponse } from 'next/server'
import { COLLECTIONS } from '@/lib/firebase'
import { getCollection, createDocument } from '@/lib/firestore'
import { orderBy } from 'firebase/firestore'

// GET - Get all agents
export async function GET(request: Request) {
  try {
    const agents = await getCollection(COLLECTIONS.AGENTS)
    // Sort by createdAt desc (already ISO strings from helper)
    const sortedAgents = agents.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return NextResponse.json(sortedAgents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// POST - Create new agent
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docId = await createDocument(COLLECTIONS.AGENTS, data)
    // Return the created agent with ID
    const createdAgent = {
      id: docId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(createdAgent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}