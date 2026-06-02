import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  const results: any[] = []

  try {
    // Check if AdminUser table exists by trying to query it
    try {
      const adminCount = await db.adminUser.count()
      results.push({
        table: 'AdminUser',
        count: adminCount,
        status: 'OK'
      })
    } catch (error: any) {
      results.push({
        table: 'AdminUser',
        status: 'NOT FOUND',
        error: error.message
      })
    }

    // Check if Visitor table exists
    try {
      const visitorCount = await db.visitor.count()
      results.push({
        table: 'Visitor',
        count: visitorCount,
        status: 'OK'
      })
    } catch (error: any) {
      results.push({
        table: 'Visitor',
        status: 'NOT FOUND',
        error: error.message
      })
    }

    // Check if tables need to be created
    const hasErrors = results.some((r: any) => r.status === 'NOT FOUND')

    if (hasErrors) {
      return NextResponse.json({
        success: false,
        message: 'Database tables not found',
        results,
        instructions: [
          '1. Run: bun run db:push (to create tables from Prisma schema)',
          '2. Run: bun run db:seed (to insert sample data)',
          '3. Refresh halaman ini untuk cek status'
        ]
      })
    }

    // Check if data exists
    const adminCount = results.find((r: any) => r.table === 'AdminUser')?.count || 0
    const visitorCount = results.find((r: any) => r.table === 'Visitor')?.count || 0

    if (adminCount === 0 || visitorCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tables exist but no data',
        results: {
          adminCount,
          visitorCount
        },
        instructions: [
          'Run: bun run db:seed (to insert sample data)'
        ]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database is ready!',
      results: {
        adminCount,
        visitorCount
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results
    }, { status: 500 })
  }
}