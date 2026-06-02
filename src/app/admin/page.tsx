'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/propertihub'

export default function AdminPage() {
  const navigate = useStore((state) => state.navigate)

  useEffect(() => {
    // Navigate to admin login screen on mount
    navigate('admin-login')
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Mengalihkan ke Admin Panel...</p>
      </div>
    </div>
  )
}