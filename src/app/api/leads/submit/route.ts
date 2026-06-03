import { COLLECTIONS } from '@/lib/firebase'
import { createDocument, getCollection } from '@/lib/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, type, building, location, dp, promo } = await req.json()

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nama dan nomor telepon wajib diisi' },
        { status: 400 }
      )
    }

    // Create lead ID with timestamp
    const leadId = `lead-${Date.now()}`

    // Create lead document in VISITORS collection
    const leadData = {
      name: name || '',
      phone: phone || '',
      type: type || '',
      building: building || '',
      location: location || '',
      dp: dp || '',
      promo: promo || '',
      status: 'Baru',
      date: new Date().toISOString().split('T')[0],
    }

    await createDocument(COLLECTIONS.VISITORS, leadData, leadId)

    console.log('[POST /api/leads/submit] Lead created successfully:', leadId, leadData)

    return NextResponse.json({
      success: true,
      data: {
        id: leadId,
        ...leadData,
      },
    })
  } catch (error: any) {
    console.error('[POST /api/leads/submit] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal mengirim pencarian' },
      { status: 500 }
    )
  }
}