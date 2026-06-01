import { NextResponse } from 'next/server'
import { getDocument } from '@/lib/firestore'
import { COLLECTIONS } from '@/lib/firebase'

export async function GET() {
  try {
    // Fetch SEO config from Firestore
    const seo = await getDocument(COLLECTIONS.SEO, 'seo-1')

    // Get robots.txt content or use default
    let robotsContent = seo?.robotsTxt || `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api`

    // Add sitemap line if frontendUrl exists
    if (seo?.frontendUrl) {
      const sitemapLine = `Sitemap: ${seo.frontendUrl.replace(/\/$/, '')}/sitemap.xml`
      if (!robotsContent.includes('Sitemap:')) {
        robotsContent += `\n${sitemapLine}`
      }
    }

    return new NextResponse(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    // Return default robots.txt on error
    const defaultRobots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api`

    return new NextResponse(defaultRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}