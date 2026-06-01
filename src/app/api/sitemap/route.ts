import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const overrideBaseUrl = searchParams.get('baseUrl')

    const [seoRes, propertiesRes] = await Promise.all([
      supabase.from('SEO').select('*').limit(1).single(),
      supabase.from('Property').select('permalink, updatedAt').neq('permalink', '').order('updatedAt', { ascending: false }),
    ])

    const seo = seoRes.data
    const properties = propertiesRes.data || []

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

    for (const p of properties) {
      urls.push({
        loc: `${baseUrl}/properti/${p.permalink}`,
        lastmod: new Date(p.updatedAt).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8',
      })
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

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return Response.json({ error: 'Gagal generate sitemap' }, { status: 500 })
  }
}
