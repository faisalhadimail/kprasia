'use client'

import { useState } from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store/propertihub'

export default function AdminPage() {
  const { login, showModal } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!username || !password) {
      showModal('Mohon isi username dan password.')
      return
    }
    const success = await login(username, password)
    if (success) {
      // Set flag for admin login
      localStorage.setItem('propertihub_admin_login', 'true')
      // Redirect to home page - admin dashboard will be shown there
      window.location.href = '/'
    } else {
      showModal('Login gagal. Periksa username dan password.')
    }
  }

  const handleBack = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Admin Login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PropertiHub Panel</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  )
}