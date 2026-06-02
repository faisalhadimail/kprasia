import { create } from 'zustand'

export interface Property {
  id: string
  title: string
  price: number
  dp: number
  allInCost: number
  kabupaten: string
  kecamatan: string
  type: string
  buildingType: string
  description: string
  images: string[]
  brochure: string
  permalink: string
  seoTitle: string
  seoDesc: string
  seoKeywords: string
  seoAuto: boolean
  promos?: Promo[]
  createdAt: string
}

export interface Promo {
  id: string
  badge: string
  title: string
  subtitle: string
}

export interface Agent {
  id: string
  name: string
  role: string
  phone: string
  image: string
}

export interface Visitor {
  id: string
  date: string
  name: string
  phone: string
  type: string
  building: string
  location: string
  dp: string
  promo: string
  status: string
}

export interface PropertyType {
  id: string
  name: string
  icon: string
  order: number
}

export interface Location {
  id: string
  kabupaten: string
  kecamatan: string[]
}

export interface Agency {
  id: string
  name: string
  phone: string
  address: string
  kprInterest: number
}

export interface SEO {
  id: string
  frontendUrl: string
  title: string
  description: string
  keywords: string
  image: string
  robotsTxt?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  customHeadScript?: string
  customBodyScript?: string
}

export interface AdminUser {
  id: string
  name: string
  username: string
  role: string
}

export interface Article {
  id: string
  title: string
  slug: string
  image: string
  author: string
  category: string
  excerpt: string
  content: string
  published: boolean
  seoTitle: string
  seoDesc: string
  seoKeywords: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  name: string
  phone: string
  rating: number
  review: string
  propertyId: string
  image: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type Screen =
  | 'front-home'
  | 'front-search'
  | 'front-all-properties'
  | 'front-detail'
  | 'front-agents'
  | 'front-articles'
  | 'front-article-detail'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-listing'
  | 'admin-property-form'
  | 'admin-detail'
  | 'admin-visitors'
  | 'admin-agents'
  | 'admin-agent-form'
  | 'admin-promos'
  | 'admin-promo-form'
  | 'admin-settings'
  | 'admin-users'
  | 'admin-user-form'
  | 'admin-locations'
  | 'admin-location-form'
  | 'admin-property-types'
  | 'admin-property-type-form'
  | 'admin-agency-form'
  | 'admin-seo-form'
  | 'admin-backup-restore'
  | 'admin-theme'
  | 'admin-articles'
  | 'admin-article-form'
  | 'admin-reviews'
  | 'admin-review-form'

interface AppState {
  // Navigation
  screen: Screen
  previousScreen: Screen
  navigate: (target: Screen) => void
  goBack: () => void

  // Theme
  isDark: boolean
  toggleDark: () => void

  // Auth
  isAdmin: boolean
  adminUser: AdminUser | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void

  // Data
  properties: Property[]
  agents: Agent[]
  promos: Promo[]
  visitors: Visitor[]
  propertyTypes: PropertyType[]
  locations: Location[]
  agency: Agency | null
  seo: SEO | null
  adminUsers: AdminUser[]
  articles: Article[]
  reviews: Review[]

  // Selected items
  selectedPropertyId: string | null
  editingPropertyId: string | null
  editingAgentId: string | null
  editingPromoId: string | null
  editingUserId: string | null
  editingLocationId: string | null
  editingPropertyTypeId: string | null
  editingArticleId: string | null
  editingReviewId: string | null
  selectedArticleId: string | null

  // Filters
  frontFilters: { type: string; kabupaten: string; kecamatan: string }
  adminFilters: { type: string; kabupaten: string; kecamatan: string }
  allPropertiesPage: number

  // KPR
  kprDp: number
  kprYears: number

  // Loading
  isLoading: boolean
  loadingText: string
  showLoading: (text?: string) => void
  hideLoading: () => void

  // Modal
  modalMessage: string
  modalIsConfirm: boolean
  modalOnConfirm: (() => void) | undefined
  showModal: (message: string, isConfirm?: boolean, onConfirm?: () => void) => void
  closeModal: () => void

  // Bulk upload
  showBulkUpload: boolean
  toggleBulkUpload: () => void

  // Data fetching
  fetchAllData: () => Promise<void>

  // Actions
  saveProperty: (data: any) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  saveAgent: (data: any) => Promise<void>
  deleteAgent: (id: string) => Promise<void>
  savePromo: (data: any) => Promise<void>
  deletePromo: (id: string) => Promise<void>
  saveVisitor: (data: any) => Promise<void>
  updateVisitorStatus: (id: string, status: string) => Promise<void>
  deleteVisitor: (id: string) => Promise<void>
  saveLocation: (data: any) => Promise<void>
  deleteLocation: (id: string) => Promise<void>
  savePropertyType: (data: any) => Promise<void>
  deletePropertyType: (id: string) => Promise<void>
  saveUser: (data: any) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  saveAgency: (data: any) => Promise<void>
  saveSEO: (data: any) => Promise<void>
  saveArticle: (data: any) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  saveReview: (data: any) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  submitLead: (data: any) => Promise<void>
}

const parseImages = (images: any): string[] => {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try { return JSON.parse(images) } catch { return [] }
  }
  return []
}

const parseKecamatan = (kecamatan: any): string[] => {
  if (Array.isArray(kecamatan)) return kecamatan
  if (typeof kecamatan === 'string') {
    try { return JSON.parse(kecamatan) } catch { return [] }
  }
  return []
}

const extractData = (res: any) => {
  if (res?.data) return res.data
  return res
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  screen: 'front-home',
  previousScreen: 'front-home',
  navigate: (target) => set((s) => ({ screen: target, previousScreen: s.screen })),
  goBack: () => set((s) => ({ screen: s.previousScreen, previousScreen: s.screen })),

  // Theme
  isDark: false,
  toggleDark: () => set((s) => {
    const next = !s.isDark
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
    }
    return { isDark: next }
  }),

  // Auth
  isAdmin: false,
  adminUser: null,
  login: async (username, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        set({ isAdmin: true, adminUser: data.user })
        return true
      }
      return false
    } catch {
      return false
    }
  },
  logout: () => set({ isAdmin: false, adminUser: null, screen: 'front-home', previousScreen: 'front-home' }),

  // Data
  properties: [],
  agents: [],
  promos: [],
  visitors: [],
  propertyTypes: [],
  locations: [],
  agency: null,
  seo: null,
  adminUsers: [],
  articles: [],
  reviews: [],

  // Selected items
  selectedPropertyId: null,
  editingPropertyId: null,
  editingAgentId: null,
  editingPromoId: null,
  editingUserId: null,
  editingLocationId: null,
  editingPropertyTypeId: null,
  editingArticleId: null,
  editingReviewId: null,
  selectedArticleId: null,

  // Filters
  frontFilters: { type: '', kabupaten: '', kecamatan: '' },
  adminFilters: { type: '', kabupaten: '', kecamatan: '' },
  allPropertiesPage: 1,

  // KPR
  kprDp: 0,
  kprYears: 20,

  // Loading
  isLoading: false,
  loadingText: '',
  showLoading: (text = 'Memuat...') => set({ isLoading: true, loadingText: text }),
  hideLoading: () => set({ isLoading: false, loadingText: '' }),

  // Modal
  modalMessage: '',
  modalIsConfirm: false,
  modalOnConfirm: undefined,
  showModal: (message, isConfirm = false, onConfirm?: () => void) => set({ modalMessage: message, modalIsConfirm: isConfirm, modalOnConfirm: onConfirm }),
  closeModal: () => set({ modalMessage: '', modalIsConfirm: false, modalOnConfirm: undefined }),

  // Bulk upload
  showBulkUpload: false,
  toggleBulkUpload: () => set((s) => ({ showBulkUpload: !s.showBulkUpload })),

  // Data fetching
  fetchAllData: async () => {
    const { showLoading, hideLoading } = get()
    showLoading('Memuat data...')
    try {
      const res = await fetch('/api/seed-data')
      const raw = await res.json()
      const data = extractData(raw)

      const properties: Property[] = (data.properties || []).map((p: any) => ({
        ...p,
        images: parseImages(p.images),
        promos: p.promos || [],
      }))
      const locations: Location[] = (data.locations || []).map((l: any) => ({
        ...l,
        kecamatan: parseKecamatan(l.kecamatan),
      }))

      set({
        properties,
        agents: data.agents || [],
        promos: data.promos || [],
        visitors: data.visitors || [],
        propertyTypes: data.propertyTypes || [],
        locations,
        agency: data.agency || null,
        seo: data.seo || null,
        adminUsers: (data.adminUsers || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          role: u.role,
        })),
        articles: data.articles || [],
        reviews: data.reviews || [],
      })
    } catch (e) {
      console.error('Failed to fetch data:', e)
    } finally {
      hideLoading()
    }
  },

  // Properties
  saveProperty: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingPropertyId } = get()
    showLoading('Menyimpan properti...')
    try {
      if (data.id || editingPropertyId) {
        // Update existing property
        const propertyId = data.id || editingPropertyId
        const { id, ...updateData } = data
        await fetch(`/api/properties/${propertyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new property
        await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteProperty: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus properti...')
    try {
      await fetch(`/api/properties?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Agents
  saveAgent: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingAgentId } = get()
    showLoading('Menyimpan agen...')
    try {
      if (data.id || editingAgentId) {
        // Update existing agent
        const agentId = data.id || editingAgentId
        const { id, ...updateData } = data
        await fetch(`/api/agents/${agentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new agent
        await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteAgent: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus agen...')
    try {
      await fetch(`/api/agents?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Promos
  savePromo: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingPromoId } = get()
    showLoading('Menyimpan promo...')
    try {
      if (data.id || editingPromoId) {
        // Update existing promo
        const promoId = data.id || editingPromoId
        const { id, ...updateData } = data
        await fetch(`/api/promos/${promoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new promo
        await fetch('/api/promos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deletePromo: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus promo...')
    try {
      await fetch(`/api/promos?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Visitors
  saveVisitor: async (data) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menyimpan lead...')
    try {
      await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  updateVisitorStatus: async (id, status) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Mengupdate status...')
    try {
      await fetch('/api/visitors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteVisitor: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus lead...')
    try {
      await fetch(`/api/visitors?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Locations
  saveLocation: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingLocationId } = get()
    showLoading('Menyimpan lokasi...')
    try {
      if (data.id || editingLocationId) {
        // Update existing location
        const locationId = data.id || editingLocationId
        const { id, ...updateData } = data
        await fetch(`/api/locations/${locationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new location
        await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteLocation: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus lokasi...')
    try {
      await fetch(`/api/locations?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Property Types
  savePropertyType: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingPropertyTypeId } = get()
    showLoading('Menyimpan jenis properti...')
    try {
      if (data.id || editingPropertyTypeId) {
        // Update existing property type
        const propertyTypeId = data.id || editingPropertyTypeId
        const { id, ...updateData } = data
        await fetch(`/api/property-types/${propertyTypeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        // Create new property type
        await fetch('/api/property-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deletePropertyType: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus jenis properti...')
    try {
      await fetch(`/api/property-types?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Users
  saveUser: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingUserId } = get()
    showLoading('Menyimpan user...')
    try {
      if (editingUserId) {
        await fetch(`/api/users/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteUser: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus user...')
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Agency
  saveAgency: async (data) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menyimpan agensi...')
    try {
      await fetch('/api/agency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // SEO
  saveSEO: async (data) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menyimpan SEO...')
    try {
      await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Articles
  saveArticle: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingArticleId } = get()
    showLoading('Menyimpan artikel...')
    try {
      if (editingArticleId) {
        await fetch(`/api/articles/${editingArticleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteArticle: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus artikel...')
    try {
      await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Reviews
  saveReview: async (data) => {
    const { showLoading, hideLoading, fetchAllData, editingReviewId } = get()
    showLoading('Menyimpan review...')
    try {
      if (editingReviewId) {
        await fetch(`/api/reviews/${editingReviewId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },
  deleteReview: async (id) => {
    const { showLoading, hideLoading, fetchAllData } = get()
    showLoading('Menghapus review...')
    try {
      await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
      await fetchAllData()
    } catch (e) {
      console.error(e)
    } finally {
      hideLoading()
    }
  },

  // Submit lead from frontend
  submitLead: async (data) => {
    const { showLoading, hideLoading } = get()
    showLoading('Mengirim pencarian...')
    try {
      await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      get().showModal('Pencarian berhasil dikirim! Agen kami akan segera menghubungi Anda.')
    } catch (e) {
      console.error(e)
      get().showModal('Gagal mengirim pencarian. Silakan coba lagi.')
    } finally {
      hideLoading()
    }
  },
}))
