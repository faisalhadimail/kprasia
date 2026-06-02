import { NextRequest, NextResponse } from 'next/server'
import { getDocument, getCollection } from '@/lib/firestore'
import { COLLECTIONS } from '@/lib/firebase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const overrideBaseUrl = searchParams.get('baseUrl')

    // Fetch SEO config and properties from Firestore
    const [seo, properties] = await Promise.all([
      getDocument(COLLECTIONS.SEO, 'seo-1').catch(() => null),
      getCollection(COLLECTIONS.PROPERTIES).catch(() => []),
    ])

    const baseUrl = overrideBaseUrl
      ? overrideBaseUrl.replace(/\/+$/, '')
      : seo?.frontendUrl?.replace(/\/+$/, '') || 'https://propertihub.com'

    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0',
      },
    ]

    // Add property URLs
    for (const p of properties) {
      if (p.permalink) {
        urls.push({
          loc: `${baseUrl}/properti/${p.permalink}`,
          lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
        })
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return NextResponse.json({ error: 'Gagal generate sitemap' }, { status: 500 })
  }
}