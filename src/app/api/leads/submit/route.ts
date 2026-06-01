import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, phone, type, building, location, dp, promo } = await request.json()

    const visitor = await db.visitor.create({
      data: {
        date: new Date().toISOString().split('T')[0],
        name: name || '',
        phone: phone || '',
        type: type || '',
        building: building || '',
        location: location || '',
        dp: dp || '',
        promo: promo || '',
        status: 'Baru',
      },
    })

    return NextResponse.json({ success: true, visitor })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 })
  }
}