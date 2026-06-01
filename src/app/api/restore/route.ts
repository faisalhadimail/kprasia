import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

/**
 * Helper to delete all rows from a table.
 * PropertyPromo uses composite key (propertyId, promoId), all others use `id`.
 */
async function deleteAllRows(table: string) {
  if (table === 'PropertyPromo') {
    return supabase.from(table).delete().neq('propertyId', '00000000-0000-0000-0000-000000000000')
  }
  return supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

/**
 * POST /api/restore
 * Restores database from a backup JSON file.
 *
 * Accepts JSON body with _meta + table data (same format as /api/backup output).
 *
 * Strategy:
 * 1. Validate the backup format
 * 2. Clear all existing data (in reverse dependency order)
 * 3. Insert data in dependency order
 * 4. Return summary of restored records
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate backup format
    if (!body._meta || !body._meta.version || !body._meta.tables) {
      return NextResponse.json(
        { error: 'Format backup tidak valid. File harus mengandung _meta dengan version dan tables.' },
        { status: 400 }
      )
    }

    const tableNames = [
      'Agency', 'SEO', 'PropertyType', 'Location', 'Promo',
      'Agent', 'AdminUser', 'Property', 'PropertyPromo', 'Visitor',
      'Article', 'Review',
    ] as const

    // Validate all expected tables exist
    const missingTables = tableNames.filter((t) => !(t in body))
    if (missingTables.length > 0) {
      return NextResponse.json(
        { error: `Tabel tidak lengkap: ${missingTables.join(', ')} tidak ditemukan dalam file backup.` },
        { status: 400 }
      )
    }

    const results: Record<string, { deleted: number; inserted: number; error?: string }> = {}

    // Step 1: Delete all data in REVERSE dependency order (dependents first)
    const deleteOrder = [
      'PropertyPromo', 'Review', 'Visitor', 'Property', 'Agent', 'AdminUser',
      'Article', 'Promo', 'Location', 'PropertyType', 'SEO', 'Agency',
    ]

    for (const table of deleteOrder) {
      const { count, error } = await deleteAllRows(table)

      if (error) {
        console.error(`Delete ${table} error:`, error)
        return NextResponse.json(
          { error: `Gagal mengosongkan tabel ${table}: ${error.message}` },
          { status: 500 }
        )
      }
      results[table] = { deleted: count ?? 0, inserted: 0 }
    }

    // Step 2: Insert data in DEPENDENCY order (independent first)
    const insertOrder = [
      'Agency', 'SEO', 'PropertyType', 'Location', 'Promo',
      'Agent', 'AdminUser', 'Article', 'Property', 'PropertyPromo', 'Visitor', 'Review',
    ]

    for (const table of insertOrder) {
      const data = body[table]
      if (!data || !Array.isArray(data) || data.length === 0) {
        results[table].inserted = 0
        continue
      }

      // Clean up data: remove auto-generated fields that might conflict
      const cleanedData = data.map((row: Record<string, unknown>) => {
        const { createdAt, updatedAt, ...rest } = row
        return rest
      })

      const { error, count } = await supabase
        .from(table)
        .insert(cleanedData)

      if (error) {
        console.error(`Insert ${table} error:`, error)
        results[table].error = error.message
        // Continue with other tables instead of failing completely
        continue
      }

      results[table].inserted = count ?? data.length
    }

    // Check for any errors
    const failedTables = Object.entries(results)
      .filter(([, r]) => r.error)
      .map(([t]) => t)

    // Invalidate seed-data cache
    try {
      const { invalidateCache } = await import('@/lib/cache')
      invalidateCache()
    } catch { /* ignore */ }

    return NextResponse.json({
      success: failedTables.length === 0,
      message: failedTables.length > 0
        ? `Restore selesai dengan ${failedTables.length} tabel gagal: ${failedTables.join(', ')}`
        : 'Restore berhasil! Semua data telah dipulihkan.',
      meta: body._meta,
      results,
      failedTables: failedTables.length > 0 ? failedTables : undefined,
    })
  } catch (error) {
    console.error('Restore failed:', error)
    return NextResponse.json(
      { error: 'Gagal restore: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
