import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { invalidateCache } from '@/lib/cache'

/**
 * Helper to delete all rows from a table.
 * PropertyPromo uses composite key (propertyId, promoId), all others use `id`.
 */
async function deleteAllRows(table: string): Promise<{ count: number | null; error: null | { message: string } }> {
  if (table === 'PropertyPromo') {
    return supabase.from(table).delete().neq('propertyId', '00000000-0000-0000-0000-000000000000')
  }
  return supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

/**
 * POST /api/clear-database
 * Deletes ALL data from all tables. Used by the Danger Zone in admin settings.
 * Deletes in reverse dependency order to avoid foreign key violations.
 * Gracefully handles missing tables (Article, Review).
 */
export async function POST() {
  const deleteOrder = [
    'PropertyPromo', 'Review', 'Visitor', 'Property', 'Agent', 'AdminUser',
    'Article', 'Promo', 'Location', 'PropertyType', 'SEO', 'Agency',
  ]

  const results: Record<string, number | { error: string }> = {}

  for (const table of deleteOrder) {
    try {
      const { count, error } = await deleteAllRows(table)
      if (error) {
        console.error(`Clear ${table} error:`, error)
        // Skip tables that don't exist (Article, Review)
        const errorMsg = error.message || ''
        if (errorMsg.includes('does not exist') || errorMsg.includes('Could not find the table')) {
          results[table] = 0
          continue
        }
        results[table] = { error: error.message }
        continue
      }
      results[table] = count ?? 0
    } catch (err) {
      console.error(`Clear ${table} exception:`, err)
      results[table] = { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  // Invalidate cache
  invalidateCache()

  const totalDeleted = Object.values(results).reduce((a, b) => {
    const val = typeof b === 'number' ? b : (typeof b === 'object' && 'count' in b && typeof b.count === 'number' ? b.count : 0)
    return a + val
  }, 0)

  const failed = Object.entries(results).filter(([, r]) => typeof r === 'object' && 'error' in r)

  if (failed.length > 0) {
    return NextResponse.json({
      success: false,
      message: `Beberapa tabel gagal dikosongkan.`,
      details: results,
      failed: failed.map(([t]) => t),
    }, { status: 207 }) // 207 Multi-Status
  }

  return NextResponse.json({
    success: true,
    message: `Semua data berhasil dihapus (${totalDeleted} baris)`,
    details: results,
  })
}
