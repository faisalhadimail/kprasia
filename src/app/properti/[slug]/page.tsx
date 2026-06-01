'use client'

import { useParams } from 'next/navigation'
import { AppContent } from '@/app/page'

export default function PropertiSlugPage() {
  const params = useParams()
  const slug = params.slug as string

  return <AppContent initialSlug={slug} />
}
