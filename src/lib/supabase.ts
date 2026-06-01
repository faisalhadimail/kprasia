import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
)

/**
 * Helper to safely parse JSON fields that may come as arrays (JSONB) or strings (TEXT).
 * Supabase JSONB columns return native JS arrays/objects.
 */
export function parseJsonField<T>(value: unknown): T {
  if (Array.isArray(value)) return value as T
  if (value && typeof value === 'object') return value as T
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return [] as unknown as T }
  }
  return [] as unknown as T
}

/**
 * Helper to extract promo objects from PropertyPromo join query result.
 * Supabase returns: PropertyPromo: [{ promoId, promo: {...} }]
 * We need: promos: [{ id, badge, title, subtitle }]
 */
export function extractPromos(propertyPromo: Array<{ promoId?: string; promo?: Record<string, unknown> }> | null): Array<{ id: string; badge: string; title: string; subtitle: string }> {
  if (!propertyPromo) return []
  return propertyPromo
    .map((pp) => pp.promo)
    .filter((p): p is Record<string, unknown> => !!p)
    .map((p) => ({
      id: String(p.id || ''),
      badge: String(p.badge || 'PROMO'),
      title: String(p.title || ''),
      subtitle: String(p.subtitle || ''),
    }))
}
