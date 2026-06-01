import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

/**
 * GET /api/backup
 * Exports ALL database tables as a single JSON file.
 * Returns JSON with metadata (timestamp, version, table counts) and all table data.
 * Tables are exported in dependency order (no foreign keys first, then dependent).
 * Gracefully handles missing tables (Article, Review).
 */
export async function GET() {
  try {
    // Fetch all tables in parallel
    const [
      agencyRes,
      seoRes,
      propertyTypesRes,
      locationsRes,
      propertiesRes,
      propertyPromosRes,
      promosRes,
      agentsRes,
      visitorsRes,
      adminUsersRes,
      articlesRes,
      reviewsRes,
    ] = await Promise.all([
      supabase.from('Agency').select('*'),
      supabase.from('SEO').select('*'),
      supabase.from('PropertyType').select('*').order('order', { ascending: true }),
      supabase.from('Location').select('*').order('kabupaten', { ascending: true }),
      supabase.from('Property').select('*').order('createdAt', { ascending: false }),
      supabase.from('PropertyPromo').select('*'),
      supabase.from('Promo').select('*').order('id', { ascending: true }),
      supabase.from('Agent').select('*').order('createdAt', { ascending: false }),
      supabase.from('Visitor').select('*').order('createdAt', { ascending: false }),
      supabase.from('AdminUser').select('*').order('createdAt', { ascending: false }),
      supabase.from('Article').select('*').order('createdAt', { ascending: false }),
      supabase.from('Review').select('*').order('createdAt', { ascending: false }),
    ])

    // Check for Supabase errors - skip tables that don't exist
    const tables: Record<string, any[]> = {}
    for (const [name, res] of [
      ['Agency', agencyRes],
      ['SEO', seoRes],
      ['PropertyType', propertyTypesRes],
      ['Location', locationsRes],
      ['Property', propertiesRes],
      ['PropertyPromo', propertyPromosRes],
      ['Promo', promosRes],
      ['Agent', agentsRes],
      ['Visitor', visitorsRes],
      ['AdminUser', adminUsersRes],
      ['Article', articlesRes],
      ['Review', reviewsRes],
    ] as const) {
      if (res.error) {
        const errorMsg = res.error.message || ''
        // Skip tables that don't exist (Article, Review)
        if (errorMsg.includes('does not exist') || errorMsg.includes('Could not find the table')) {
          tables[name] = []
          continue
        }
        console.error(`Backup error on ${name}:`, res.error)
        return NextResponse.json(
          { error: `Gagal membaca tabel ${name}: ${res.error.message}` },
          { status: 500 }
        )
      }
      tables[name] = res.data ?? []
    }

    const backup = {
      _meta: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        exportedBy: 'PropertiHub Backup System',
        tables: {
          Agency: tables.Agency?.length ?? 0,
          SEO: tables.SEO?.length ?? 0,
          PropertyType: tables.PropertyType?.length ?? 0,
          Location: tables.Location?.length ?? 0,
          Property: tables.Property?.length ?? 0,
          PropertyPromo: tables.PropertyPromo?.length ?? 0,
          Promo: tables.Promo?.length ?? 0,
          Agent: tables.Agent?.length ?? 0,
          Visitor: tables.Visitor?.length ?? 0,
          AdminUser: tables.AdminUser?.length ?? 0,
          Article: tables.Article?.length ?? 0,
          Review: tables.Review?.length ?? 0,
        },
        totalRows: Object.values(tables).reduce((sum, d) => sum + (d?.length ?? 0), 0),
      },
      // Order: independent tables first, then dependent
      Agency: tables.Agency,
      SEO: tables.SEO,
      PropertyType: tables.PropertyType,
      Location: tables.Location,
      Promo: tables.Promo,
      Agent: tables.Agent,
      AdminUser: tables.AdminUser,
      Property: tables.Property,
      PropertyPromo: tables.PropertyPromo,
      Visitor: tables.Visitor,
      Article: tables.Article,
      Review: tables.Review,
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="propertihub-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return NextResponse.json(
      { error: 'Gagal membuat backup: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
