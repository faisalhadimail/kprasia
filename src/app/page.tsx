'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useStore, type Property, type Article, type Review } from '@/store/propertihub'
import { formatRupiah, generatePermalink, autoFormatRupiahInput, parseRupiahInput, autoSeoTitle, autoSeoDesc, autoSeoKeywords, formatPriceShort, getStatusColor, exportVisitorsCSV } from '@/lib/propertihub-utils'
import {
  Home, Search, MapPin, Building2, Building, Trees, Tent, Phone, MessageCircle,
  ArrowLeft, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, X, Moon,
  Sun, Users, Tag, Settings, Globe, FileText, Download,
  LogOut, ChevronDown, Sparkles, Calculator,
  Shield, Map, Layers, TrendingUp, Link2, Eye, Wand2, Share2, FileCode, Copy, Check,
  Upload, FileSpreadsheet, AlertCircle, CheckCircle2,
  AlertTriangle, HardDrive, Database, Clock, RotateCcw, Palette, BookOpen, Star, Newspaper, Quote, PenLine, EyeOff, Calendar, MessageSquare, Bot, Code
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/* ─── Icon Mapper ─── */
function PropertyTypeIcon({ icon, className = 'w-6 h-6' }: { icon: string; className?: string }) {
  const map: Record<string, any> = { home: Home, 'building-2': Building2, building: Building, trees: Trees, tent: Tent }
  const Icon = map[icon] || Home
  return <Icon className={className} />
}

/* ─── Loading Overlay ─── */
function LoadingOverlay() {
  const { isLoading, loadingText } = useStore()
  if (!isLoading) return null
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-300">{loadingText}</p>
      </div>
    </div>
  )
}

/* ─── Modal ─── */
function Modal() {
  const { modalMessage, modalIsConfirm, modalOnConfirm, closeModal, showModal } = useStore()
  if (!modalMessage) return null
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-[scaleIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <p className="text-gray-800 dark:text-gray-200 text-center mb-6">{modalMessage}</p>
        <div className="flex gap-3">
          {modalIsConfirm && (
            <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium">
              Batal
            </button>
          )}
          <button
            onClick={() => {
              if (modalOnConfirm) modalOnConfirm()
              closeModal()
            }}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg"
          >
            {modalIsConfirm ? 'Ya, Hapus' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Header ─── */
function AdminHeader({ title, onBack, rightAction }: { title: string; onBack?: () => void; rightAction?: React.ReactNode }) {
  return (
    <div className="bg-blue-700 text-white px-4 py-4 rounded-b-3xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {rightAction}
    </div>
  )
}

/* ─── Bottom Nav ─── */
function BottomNav() {
  const { screen, navigate } = useStore()
  const items = [
    { key: 'front-home', label: 'Beranda', Icon: Home },
    { key: 'front-search', label: 'Cari', Icon: Search },
    { key: 'front-agents', label: 'Agen', Icon: Users },
  ]
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-gray-900 rounded-t-3xl shadow-lg border-t border-gray-100 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around py-2 pb-4">
        {items.map(({ key, label, Icon }) => {
          const active = screen === key
          return (
            <button key={key} onClick={() => navigate(key as any)} className="flex flex-col items-center gap-0.5 px-4 py-1">
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  )
}

/* ═══════════════════════════════════════════════════
   FRONTEND SCREENS
   ═══════════════════════════════════════════════════ */

/* ─── Front Home ─── */
function FrontHome() {
  const { navigate, propertyTypes, promos, properties, agency, articles, reviews } = useStore()
  const latestProperties = properties.slice(0, 5)
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      {/* Hero */}
      <div className="relative min-h-[380px] rounded-b-[2rem] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        />
        <div className="relative z-10 p-6 pt-12 flex flex-col justify-end min-h-[380px]">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-2xl font-bold">{agency?.name || 'PropertiHub'}</h1>
            <button
              onClick={() => navigate('admin-login')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Admin"
            >
              <Shield className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/80 text-sm">Temukan Hunian Impian Anda</p>
          <button
            onClick={() => navigate('front-search')}
            className="mt-4 bg-white/20 backdrop-blur-sm text-white rounded-xl py-3 px-4 flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Cari properti...</span>
          </button>
        </div>
      </div>

      {/* Property Types */}
      <div className="px-4 -mt-6 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Jenis Properti</h2>
          <div className="grid grid-cols-4 gap-3">
            {propertyTypes.sort((a, b) => a.order - b.order).map((pt, index) => (
              <button
                key={`property-type-${pt.id}-${index}`}
                onClick={() => {
                  useStore.getState().frontFilters = { type: pt.name, kabupaten: '', kecamatan: '' }
                  useStore.getState().allPropertiesPage = 1
                  navigate('front-all-properties')
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <PropertyTypeIcon icon={pt.icon} className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] text-gray-600 dark:text-gray-400 text-center leading-tight">{pt.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banners */}
      {promos.length > 0 && (
        <div className="px-4 mt-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Promo Spesial</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {promos.map((promo, index) => (
              <div key={`promo-${promo.id}-${index}`} className="min-w-[260px] bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30 flex-shrink-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 text-[10px] font-bold mb-2">{promo.badge}</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{promo.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{promo.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Listings */}
      <div className="px-4 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Listing Terbaru</h2>
          <button onClick={() => navigate('front-all-properties')} className="text-blue-600 text-sm font-medium">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {latestProperties.map((prop, index) => (
            <PropertyCard key={`latest-${prop.id}-${index}`} property={prop} onClick={() => {
              useStore.getState().selectedPropertyId = prop.id
              useStore.getState().kprDp = prop.dp
              navigate('front-detail')
            }} />
          ))}
        </div>
        {properties.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada properti</p>
          </div>
        )}
      </div>

      {/* Testimonials */}
      {reviews.filter(r => r.featured).length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Apa Kata Mereka</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {reviews.filter(r => r.featured).slice(0, 5).map((review, index) => (
              <div key={`review-${review.id}-${index}`} className="min-w-[280px] bg-gray-50 dark:bg-gray-900 rounded-3xl p-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                    {review.image ? (
                      <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{review.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{review.name}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star, starIndex) => (
                        <Star
                          key={`star-${starIndex}`}
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-5 h-5 text-blue-200 dark:text-blue-800 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {articles.filter(a => a.published).length > 0 && (
        <div className="px-4 mt-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Artikel Terbaru</h2>
            <button onClick={() => navigate('front-articles')} className="text-blue-600 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {articles.filter(a => a.published).slice(0, 3).map((article, index) => (
              <div
                key={`article-${article.id}-${index}`}
                onClick={() => {
                  useStore.getState().selectedArticleId = article.id
                  navigate('front-article-detail')
                }}
                className="flex gap-3 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={article.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80'}
                  alt={article.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-medium mb-1">
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{article.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">{article.excerpt}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px]">{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Property Card ─── */
function PropertyCard({ property, onClick, isAdmin = false }: { property: Property; onClick?: () => void; isAdmin?: boolean }) {
  const { navigate } = useStore()
  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-44 object-cover rounded-t-3xl"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 text-xs font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm">
          {property.type}
        </span>
        {property.promos && property.promos.length > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/40 text-orange-600 text-[10px] font-bold border border-orange-100 dark:border-orange-900/30">
            {property.promos[0].badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{property.kecamatan ? `${property.kecamatan}, ${property.kabupaten}` : property.kabupaten}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">{formatRupiah(property.price)}</p>
          {property.dp > 0 && (
            <p className="text-orange-600 dark:text-orange-400 text-xs font-medium">DP {formatRupiah(property.dp)}</p>
          )}
        </div>
        {isAdmin && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                useStore.getState().editingPropertyId = property.id
                navigate('admin-property-form')
              }}
              className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                useStore.getState().showModal('Hapus properti ini?', true, () => useStore.getState().deleteProperty(property.id))
              }}
              className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Front Search ─── */
function FrontSearch() {
  const { navigate, propertyTypes, locations, promos, submitLead, frontFilters, showModal } = useStore()
  const [type, setType] = useState(frontFilters.type)
  const [buildingType, setBuildingType] = useState('')
  const [kabupaten, setKabupaten] = useState(frontFilters.kabupaten)
  const [kecamatan, setKecamatan] = useState(frontFilters.kecamatan)
  const [dpMax, setDpMax] = useState(500000000)
  const [promo, setPromo] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const kecamatanList = useMemo(() => {
    const loc = locations.find((l) => l.kabupaten === kabupaten)
    return loc ? loc.kecamatan : []
  }, [kabupaten, locations])

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      showModal('Mohon isi nama dan nomor telepon.')
      return
    }
    const typeName = propertyTypes.find((p) => p.name === type)?.name || type
    const promoObj = promos.find((p) => p.id === promo)
    await submitLead({
      name,
      phone,
      type: typeName,
      building: buildingType,
      location: kecamatan ? `${kecamatan}, ${kabupaten}` : kabupaten,
      dp: formatRupiah(dpMax),
      promo: promoObj ? promoObj.title : '-',
    })
    navigate('front-home')
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Search BG"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 p-4 pt-12 pb-8 min-h-screen flex flex-col">
        <button onClick={() => navigate('front-home')} className="p-2 rounded-full bg-white/20 mb-4 self-start backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 flex-1">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-5">Cari Properti</h2>
          <div className="space-y-4">
            {/* Type */}
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Jenis</option>
                {propertyTypes.map((pt, i) => <option key={`property-type-search-${i}`} value={pt.name}>{pt.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* Building Type */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={buildingType} onChange={(e) => setBuildingType(e.target.value)} placeholder="Tipe Bangunan (cth: 45/72)" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {/* Kabupaten */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={kabupaten} onChange={(e) => { setKabupaten(e.target.value); setKecamatan('') }} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Kabupaten</option>
                {locations.map((l, i) => <option key={`location-search-${i}`} value={l.kabupaten}>{l.kabupaten}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* Kecamatan */}
            {kecamatanList.length > 0 && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih Kecamatan</option>
                  {kecamatanList.map((d, i) => <option key={`kecamatan-all-${i}`} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
            {/* DP Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maks. DP</span>
                <span className="text-sm font-semibold text-blue-600">{formatRupiah(dpMax)}</span>
              </div>
              <input type="range" min={0} max={2000000000} step={50000000} value={dpMax} onChange={(e) => setDpMax(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
            {/* Promo */}
            {promos.length > 0 && (
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={promo} onChange={(e) => setPromo(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih Promo</option>
                  {promos.map((p, i) => <option key={`promo-search-${i}`} value={p.id}>{p.title}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-xs text-gray-400 mb-3">Data Anda</p>
              <div className="relative mb-3">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. WhatsApp" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">
              Mulai Pencarian
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Front All Properties ─── */
function FrontAllProperties() {
  const { navigate, properties, propertyTypes, locations, frontFilters, allPropertiesPage } = useStore()
  const [type, setType] = useState(frontFilters.type)
  const [kabupaten, setKabupaten] = useState(frontFilters.kabupaten)
  const [kecamatan, setKecamatan] = useState(frontFilters.kecamatan)
  const [page, setPage] = useState(allPropertiesPage)
  const perPage = 10

  const kecamatanList = useMemo(() => {
    const loc = locations.find((l) => l.kabupaten === kabupaten)
    return loc ? loc.kecamatan : []
  }, [kabupaten, locations])

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type && p.type !== type) return false
      if (kabupaten && p.kabupaten !== kabupaten) return false
      if (kecamatan && p.kecamatan !== kecamatan) return false
      return true
    })
  }, [properties, type, kabupaten, kecamatan])

  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  useEffect(() => {
    useStore.getState().frontFilters = { type, kabupaten, kecamatan }
    useStore.getState().allPropertiesPage = page
  }, [type, kabupaten, kecamatan, page])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-blue-700 text-white px-4 py-4 rounded-b-3xl flex items-center gap-3">
        <button onClick={() => navigate('front-home')} className="p-1.5 rounded-full hover:bg-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold flex-1">Semua Properti</h1>
        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{filtered.length}</span>
      </div>
      {/* Filters */}
      <div className="px-4 -mt-4 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex flex-wrap gap-2">
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="flex-1 min-w-[100px] px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Jenis</option>
            {propertyTypes.map((pt) => <option key={pt.id} value={pt.name}>{pt.name}</option>)}
          </select>
          <select value={kabupaten} onChange={(e) => { setKabupaten(e.target.value); setKecamatan(''); setPage(1) }} className="flex-1 min-w-[100px] px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Kabupaten</option>
            {locations.map((l) => <option key={l.id} value={l.kabupaten}>{l.kabupaten}</option>)}
          </select>
          {kecamatanList.length > 0 && (
            <select value={kecamatan} onChange={(e) => { setKecamatan(e.target.value); setPage(1) }} className="flex-1 min-w-[100px] px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Kecamatan</option>
              {kecamatanList.map((d, i) => <option key={`kecamatan-all-${i}`} value={d}>{d}</option>)}
            </select>
          )}
        </div>
      </div>
      {/* List */}
      <div className="px-4 mt-4 space-y-3">
        {paged.map((prop, i) => (
          <PropertyCard key={prop.id} property={prop} onClick={() => {
            useStore.getState().selectedPropertyId = prop.id
            useStore.getState().kprDp = prop.dp
            navigate('front-detail')
          }} />
        ))}
        {paged.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Tidak ada properti ditemukan</p>
          </div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm disabled:opacity-40">
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 px-3">{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm disabled:opacity-40">
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Front Detail ─── */
function FrontDetail() {
  const { navigate, properties, agents, kprDp, kprYears, agency, seo } = useStore()
  const [imgIndex, setImgIndex] = useState(0)
  const [descExpanded, setDescExpanded] = useState(false)
  const [dp, setDp] = useState(kprDp)
  const [years, setYears] = useState(kprYears)
  const [shareCopied, setShareCopied] = useState(false)

  const prop = properties.find((p) => p.id === useStore.getState().selectedPropertyId)
  const agent = agents[0]

  const images = prop?.images || []
  const rate = (agency?.kprInterest || 5.5) / 100 / 12
  const principal = Math.max(0, (prop?.price || 0) - dp)
  const months = years * 12
  const monthly = months > 0 && rate > 0 ? principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1) : 0

  const baseUrl = seo?.frontendUrl?.replace(/\/+$/, '') || ''
  const shareUrl = prop?.permalink ? `${baseUrl}/properti/${prop.permalink}` : ''

  const handleShare = async () => {
    if (!shareUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: prop?.title || 'Properti',
          text: `${prop?.title} - ${formatRupiah(prop?.price || 0)}`,
          url: shareUrl,
        })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  if (!prop) return <div className="min-h-screen flex items-center justify-center text-gray-400">Properti tidak ditemukan</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      {/* Image Slider */}
      <div className="relative h-[350px]">
        <img src={images[imgIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'} alt={prop.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <button onClick={() => navigate('front-home')} className="absolute top-12 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm z-10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        {shareUrl && (
          <button onClick={handleShare} className="absolute top-12 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm z-10 flex items-center gap-1.5">
            {shareCopied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Share2 className="w-5 h-5 text-white" />
            )}
          </button>
        )}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/30 backdrop-blur-sm z-10">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setImgIndex((imgIndex + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/30 backdrop-blur-sm z-10">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm z-10">
              {imgIndex + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-900 rounded-b-3xl -mt-4 relative z-20 px-5 pt-6 pb-5">
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex-1 pr-2">{prop.title}</h1>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-medium whitespace-nowrap">{prop.type}</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{prop.kecamatan ? `${prop.kecamatan}, ${prop.kabupaten}` : prop.kabupaten}</span>
        </div>
        {prop.buildingType && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tipe Bangunan: {prop.buildingType}</p>
        )}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Harga</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{formatRupiah(prop.price)}</span>
          </div>
          {prop.dp > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Uang Muka (DP)</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">{formatRupiah(prop.dp)}</span>
            </div>
          )}
          {prop.allInCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">All-in Cost</span>
              <span className="text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 rounded-full text-xs">{formatRupiah(prop.allInCost)}</span>
            </div>
          )}
        </div>
        {prop.promos && prop.promos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {prop.promos?.map((p, i) => (
              <span key={p.id} className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-medium border border-orange-100 dark:border-orange-900/30">
                {p.badge} - {p.title}
              </span>
            ))}
          </div>
        )}
        {prop.brochure && (
          <a href={prop.brochure} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-blue-600 text-sm font-medium">
            <FileText className="w-4 h-4" /> Download Brosur
          </a>
        )}
      </div>

      {/* Description */}
      {prop.description && (
        <div className="px-5 mt-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Deskripsi</h3>
            <div className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap ${!descExpanded ? 'line-clamp-3' : ''}`}>
              {prop.description}
            </div>
            {prop.description.length > 150 && (
              <button onClick={() => setDescExpanded(!descExpanded)} className="text-blue-600 text-sm font-medium mt-2">
                {descExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPR Calculator */}
      <div className="px-5 mt-4">
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Simulasi KPR</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Uang Muka</span>
                <span className="text-xs font-semibold text-blue-600">{formatRupiah(dp)}</span>
              </div>
              <input type="range" min={0} max={prop.price * 0.5} step={10000000} value={dp} onChange={(e) => setDp(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Tenor</span>
                <span className="text-xs font-semibold text-blue-600">{years} Tahun</span>
              </div>
              <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div className="bg-blue-600 text-white rounded-xl p-4 text-center">
              <p className="text-xs opacity-80 mb-1">Cicilan per Bulan</p>
              <p className="text-2xl font-bold">{formatRupiah(monthly)}</p>
            </div>
            <p className="text-[10px] text-gray-400 text-center">*Suku bunga {agency?.kprInterest || 5.5}% per tahun (fixed)</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 z-50 rounded-t-2xl">
        {agent && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <img src={agent.image} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{agent.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.role}</p>
            </div>
          </div>
        )}
        {shareUrl && (
          <button onClick={handleShare} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg relative">
            {shareCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
          </button>
        )}
        <a href={`tel:${agent?.phone || ''}`} className="p-3 rounded-full bg-blue-600 text-white shadow-lg">
          <Phone className="w-5 h-5" />
        </a>
        <a href={`https://wa.me/${(agent?.phone || '').replace(/^0/, '62')}?text=Halo, saya tertarik dengan properti: ${prop.title}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#25D366] text-white shadow-lg">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}

/* ─── Front Agents ─── */
function FrontAgents() {
  const { agents } = useStore()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <div className="bg-blue-700 text-white px-4 py-4 rounded-b-3xl">
        <h1 className="text-lg font-semibold">Agen Kami</h1>
        <p className="text-sm text-blue-200 mt-1">Tim profesional siap membantu Anda</p>
      </div>
      <div className="px-4 mt-4 space-y-3">
        {agents.map((agent, index) => (
          <div key={`agent-${agent.id}-${index}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex items-center gap-4">
            <img src={agent.image} alt={agent.name} className="w-16 h-16 rounded-2xl object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{agent.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{agent.phone}</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${agent.phone}`} className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Phone className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${agent.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/20 text-[#25D366]">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada agen</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ADMIN SCREENS
   ═══════════════════════════════════════════════════ */

/* ─── Admin Login ─── */
function AdminLogin() {
  const { navigate, login, showModal } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!username || !password) { showModal('Mohon isi username dan password.'); return }
    const success = await login(username, password)
    if (success) {
      navigate('admin-dashboard')
    } else {
      showModal('Login gagal. Periksa username dan password.')
    }
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">
            Masuk
          </button>
          <button onClick={() => navigate('front-home')} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Dashboard ─── */
function AdminDashboard() {
  const { navigate, properties, visitors, agents, promos, logout, isDark, toggleDark, articles, reviews } = useStore()
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    fetch('/api/seed-data')
      .then(res => {
        if (res.ok) setDbStatus('connected')
        else setDbStatus('error')
      })
      .catch(() => setDbStatus('error'))
  }, [])

  const weeklyData = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const now = new Date()
    return days.map((name, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (now.getDay() - i))
      const dateStr = d.toISOString().split('T')[0]
      const count = visitors.filter((v) => v.date === dateStr).length
      return { name, leads: count }
    })
  }, [visitors])

  const stats = [
    { label: 'Total Properti', value: properties.length, icon: Home, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    { label: 'Total Leads', value: visitors.length, icon: Users, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
    { label: 'Total Agen', value: agents.length, icon: Users, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
    { label: 'Promo Aktif', value: promos.length, icon: Tag, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
    { label: 'Artikel', value: articles.length, icon: Newspaper, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400' },
    { label: 'Review Pelanggan', value: reviews.length, icon: Star, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
  ]

  const menus = [
    { label: 'Listing', icon: Home, screen: 'admin-listing' as const },
    { label: 'Leads', icon: Users, screen: 'admin-visitors' as const },
    { label: 'Agen', icon: Users, screen: 'admin-agents' as const },
    { label: 'Promo', icon: Tag, screen: 'admin-promos' as const },
    { label: 'Artikel', icon: Newspaper, screen: 'admin-articles' as const },
    { label: 'Review', icon: Star, screen: 'admin-reviews' as const },
    { label: 'Pengaturan', icon: Settings, screen: 'admin-settings' as const },
    { label: 'Lihat Web', icon: Globe, screen: 'front-home' as const },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-blue-700 text-white px-4 py-4 rounded-b-3xl flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-blue-200">PropertiHub Admin</p>
        </div>
        <div className="flex items-center gap-2">
          {dbStatus === 'connected' && (
            <span className="flex items-center gap-1.5 bg-green-500/20 text-green-100 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Database Terhubung
            </span>
          )}
          {dbStatus === 'error' && (
            <span className="flex items-center gap-1.5 bg-red-500/20 text-red-100 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              Database Error
            </span>
          )}
          {dbStatus === 'checking' && (
            <span className="flex items-center gap-1.5 bg-blue-500/20 text-blue-100 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Menyambungkan...
            </span>
          )}
          <button onClick={toggleDark} className="p-2 rounded-full hover:bg-blue-600 transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={logout} className="p-2 rounded-full hover:bg-blue-600 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 -mt-6 relative z-20">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center mb-2`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 mt-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Leads Minggu Ini
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 mt-4">
          {menus.map((m) => (
            <button
              key={m.label}
              onClick={() => navigate(m.screen)}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <m.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Bulk Upload Modal ─── */
function BulkUploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: number
    failed: number
    errors: Array<{ row: number; field: string; message: string }>
    details: Array<{ row: number; title: string; status: string; error?: string }>
  } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.xlsx') && !f.name.endsWith('.xls')) {
      useStore.getState().showModal('Format file harus .xlsx atau .xls')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      useStore.getState().showModal('Ukuran file maksimal 10MB')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/properties/bulk-upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        useStore.getState().showModal(data.error || 'Gagal mengupload')
      } else {
        setResult(data)
        if (data.success > 0) {
          onUploaded()
        }
      }
    } catch {
      useStore.getState().showModal('Gagal mengupload. Periksa koneksi internet.')
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    window.open('/api/properties/bulk-template', '_blank')
  }

  const resetAndClose = () => {
    setFile(null)
    setResult(null)
    setUploading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" onClick={resetAndClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Upload Massal Listing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Import listing dari file Excel</p>
          </div>
          <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Template download hint */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Download template terlebih dahulu</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Isi data sesuai format template, lalu upload file di bawah.</p>
              <button
                onClick={handleDownloadTemplate}
                className="mt-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/40 px-3 py-1.5 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
              >
                Download Template Excel
              </button>
            </div>
          </div>

          {/* Drop zone */}
          {!result && (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : file
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              {file ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Ganti file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Klik atau seret file Excel ke sini
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">.xlsx atau .xls, maks 10MB</p>
                </div>
              )}
            </div>
          )}

          {/* Upload button */}
          {!result && (
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-3.5 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {file ? file.name : ''}
                </>
              )}
            </button>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.success}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Berhasil</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.failed}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Gagal</p>
                </div>
              </div>

              {/* Detail list */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar">
                {result.details.map((d, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-sm ${
                      d.status === 'berhasil'
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : 'bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    {d.status === 'berhasil' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">Baris {d.row}: {d.title}</p>
                      {d.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 break-words">{d.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions after result */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setFile(null); setResult(null) }}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Upload Lagi
                </button>
                <button
                  onClick={resetAndClose}
                  className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Listing ─── */
function AdminListing() {
  const { navigate, properties, propertyTypes, locations, adminFilters, allPropertiesPage, fetchAllData, deleteProperty, showModal } = useStore()
  const [type, setType] = useState(adminFilters.type)
  const [kabupaten, setKabupaten] = useState(adminFilters.kabupaten)
  const [kecamatan, setKecamatan] = useState(adminFilters.kecamatan)
  const [page, setPage] = useState(allPropertiesPage)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const perPage = 12

  const kecamatanList = useMemo(() => {
    const loc = locations.find((l) => l.kabupaten === kabupaten)
    return loc ? loc.kecamatan : []
  }, [kabupaten, locations])

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type && p.type !== type) return false
      if (kabupaten && p.kabupaten !== kabupaten) return false
      if (kecamatan && p.kecamatan !== kecamatan) return false
      return true
    })
  }, [properties, type, kabupaten, kecamatan])

  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)
  const allSelected = paged.length > 0 && paged.every(p => selectedIds.includes(p.id))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !paged.some(p => p.id === id)))
    } else {
      setSelectedIds(prev => {
        const currentIds = new Set(prev)
        paged.forEach(p => currentIds.add(p.id))
        return Array.from(currentIds)
      })
    }
  }

  const toggleSelect = (id: string) => {
    if (!id) {
      console.warn('toggleSelect called with undefined/null ID')
      return
    }
    console.log('Toggle select for ID:', id, 'Current selected:', selectedIds)
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id)
        console.log('Deselecting ID:', id, 'New selected:', next)
        return next
      } else {
        const next = [...prev, id]
        console.log('Selecting ID:', id, 'New selected:', next)
        return next
      }
    })
  }

  const handleBulkDelete = async () => {
    // Filter out any undefined/null IDs
    const validIds = selectedIds.filter(id => id)
    if (validIds.length === 0) {
      showModal('Pilih minimal satu properti untuk dihapus!')
      return
    }

    showModal(`Hapus ${validIds.length} properti yang dipilih?`, true, async () => {
      try {
        for (const id of validIds) {
          await deleteProperty(id)
        }
        setSelectedIds([])
        showModal(`${validIds.length} properti berhasil dihapus!`)
      } catch (error) {
        console.error('Bulk delete error:', error)
        showModal('Gagal menghapus beberapa properti. Silakan coba lagi.')
      }
    })
  }

  const handleBulkDownload = () => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (kabupaten) params.set('kabupaten', kabupaten)
    if (kecamatan) params.set('kecamatan', kecamatan)
    const qs = params.toString()
    window.open(`/api/properties/bulk-download${qs ? `?${qs}` : ''}`, '_blank')
  }

  const handleDownloadTemplate = () => {
    window.open('/api/properties/bulk-template', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Kelola Listing"
        onBack={() => navigate('admin-dashboard')}
        rightAction={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
                title={`Hapus ${selectedIds.length} terpilih`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => { useStore.getState().editingPropertyId = null; navigate('admin-property-form') }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />
      <div className="p-4">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex flex-wrap gap-2 mb-4">
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Jenis</option>
            {propertyTypes.map((pt) => <option key={pt.id} value={pt.name}>{pt.name}</option>)}
          </select>
          <select value={kabupaten} onChange={(e) => { setKabupaten(e.target.value); setKecamatan(''); setPage(1) }} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Kabupaten</option>
            {locations.map((l) => <option key={l.id} value={l.kabupaten}>{l.kabupaten}</option>)}
          </select>
          {kecamatanList.length > 0 && (
            <select value={kecamatan} onChange={(e) => { setKecamatan(e.target.value); setPage(1) }} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Kecamatan</option>
              {kecamatanList.map((d, i) => <option key={`kecamatan-all-${i}`} value={d}>{d}</option>)}
            </select>
          )}
        </div>

        {/* Bulk Actions Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-3 mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={toggleSelectAll}
            disabled={paged.length === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              allSelected
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {allSelected ? <Check className="w-4 h-4" /> : <div className={`w-4 h-4 border-2 ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'} rounded`} />}
            Pilih Semua
          </button>
          {selectedIds.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedIds.length} terpilih
            </span>
          )}
          <div className="flex-1"></div>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Template Excel
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Massal
          </button>
          <button
            onClick={handleBulkDownload}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download Data ({filtered.length})
          </button>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((prop, i) => (
            <div key={`listing-${prop.id}-${i}`} className="relative">
              {/* Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelect(prop.id)
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    selectedIds.includes(prop.id)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/90 dark:bg-gray-900/90 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {selectedIds.includes(prop.id) && <Check className="w-4 h-4" />}
                </button>
              </div>
              <PropertyCard property={prop} isAdmin onClick={() => {
                useStore.getState().selectedPropertyId = prop.id
                navigate('admin-detail')
              }} />
            </div>
          ))}
        </div>
        {paged.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Home className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Belum ada properti</p>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm disabled:opacity-40">
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 px-3">{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm disabled:opacity-40">
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onUploaded={() => { fetchAllData() }}
        />
      )}
    </div>
  )
}

/* ─── Admin Property Form ─── */
function AdminPropertyForm() {
  const { navigate, editingPropertyId, properties, propertyTypes, locations, promos, saveProperty, seo } = useStore()
  const existing = editingPropertyId ? properties.find((p) => p.id === editingPropertyId) : null

  const [title, setTitle] = useState(existing?.title || '')
  const [price, setPrice] = useState(existing ? autoFormatRupiahInput(String(existing.price)) : '')
  const [dp, setDp] = useState(existing ? autoFormatRupiahInput(String(existing.dp)) : '')
  const [allInCost, setAllInCost] = useState(existing ? autoFormatRupiahInput(String(existing.allInCost)) : '')
  const [kabupaten, setKabupaten] = useState(existing?.kabupaten || '')
  const [kecamatan, setKecamatan] = useState(existing?.kecamatan || '')
  const [type, setType] = useState(existing?.type || '')
  const [buildingType, setBuildingType] = useState(existing?.buildingType || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [selectedPromos, setSelectedPromos] = useState<string[]>(existing?.promos?.map((p) => p.id) || [])
  const [brochure, setBrochure] = useState(existing?.brochure || '')
  const [images, setImages] = useState<string[]>(existing?.images || [])
  const [newImage, setNewImage] = useState('')
  const [seoTitle, setSeoTitle] = useState(existing?.seoTitle || '')
  const [seoDesc, setSeoDesc] = useState(existing?.seoDesc || '')
  const [seoKeywords, setSeoKeywords] = useState(existing?.seoKeywords || '')
  const [permalink, setPermalink] = useState(existing?.permalink || '')
  const [seoAuto, setSeoAuto] = useState(existing?.seoAuto !== false)

  const kecamatanList = useMemo(() => {
    const loc = locations.find((l) => l.kabupaten === kabupaten)
    return loc ? loc.kecamatan : []
  }, [kabupaten, locations])

  const togglePromo = (id: string) => {
    setSelectedPromos((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  const addImage = () => {
    if (newImage.trim()) { setImages([...images, newImage.trim()]); setNewImage('') }
  }
  const removeImage = (i: number) => setImages(images.filter((_, idx) => idx !== i))

  const autoGenerateSEO = () => {
    const genPermalink = generatePermalink(title)
    setPermalink(genPermalink)
    setSeoTitle(autoSeoTitle(title, kabupaten, type, parseRupiahInput(price)))
    setSeoDesc(autoSeoDesc(title, kabupaten, kecamatan, type, parseRupiahInput(price), buildingType))
    setSeoKeywords(autoSeoKeywords(title, kabupaten, kecamatan, type))
    setSeoAuto(false) // Switch to manual after generating so user can tweak
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (seoAuto && title && kabupaten && type) {
      const p = parseRupiahInput(price)
      setPermalink(generatePermalink(title))
      setSeoTitle(autoSeoTitle(title, kabupaten, type, p))
      setSeoDesc(autoSeoDesc(title, kabupaten, kecamatan, type, p, buildingType))
      setSeoKeywords(autoSeoKeywords(title, kabupaten, kecamatan, type))
    }
  }, [seoAuto, title, kabupaten, kecamatan, type, price, buildingType])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = async () => {
    if (!title.trim()) { useStore.getState().showModal('Judul wajib diisi.'); return }
    await saveProperty({
      id: editingPropertyId || undefined,
      title,
      price: parseRupiahInput(price),
      dp: parseRupiahInput(dp),
      allInCost: parseRupiahInput(allInCost),
      kabupaten,
      kecamatan,
      type,
      buildingType,
      description,
      promoIds: selectedPromos,
      brochure,
      images, // Send as array, not JSON string
      permalink,
      seoTitle,
      seoDesc,
      seoKeywords,
      seoAuto,
    })
    navigate('admin-listing')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit Properti' : 'Tambah Properti'} onBack={() => navigate('admin-listing')} />
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Informasi Utama</h3>
          <InputField label="Judul Properti" value={title} onChange={setTitle} placeholder="cth: Rumah Modern Minimalis BSD" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InputField label="Harga" value={price} onChange={(v) => setPrice(autoFormatRupiahInput(v))} placeholder="Rp. 0" />
            <InputField label="DP" value={dp} onChange={(v) => setDp(autoFormatRupiahInput(v))} placeholder="Rp. 0" />
            <InputField label="All-in Cost" value={allInCost} onChange={(v) => setAllInCost(autoFormatRupiahInput(v))} placeholder="Rp. 0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectField label="Jenis" value={type} onChange={setType} options={propertyTypes.map((p) => ({ value: p.name, label: p.name }))} placeholder="Pilih Jenis" />
            <SelectField label="Kabupaten" value={kabupaten} onChange={(v) => { setKabupaten(v); setKecamatan('') }} options={locations.map((l) => ({ value: l.kabupaten, label: l.kabupaten }))} placeholder="Pilih Kabupaten" />
            <SelectField label="Kecamatan" value={kecamatan} onChange={setKecamatan} options={kecamatanList.map((d) => ({ value: d, label: d }))} placeholder="Pilih Kecamatan" disabled={kecamatanList.length === 0} />
          </div>
          <InputField label="Tipe Bangunan" value={buildingType} onChange={setBuildingType} placeholder="cth: 45/72" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Deskripsi properti... (Gunakan Enter untuk paragraf baru)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Promos */}
          {promos.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Promo</label>
              <div className="flex flex-wrap gap-2">
                {promos.map((p, i) => (
                  <button key={`promo-form-${p.id}-${i}`} onClick={() => togglePromo(p.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedPromos.includes(p.id) ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                    {p.badge} - {p.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Gambar ({images.length})</label>
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
                  <img src={img} alt="" className="w-16 h-12 rounded-lg object-cover" />
                  <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">{img}</span>
                  <button onClick={() => removeImage(i)} className="p-1.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="URL gambar..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={(e) => e.key === 'Enter' && addImage()} />
              <button onClick={addImage} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <InputField label="Link Brosur" value={brochure} onChange={setBrochure} placeholder="https://..." />

          {/* SEO */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Globe className="w-4 h-4" /> SEO Listing</h3>
              <button onClick={autoGenerateSEO} className="text-xs text-blue-600 font-medium flex items-center gap-1"><Wand2 className="w-3 h-3" /> Generate Manual</button>
            </div>
            
            {/* SEO Mode Toggle */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setSeoAuto(true)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${seoAuto ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Otomatis
              </button>
              <button
                onClick={() => setSeoAuto(false)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${!seoAuto ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Manual
              </button>
            </div>

            {/* URL Preview */}
            {permalink && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[10px] font-medium text-green-600 uppercase tracking-wider">URL Listing</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 font-mono break-all">/properti/{permalink}</p>
              </div>
            )}

            {/* SERP Preview */}
            {(seoTitle || seoDesc) && (
              <div className="mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview Google</span>
                </div>
                <p className="text-blue-700 dark:text-blue-400 text-sm font-medium line-clamp-1 hover:underline cursor-pointer">{seoTitle || 'Judul SEO'}</p>
                <p className="text-green-700 dark:text-green-500 text-xs mt-0.5">{seo?.frontendUrl?.replace(/\/+$/, '').replace(/^https?:\/\//, '') || 'propertihub.com'}/properti/{permalink}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">{seoDesc || 'Deskripsi SEO akan muncul di sini...'}</p>
              </div>
            )}

            {/* Social Media Previews */}
            {(seoTitle || seoDesc) && (
              <div className="mb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview Social Media</span>
                </div>
                <div className="space-y-3 pl-1">
                  <div>
                    <p className="text-[10px] font-medium text-[#25D366] mb-1.5 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </p>
                    <WhatsAppPreview
                      title={seoTitle}
                      description={seoDesc}
                      image={images.length > 0 ? images[0] : ''}
                      url={`${seo?.frontendUrl?.replace(/\/+$/, '') || 'https://propertihub.com'}/properti/${permalink}`}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#1877F2] mb-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </p>
                    <FacebookPreview
                      title={seoTitle}
                      description={seoDesc}
                      image={images.length > 0 ? images[0] : ''}
                      url={`${seo?.frontendUrl?.replace(/\/+$/, '') || 'https://propertihub.com'}/properti/${permalink}`}
                    />
                  </div>
                </div>
              </div>
            )}

            <InputField label="Permalink" value={permalink} onChange={setPermalink} placeholder="permalink-url-properti" disabled={seoAuto} />
            <InputField label="SEO Title" value={seoTitle} onChange={setSeoTitle} placeholder="Title untuk search engine" disabled={seoAuto} />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">SEO Description</label>
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} placeholder="Deskripsi untuk search engine" disabled={seoAuto} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <InputField label="SEO Keywords" value={seoKeywords} onChange={setSeoKeywords} placeholder="keyword1, keyword2, ..." disabled={seoAuto} />
          </div>

          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">
            {existing ? 'Simpan Perubahan' : 'Tambah Properti'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Detail ─── */
function AdminDetail() {
  const { navigate, properties } = useStore()
  const [imgIndex, setImgIndex] = useState(0)
  const prop = properties.find((p) => p.id === useStore.getState().selectedPropertyId)
  const images = prop?.images || []

  if (!prop) return <div className="min-h-screen flex items-center justify-center text-gray-400">Properti tidak ditemukan</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative h-[350px]">
        <img src={images[imgIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'} alt={prop.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <button onClick={() => navigate('admin-listing')} className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm z-10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/30 backdrop-blur-sm z-10"><ChevronLeft className="w-5 h-5 text-white" /></button>
            <button onClick={() => setImgIndex((imgIndex + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/30 backdrop-blur-sm z-10"><ChevronRight className="w-5 h-5 text-white" /></button>
            <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm z-10">{imgIndex + 1}/{images.length}</span>
          </>
        )}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 relative z-20 px-5 pt-6 pb-5">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">{prop.title}</h1>
        <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400"><MapPin className="w-4 h-4" /><span className="text-sm">{prop.kecamatan ? `${prop.kecamatan}, ${prop.kabupaten}` : prop.kabupaten}</span></div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tipe: {prop.type} {prop.buildingType ? `• ${prop.buildingType}` : ''}</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between"><span className="text-sm text-gray-500">Harga</span><span className="text-blue-600 font-bold">{formatRupiah(prop.price)}</span></div>
          {prop.dp > 0 && <div className="flex justify-between"><span className="text-sm text-gray-500">DP</span><span className="text-orange-600 font-semibold">{formatRupiah(prop.dp)}</span></div>}
          {prop.allInCost > 0 && <div className="flex justify-between"><span className="text-sm text-gray-500">All-in Cost</span><span className="text-green-600 font-semibold">{formatRupiah(prop.allInCost)}</span></div>}
        </div>
        {prop.promos && prop.promos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {prop.promos?.map((p, i) => (<span key={p.id} className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-medium border border-orange-100 dark:border-orange-900/30">{p.badge} - {p.title}</span>))}
          </div>
        )}
        {prop.description && (
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Deskripsi</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {prop.description}
            </div>
          </div>
        )}
        {/* SEO Info */}
        {(prop.seoTitle || prop.permalink) && (
          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> SEO</h3>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${prop.seoAuto ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                  {prop.seoAuto ? 'OTOMATIS' : 'MANUAL'}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 font-mono break-all">/properti/{prop.permalink}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{prop.seoTitle}</p>
            </div>
            {/* Social Media Previews */}
            {prop.seoTitle && (
              <div className="mt-3 space-y-3 pl-1">
                <div>
                  <p className="text-[10px] font-medium text-[#25D366] mb-1.5 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </p>
                  <WhatsAppPreview
                    title={prop.seoTitle}
                    description={prop.seoDesc}
                    image={images.length > 0 ? images[0] : ''}
                    url={`${useStore.getState().seo?.frontendUrl?.replace(/\/+$/, '') || 'https://propertihub.com'}/properti/${prop.permalink}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#1877F2] mb-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </p>
                  <FacebookPreview
                    title={prop.seoTitle}
                    description={prop.seoDesc}
                    image={images.length > 0 ? images[0] : ''}
                    url={`${useStore.getState().seo?.frontendUrl?.replace(/\/+$/, '') || 'https://propertihub.com'}/properti/${prop.permalink}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => { useStore.getState().editingPropertyId = prop.id; navigate('admin-property-form') }}
          className="w-full mt-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" /> Edit Properti
        </button>
      </div>
    </div>
  )
}

/* ─── Admin Visitors ─── */
function AdminVisitors() {
  const { visitors, updateVisitorStatus, deleteVisitor, showModal } = useStore()
  const statuses = ['Baru', 'Follow Up', 'Hot Lead', 'Closing', 'Batal']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Leads / Pengunjung"
        onBack={() => useStore.getState().navigate('admin-dashboard')}
        rightAction={
          <button onClick={() => exportVisitorsCSV(visitors)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" title="Export CSV">
            <Download className="w-5 h-5" />
          </button>
        }
      />
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Total: {visitors.length} leads</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((v, index) => (
            <div key={`visitor-${v.id}-${index}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{v.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{v.phone}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <p><span className="text-gray-400">Tanggal:</span> {v.date}</p>
                <p><span className="text-gray-400">Cari:</span> {v.type} {v.building ? `(${v.building})` : ''}</p>
                <p><span className="text-gray-400">Lokasi:</span> {v.location}</p>
                <p><span className="text-gray-400">DP:</span> {v.dp}</p>
                {v.promo && v.promo !== '-' && <p><span className="text-gray-400">Promo:</span> {v.promo}</p>}
              </div>
              <div className="mt-3 flex gap-2">
                <select
                  value={v.status}
                  onChange={(e) => updateVisitorStatus(v.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => showModal('Hapus lead ini?', true, () => deleteVisitor(v.id))} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {visitors.length === 0 && (
          <div className="text-center py-16 text-gray-400"><Users className="w-16 h-16 mx-auto mb-3 opacity-50" /><p>Belum ada leads</p></div>
        )}
      </div>
    </div>
  )
}

/* ─── Admin Agents ─── */
function AdminAgents() {
  const { navigate, agents, deleteAgent, showModal } = useStore()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Kelola Agen"
        onBack={() => navigate('admin-dashboard')}
        rightAction={
          <button onClick={() => { useStore.getState().editingAgentId = null; navigate('admin-agent-form') }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a, index) => (
          <div key={`admin-agent-${a.id}-${index}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={a.image} alt={a.name} className="w-14 h-14 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{a.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{a.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{a.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { useStore.getState().editingAgentId = a.id; navigate('admin-agent-form') }} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => showModal('Hapus agen ini?', true, () => deleteAgent(a.id))} className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {agents.length === 0 && <div className="col-span-full text-center py-16 text-gray-400"><Users className="w-16 h-16 mx-auto mb-3 opacity-50" /><p>Belum ada agen</p></div>}
      </div>
    </div>
  )
}

/* ─── Admin Agent Form ─── */
function AdminAgentForm() {
  const { navigate, editingAgentId, agents, saveAgent } = useStore()
  const existing = editingAgentId ? agents.find((a) => a.id === editingAgentId) : null
  const [name, setName] = useState(existing?.name || '')
  const [role, setRole] = useState(existing?.role || 'Agen Properti')
  const [phone, setPhone] = useState(existing?.phone || '')
  const [image, setImage] = useState(existing?.image || '')

  const handleSave = async () => {
    if (!name.trim()) { useStore.getState().showModal('Nama wajib diisi.'); return }
    await saveAgent({ id: editingAgentId || undefined, name, role, phone, image })
    navigate('admin-agents')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit Agen' : 'Tambah Agen'} onBack={() => navigate('admin-agents')} />
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Nama" value={name} onChange={setName} placeholder="Nama agen" />
          <InputField label="Role" value={role} onChange={setRole} placeholder="Agen Properti" />
          <InputField label="No. Telepon" value={phone} onChange={setPhone} placeholder="08xxxxxxxxxx" />
          <InputField label="URL Foto" value={image} onChange={setImage} placeholder="https://..." />
          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">{existing ? 'Simpan Perubahan' : 'Tambah Agen'}</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Promos ─── */
function AdminPromos() {
  const { navigate, promos, deletePromo, showModal } = useStore()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Kelola Promo"
        onBack={() => navigate('admin-dashboard')}
        rightAction={
          <button onClick={() => { useStore.getState().editingPromoId = null; navigate('admin-promo-form') }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p, i) => (
          <div key={`admin-promo-${p.id}-${i}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 border-l-4 border-orange-400">
            <span className="inline-block px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-[10px] font-bold mb-2">{p.badge}</span>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{p.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.subtitle}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { useStore.getState().editingPromoId = p.id; navigate('admin-promo-form') }} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => showModal('Hapus promo ini?', true, () => deletePromo(p.id))} className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {promos.length === 0 && <div className="col-span-full text-center py-16 text-gray-400"><Tag className="w-16 h-16 mx-auto mb-3 opacity-50" /><p>Belum ada promo</p></div>}
      </div>
    </div>
  )
}

/* ─── Admin Promo Form ─── */
function AdminPromoForm() {
  const { navigate, editingPromoId, promos, savePromo } = useStore()
  const existing = editingPromoId ? promos.find((p) => p.id === editingPromoId) : null
  const [badge, setBadge] = useState(existing?.badge || 'PROMO')
  const [title, setTitle] = useState(existing?.title || '')
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '')

  const handleSave = async () => {
    if (!title.trim()) { useStore.getState().showModal('Judul promo wajib diisi.'); return }
    await savePromo({ id: editingPromoId || undefined, badge, title, subtitle })
    navigate('admin-promos')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit Promo' : 'Tambah Promo'} onBack={() => navigate('admin-promos')} />
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Badge" value={badge} onChange={setBadge} placeholder="PROMO" />
          <InputField label="Judul" value={title} onChange={setTitle} placeholder="Judul promo" />
          <InputField label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Deskripsi singkat" />
          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">{existing ? 'Simpan Perubahan' : 'Tambah Promo'}</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Settings ─── */
function AdminSettings() {
  const { navigate, agency, seo, locations, propertyTypes, adminUsers } = useStore()

  const sections = [
    { label: 'Profil Agensi', desc: agency?.name || '-', icon: Building2, screen: 'admin-agency-form' as const },
    { label: 'SEO Global', desc: seo?.frontendUrl || seo?.title ? (seo?.frontendUrl || seo?.title || '-').substring(0, 40) + '...' : '-', icon: Globe, screen: 'admin-seo-form' as const },
    { label: 'Analytics', desc: 'Google Analytics, GTM, Facebook Pixel', icon: TrendingUp, screen: 'admin-analytics' as const },
    { label: 'Database Kabupaten', desc: `${locations.length} kabupaten terdaftar`, icon: Map, screen: 'admin-locations' as const },
    { label: 'Jenis Properti', desc: `${propertyTypes.length} jenis terdaftar`, icon: Layers, screen: 'admin-property-types' as const },
    { label: 'Manajemen User', desc: `${adminUsers.length} user terdaftar`, icon: Shield, screen: 'admin-users' as const },
    { label: 'Backup & Restore', desc: 'Download & restore database', icon: Database, screen: 'admin-backup-restore' as const },
    { label: 'Tema', desc: 'Dark mode & warna tema', icon: Palette, screen: 'admin-theme' as const },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Pengaturan" onBack={() => navigate('admin-dashboard')} />
      <div className="p-4 max-w-2xl mx-auto space-y-3">
        {sections.map((s) => (
          <button key={s.label} onClick={() => navigate(s.screen)} className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <s.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{s.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{s.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 border border-red-100 dark:border-red-900/30 mt-6">
          <h3 className="font-semibold text-red-500 text-sm mb-2">Zona Berbahaya</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Menghapus semua data tidak dapat dibatalkan.</p>
          <button
            onClick={() => useStore.getState().showModal('HAPUS SEMUA DATA? Tindakan ini tidak dapat dibatalkan!', true, async () => {
              await fetch('/api/clear-database', { method: 'POST' })
              await useStore.getState().fetchAllData()
            })}
            className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Hapus Semua Data
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Agency/SEO Form ─── */
function AdminAgencyForm() {
  const { navigate, agency, saveAgency } = useStore()
  const [name, setName] = useState(agency?.name || '')
  const [phone, setPhone] = useState(agency?.phone || '')
  const [address, setAddress] = useState(agency?.address || '')
  const [kprInterest, setKprInterest] = useState(String(agency?.kprInterest || 5.5))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="Profil Agensi" onBack={() => navigate('admin-settings')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Profil Agensi</h3>
          <InputField label="Nama Agensi" value={name} onChange={setName} />
          <InputField label="Telepon" value={phone} onChange={setPhone} />
          <InputField label="Alamat" value={address} onChange={setAddress} />
          <InputField label="Suku Bunga KPR (%)" value={kprInterest} onChange={setKprInterest} />
          <button onClick={async () => { await saveAgency({ name, phone, address, kprInterest: Number(kprInterest) }); useStore.getState().showModal('Agensi berhasil disimpan!') }} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg">Simpan Agensi</button>
        </div>

      </div>
    </div>
  )
}

/* ─── Admin SEO Form ─── */
function AdminSEOForm() {
  const { navigate, seo, saveSEO, properties } = useStore()
  const [frontendUrl, setFrontendUrl] = useState(seo?.frontendUrl || '')
  const [seoTitle, setSeoTitle] = useState(seo?.title || '')
  const [seoDesc, setSeoDesc] = useState(seo?.description || '')
  const [seoKeywords, setSeoKeywords] = useState(seo?.keywords || '')
  const [seoImage, setSeoImage] = useState(seo?.image || '')
  const [robotsTxt, setRobotsTxt] = useState(seo?.robotsTxt || `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Sitemap: ${seo?.frontendUrl || 'https://yourwebsite.com'}/sitemap.xml`)
  const [sitemapStatus, setSitemapStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [robotsStatus, setRobotsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const cleanUrl = frontendUrl.replace(/\/+$/, '')

  const handleSaveSEO = async () => {
    await saveSEO({
      frontendUrl,
      title: seoTitle,
      description: seoDesc,
      keywords: seoKeywords,
      image: seoImage,
      robotsTxt
    })
    useStore.getState().showModal('SEO berhasil disimpan!')
  }

  const handleGenerateSitemap = async () => {
    setSitemapStatus('loading')
    try {
      const res = await fetch(`/api/sitemap?baseUrl=${encodeURIComponent(cleanUrl)}`)
      if (res.ok) {
        const xml = await res.text()
        const blob = new Blob([xml], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sitemap.xml'
        a.click()
        URL.revokeObjectURL(url)
        setSitemapStatus('success')
        setTimeout(() => setSitemapStatus('idle'), 3000)
      } else {
        setSitemapStatus('error')
        setTimeout(() => setSitemapStatus('idle'), 3000)
      }
    } catch {
      setSitemapStatus('error')
      setTimeout(() => setSitemapStatus('idle'), 3000)
    }
  }

  const handleGenerateRobots = async () => {
    setRobotsStatus('loading')
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ robotsTxt })
      })

      if (res.ok) {
        const blob = new Blob([robotsTxt], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'robots.txt'
        a.click()
        URL.revokeObjectURL(url)
        setRobotsStatus('success')
        setTimeout(() => setRobotsStatus('idle'), 3000)
      } else {
        setRobotsStatus('error')
        setTimeout(() => setRobotsStatus('idle'), 3000)
      }
    } catch {
      setRobotsStatus('error')
      setTimeout(() => setRobotsStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title="SEO Global" onBack={() => navigate('admin-settings')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Base URL */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">URL Dasar / Website</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">URL utama website Anda. Digunakan untuk generate sitemap dan share link listing.</p>
          <InputField
            label="URL Dasar"
            value={frontendUrl}
            onChange={setFrontendUrl}
            placeholder="https://www.propertihub.com"
            type="url"
          />
          {cleanUrl && (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview URL</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono break-all">{cleanUrl}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{cleanUrl}/properti/contoh-permalink</p>
            </div>
          )}
        </div>

        {/* SEO Meta */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Meta SEO</h3>
          </div>
          <InputField label="Title" value={seoTitle} onChange={setSeoTitle} placeholder="PropertiHub - Temukan Hunian Impian Anda" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} placeholder="Deskripsi website untuk search engine..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{seoDesc.length}/160 karakter</p>
          </div>
          <InputField label="Keywords" value={seoKeywords} onChange={setSeoKeywords} placeholder="properti, rumah, apartemen, jual rumah" />
          <InputField label="OG Image URL" value={seoImage} onChange={setSeoImage} placeholder="https://example.com/og-image.jpg" type="url" />

          {/* SERP Preview */}
          {(seoTitle || seoDesc) && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview Google</span>
              </div>
              <p className="text-blue-700 dark:text-blue-400 text-sm font-medium line-clamp-1 hover:underline cursor-pointer">{seoTitle || 'Judul SEO'}</p>
              <p className="text-green-700 dark:text-green-500 text-xs mt-0.5">{cleanUrl || 'propertihub.com'}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">{seoDesc || 'Deskripsi SEO akan muncul di sini...'}</p>
            </div>
          )}

          {/* Social Media Previews */}
          {(seoTitle || seoDesc || seoImage) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview Social Media</span>
              </div>
              <div className="space-y-3 pl-1">
                <div>
                  <p className="text-[10px] font-medium text-[#25D366] mb-1.5 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </p>
                  <WhatsAppPreview title={seoTitle} description={seoDesc} image={seoImage} url={cleanUrl || 'https://propertihub.com'} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#1877F2] mb-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </p>
                  <FacebookPreview title={seoTitle} description={seoDesc} image={seoImage} url={cleanUrl || 'https://propertihub.com'} />
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSaveSEO} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors">
            Simpan SEO
          </button>
        </div>

        {/* Sitemap */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sitemap XML</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate sitemap XML untuk semua halaman. Sitemap berisi {1 + properties.filter(p => p.permalink).length} URL ({properties.filter(p => p.permalink).length} listing + 1 homepage).
          </p>
          {cleanUrl && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
              <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wider mb-1">Endpoint Sitemap</p>
              <p className="text-xs text-purple-700 dark:text-purple-400 font-mono break-all">{cleanUrl}/api/sitemap</p>
            </div>
          )}
          <button
            onClick={handleGenerateSitemap}
            disabled={sitemapStatus === 'loading'}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sitemapStatus === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : sitemapStatus === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Berhasil Download!
              </>
            ) : sitemapStatus === 'error' ? (
              <>
                <X className="w-4 h-4" />
                Gagal, Coba Lagi
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4" />
                Generate & Download Sitemap
              </>
            )}
          </button>
        </div>

        {/* Robots.txt */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Robots.txt</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Atur bagaimana search engine crawl website Anda. File robots.txt memberikan instruksi ke crawler seperti Google.
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Content robots.txt</label>
            <textarea
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              rows={8}
              placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin&#10;Sitemap: https://yourwebsite.com/sitemap.xml"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">Gunakan format standar robots.txt</p>
          </div>

          {/* Preview */}
          {robotsTxt && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Preview</span>
              </div>
              <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-all">{robotsTxt}</pre>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleGenerateRobots}
              disabled={robotsStatus === 'loading'}
              className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {robotsStatus === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : robotsStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  Berhasil!
                </>
              ) : robotsStatus === 'error' ? (
                <>
                  <X className="w-4 h-4" />
                  Gagal
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
            {cleanUrl && (
              <div className="flex-1 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center">
                <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wider">Endpoint</p>
                <p className="text-xs text-orange-700 dark:text-orange-400 font-mono ml-2">{cleanUrl}/robots.txt</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Analytics ─── */
function AdminAnalytics() {
  const { navigate, seo, saveSEO } = useStore()

  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(seo?.googleAnalyticsId || '')
  const [googleTagManagerId, setGoogleTagManagerId] = useState(seo?.googleTagManagerId || '')
  const [facebookPixelId, setFacebookPixelId] = useState(seo?.facebookPixelId || '')
  const [customHeadScript, setCustomHeadScript] = useState(seo?.customHeadScript || '')
  const [customBodyScript, setCustomBodyScript] = useState(seo?.customBodyScript || '')

  const handleSave = async () => {
    await saveSEO({
      ...seo,
      googleAnalyticsId,
      googleTagManagerId,
      facebookPixelId,
      customHeadScript,
      customBodyScript,
    })
    useStore.getState().showModal('Analytics berhasil disimpan!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-4">
      <AdminHeader title="Analytics" onBack={() => navigate('admin-settings')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Google Analytics */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Google Analytics</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Masukkan ID Google Analytics 4 (GA4) untuk melacak trafik dan perilaku pengunjung.
          </p>
          <InputField
            label="GA4 Measurement ID"
            value={googleAnalyticsId}
            onChange={setGoogleAnalyticsId}
            placeholder="G-XXXXXXXXXX"
            pattern="^G-[A-Z0-9]+$"
          />
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mb-1">Format</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 font-mono">G-XXXXXXXXXX (contoh: G-XXXXXXXXXX)</p>
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Google Tag Manager</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola semua tag dan tracking codes dari satu tempat dengan Google Tag Manager.
          </p>
          <InputField
            label="GTM Container ID"
            value={googleTagManagerId}
            onChange={setGoogleTagManagerId}
            placeholder="GTM-XXXXXXX"
            pattern="^GTM-[A-Z0-9]+$"
          />
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
            <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider mb-1">Format</p>
            <p className="text-xs text-green-700 dark:text-green-400 font-mono">GTM-XXXXXXX (contoh: GTM-ABC1234)</p>
          </div>
        </div>

        {/* Facebook Pixel */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#1877F2]/20 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-[#1877F2] dark:text-[#1877F2]" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Facebook Pixel</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track events and conversions dari Facebook Ads dan Facebook Pixel.
          </p>
          <InputField
            label="Pixel ID"
            value={facebookPixelId}
            onChange={setFacebookPixelId}
            placeholder="XXXXXXXXXXXXXXXX"
            type="text"
          />
          <div className="p-3 rounded-xl bg-[#1877F2]/10 dark:bg-[#1877F2]/10 border border-[#1877F2]/20 dark:border-[#1877F2]/20">
            <p className="text-[10px] font-medium text-[#1877F2] uppercase tracking-wider mb-1">Format</p>
            <p className="text-xs text-[#1877F2] font-mono">XXXXXXXXXXXXXXXX (contoh: 1234567890123456)</p>
          </div>
        </div>

        {/* Custom Head Script */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Custom Head Script</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tambahkan script custom di bagian &lt;head&gt; (meta tags, lain-lain).
          </p>
          <textarea
            value={customHeadScript}
            onChange={(e) => setCustomHeadScript(e.target.value)}
            rows={8}
            placeholder="<!-- Meta tags -->&#10;<meta name='verification' content='xxx' />&#10;&#10;<!-- Custom scripts -->&#10;<script>&#10;  // Your custom code here&#10;</script>"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Custom Body Script */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Custom Body Script</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tambahkan script custom di bagian &lt;body&gt; (live chat, analytics, dll).
          </p>
          <textarea
            value={customBodyScript}
            onChange={(e) => setCustomBodyScript(e.target.value)}
            rows={8}
            placeholder="<!-- Live Chat Widget -->&#10;<script>&#10;  // Your live chat code here&#10;</script>&#10;&#10;<!-- Third-party analytics -->&#10;<script>&#10;  // Your analytics code here&#10;</script>"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Analytics
        </button>

        {/* Warning */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-200 dark:border-amber-900/30 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Peringatan</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Pastikan untuk mengecek keamanan dan kepatuhan GDPR/privacy saat menambahkan script analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Setup Notice ─── */
function SetupNotice({ type }: { type: 'articles' | 'reviews' }) {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedError, setSeedError] = useState('')

  const checkSetup = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/setup-articles-reviews')
      const data = await res.json()
      if (type === 'articles') {
        setNeedsSetup(data.articlesNeeded)
      } else {
        setNeedsSetup(data.reviewsNeeded)
      }
    } catch {
      setNeedsSetup(false)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => { checkSetup() }, [type])

  const handleSeed = async () => {
    setSeeding(true)
    setSeedError('')
    try {
      const res = await fetch('/api/setup-articles-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: type === 'articles', reviews: type === 'reviews' }),
      })
      const data = await res.json()
      const result = type === 'articles' ? data.articles : data.reviews
      if (result?.success) {
        useStore.getState().showModal(`Berhasil! ${result.count} data ${type === 'articles' ? 'artikel' : 'review'} telah ditambahkan.`)
        await useStore.getState().fetchAllData()
        setNeedsSetup(false)
      } else {
        setSeedError(result?.error || 'Gagal. Tabel belum dibuat di Supabase.')
      }
    } catch {
      setSeedError('Gagal menghubungi server.')
    } finally {
      setSeeding(false)
    }
  }

  if (checking || !needsSetup) return null

  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-amber-800 dark:text-amber-200 text-sm mb-1">
            Tabel {type === 'articles' ? 'Artikel' : 'Review'} Belum Ada
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
            Buat tabel di Supabase SQL Editor, lalu tekan &quot;Seed Data&quot; untuk mengisi contoh data.
          </p>
          {seedError && (
            <p className="text-xs text-red-600 dark:text-red-400 mb-2">{seedError}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {seeding ? 'Memproses...' : 'Seed Data'}
            </button>
            <button
              onClick={() => {
                const sql = type === 'articles'
                  ? `CREATE TABLE "Article" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "image" TEXT,
  "author" TEXT,
  "category" TEXT,
  "excerpt" TEXT,
  "content" TEXT,
  "published" BOOLEAN DEFAULT false,
  "seoTitle" TEXT,
  "seoDesc" TEXT,
  "seoKeywords" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);`
                  : `CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
  "review" TEXT,
  "propertyId" TEXT,
  "image" TEXT,
  "featured" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);`
                navigator.clipboard.writeText(sql)
                useStore.getState().showModal('SQL telah disalin ke clipboard! Jalankan di Supabase SQL Editor, lalu tekan Seed Data.')
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              Salin SQL
            </button>
            <button
              onClick={checkSetup}
              className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              Cek Ulang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Backup Restore ─── */
function AdminBackupRestore() {
  const { navigate, showModal, properties, articles, reviews, promos, agents, propertyTypes, locations, visitors } = useStore()
  const [backupStatus, setBackupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dummyStatus, setDummyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const COLLECTIONS = [
    { id: 'properties', label: 'Properti', icon: Home, count: properties.length },
    { id: 'articles', label: 'Artikel', icon: Newspaper, count: articles.length },
    { id: 'reviews', label: 'Review', icon: MessageCircle, count: reviews.length },
    { id: 'promos', label: 'Promo', icon: Star, count: promos.length },
    { id: 'agents', label: 'Agen', icon: Users, count: agents.length },
    { id: 'propertyTypes', label: 'Jenis Properti', icon: Tag, count: propertyTypes.length },
    { id: 'locations', label: 'Lokasi', icon: MapPin, count: locations.length },
    { id: 'visitors', label: 'Leads', icon: MessageSquare, count: visitors.length },
  ]

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(c => c !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleBackup = async () => {
    setBackupStatus('loading')
    try {
      const res = await fetch('/api/database/backup')
      if (res.ok) {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `propertihub-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        setBackupStatus('success')
        setTimeout(() => setBackupStatus('idle'), 3000)
      } else {
        setBackupStatus('error')
        setTimeout(() => setBackupStatus('idle'), 3000)
      }
    } catch {
      setBackupStatus('error')
      setTimeout(() => setBackupStatus('idle'), 3000)
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) {
      showModal('Pilih file backup terlebih dahulu!')
      return
    }
    setRestoreStatus('loading')
    try {
      const text = await restoreFile.text()
      const data = JSON.parse(text)
      const res = await fetch('/api/database/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      if (res.ok) {
        const result = await res.json()
        setRestoreStatus('success')
        const successCount = Object.entries(result.results).filter(([, v]: any) => v.success).length
        showModal(`Restore berhasil! ${successCount} tabel dipulihkan.`)
        setTimeout(() => {
          setRestoreStatus('idle')
          setRestoreFile(null)
          window.location.reload()
        }, 2000)
      } else {
        setRestoreStatus('error')
        setTimeout(() => setRestoreStatus('idle'), 3000)
      }
    } catch {
      setRestoreStatus('error')
      setTimeout(() => setRestoreStatus('idle'), 3000)
    }
  }

  const handleClearDatabase = async () => {
    if (deleteConfirmation !== 'hapus') {
      showModal('Ketik "hapus" untuk mengkonfirmasi!')
      return
    }
    if (selectedCollections.length === 0) {
      showModal('Pilih minimal satu collection untuk dihapus!')
      return
    }
    setDeleteStatus('loading')
    try {
      console.log('[Frontend] Sending delete request:', {
        confirmation: 'hapus',
        collections: selectedCollections
      })

      const res = await fetch('/api/database/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation: 'hapus',
          collections: selectedCollections,
        }),
      })

      console.log('[Frontend] Response status:', res.status)
      const result = await res.json()
      console.log('[Frontend] Response data:', result)

      if (res.ok) {
        const totalDeleted = Object.values(result.results).reduce((sum: any, r: any) => sum + (r.count || 0), 0)
        setDeleteStatus('success')
        showModal(`Berhasil menghapus ${totalDeleted} data!`)
        setSelectedCollections([])
        setDeleteConfirmation('')
        setTimeout(() => {
          setDeleteStatus('idle')
          window.location.reload()
        }, 2000)
      } else {
        const error = await res.json()
        setDeleteStatus('error')
        showModal(error.error || 'Gagal menghapus data.')
        setTimeout(() => setDeleteStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('[Frontend] Delete error:', error)
      setDeleteStatus('error')
      showModal('Gagal menghapus data.')
      setTimeout(() => setDeleteStatus('idle'), 3000)
    }
  }

  const handleDummyData = async () => {
    setDummyStatus('loading')
    try {
      const res = await fetch('/api/database/dummy-data', { method: 'POST' })
      if (res.ok) {
        const result = await res.json()
        setDummyStatus('success')
        const msg = `Dummy data berhasil ditambahkan!\n` +
          `Artikel: ${result.results.articles?.count || 0}\n` +
          `User: ${result.results.users?.count || 0}\n` +
          `Review: ${result.results.reviews?.count || 0}`
        showModal(msg)
        setTimeout(() => {
          setDummyStatus('idle')
          window.location.reload()
        }, 2000)
      } else {
        setDummyStatus('error')
        setTimeout(() => setDummyStatus('idle'), 3000)
      }
    } catch {
      setDummyStatus('error')
      setTimeout(() => setDummyStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-4">
      <AdminHeader title="Backup & Restore" onBack={() => navigate('admin-settings')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Backup */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Backup Database</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download semua data sebagai file JSON</p>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={backupStatus === 'loading'}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {backupStatus === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : backupStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Backup Selesai!
              </>
            ) : backupStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Gagal, Coba Lagi
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Backup
              </>
            )}
          </button>
        </div>

        {/* Restore */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Restore Database</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload file backup untuk memulihkan data</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-600 dark:file:text-blue-400 file:text-sm file:font-medium cursor-pointer"
              />
              {restoreFile && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {restoreFile.name}
                </p>
              )}
            </div>
            <button
              onClick={handleRestore}
              disabled={restoreStatus === 'loading' || !restoreFile}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {restoreStatus === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memulihkan...
                </>
              ) : restoreStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Restore Berhasil!
                </>
              ) : restoreStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Gagal, Coba Lagi
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Restore Database
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dummy Data */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Tambah Dummy Data</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tambah data contoh untuk artikel, user, dan review</p>
            </div>
          </div>
          <button
            onClick={handleDummyData}
            disabled={dummyStatus === 'loading'}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {dummyStatus === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : dummyStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Selesai!
              </>
            ) : dummyStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Gagal, Coba Lagi
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tambah Dummy Data
              </>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-900/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Hapus Data</h3>
              <p className="text-xs text-red-700 dark:text-red-300">Pilih collection untuk dihapus</p>
            </div>
          </div>

          {/* Collection Selection */}
          <div className="space-y-2 mb-4">
            {COLLECTIONS.map((collection) => (
              <button
                key={collection.id}
                onClick={() => toggleCollection(collection.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                  selectedCollections.includes(collection.id)
                    ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-600'
                    : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <collection.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{collection.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{collection.count} data</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedCollections.includes(collection.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {selectedCollections.includes(collection.id) && <X className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="text-xs text-red-700 dark:text-red-300 mb-2 block">
              Ketik <strong>"hapus"</strong> untuk konfirmasi:
            </label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Ketik 'hapus'"
              className="w-full px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleClearDatabase}
            disabled={deleteStatus === 'loading' || selectedCollections.length === 0 || deleteConfirmation !== 'hapus'}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleteStatus === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Hapus Data Terpilih
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Theme Settings ─── */
function AdminThemeSettings() {
  const { navigate, isDark, toggleDark } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-4">
      <AdminHeader title="Tema" onBack={() => navigate('admin-settings')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Dark Mode Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {isDark ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Mode Gelap</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{isDark ? 'Sedang aktif' : 'Sedang nonaktif'}</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Articles ─── */
function AdminArticles() {
  const { navigate, articles, deleteArticle, showModal, editingArticleId } = useStore()
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = ['Tips Properti', 'Market Update', 'Tips Keuangan', 'Lokasi', 'Umum']
  const filteredArticles = articles.filter(a => !categoryFilter || a.category === categoryFilter)

  useEffect(() => {
    if (editingArticleId) {
      useStore.getState().editingArticleId = null
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <AdminHeader
        title="Kelola Artikel"
        onBack={() => navigate('admin-dashboard')}
        rightAction={
          <button onClick={() => navigate('admin-article-form')} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <SetupNotice type="articles" />
      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !categoryFilter
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada artikel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, index) => (
              <div key={`article-${article.id}-${index}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
                <img
                  src={article.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-medium mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-2 mb-2">{article.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${article.published ? 'text-green-600' : 'text-gray-400'}`}>
                      {article.published ? 'Diterbitkan' : 'Draft'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          useStore.getState().editingArticleId = article.id
                          navigate('admin-article-form')
                        }}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => showModal('Hapus artikel ini?', true, () => deleteArticle(article.id))}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Admin Article Form ─── */
function AdminArticleForm() {
  const { navigate, articles, editingArticleId, saveArticle } = useStore()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [image, setImage] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('Tips Properti')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const initializedRef = useRef(false)
  const titleRef = useRef('')

  const categories = ['Tips Properti', 'Market Update', 'Tips Keuangan', 'Lokasi', 'Umum']

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      if (editingArticleId) {
        const article = articles.find(a => a.id === editingArticleId)
        if (article) {
          setTimeout(() => {
            setTitle(article.title)
            setSlug(article.slug)
            setImage(article.image)
            setAuthor(article.author)
            setCategory(article.category)
            setExcerpt(article.excerpt)
            setContent(article.content)
            setPublished(article.published)
            setSeoTitle(article.seoTitle)
            setSeoDesc(article.seoDesc)
            setSeoKeywords(article.seoKeywords)
            titleRef.current = article.title
          }, 0)
        }
      }
    }
  }, [editingArticleId, articles])

  useEffect(() => {
    if (title !== titleRef.current) {
      titleRef.current = title
      setTimeout(() => {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        setSlug(newSlug)
      }, 0)
    }
  }, [title])

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !excerpt.trim()) {
      useStore.getState().showModal('Mohon isi judul, penulis, dan ringkasan.')
      return
    }
    await saveArticle({
      id: editingArticleId || `article-${Date.now()}`,
      title,
      slug,
      image,
      author,
      category,
      excerpt,
      content,
      published,
      seoTitle,
      seoDesc,
      seoKeywords,
      createdAt: editingArticleId ? articles.find(a => a.id === editingArticleId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    useStore.getState().editingArticleId = null
    navigate('admin-articles')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={editingArticleId ? 'Edit Artikel' : 'Tambah Artikel'} onBack={() => navigate('admin-articles')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Judul" value={title} onChange={setTitle} placeholder="Judul artikel" />
          <InputField label="Slug" value={slug} onChange={setSlug} placeholder="url-slug-artikel" />
          <InputField label="URL Gambar" value={image} onChange={setImage} placeholder="https://example.com/image.jpg" type="url" />
          <InputField label="Penulis" value={author} onChange={setAuthor} placeholder="Nama penulis" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Ringkasan</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat artikel..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Konten (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="<p>Konten artikel dalam format HTML...</p>"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Terbitkan artikel</span>
          </label>
        </div>

        {/* SEO Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">SEO</h3>
          </div>
          <InputField label="SEO Title" value={seoTitle} onChange={setSeoTitle} placeholder="Judul untuk search engine" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">SEO Description</label>
            <textarea
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              rows={3}
              placeholder="Deskripsi untuk search engine..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <InputField label="SEO Keywords" value={seoKeywords} onChange={setSeoKeywords} placeholder="keyword1, keyword2, keyword3" />
        </div>

        <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors">
          {editingArticleId ? 'Update Artikel' : 'Simpan Artikel'}
        </button>
      </div>
    </div>
  )
}

/* ─── Admin Reviews ─── */
function AdminReviews() {
  const { navigate, reviews, deleteReview, showModal, editingReviewId, properties } = useStore()
  const [ratingFilter, setRatingFilter] = useState(0)

  const filteredReviews = reviews.filter(r => !ratingFilter || r.rating === ratingFilter)

  useEffect(() => {
    if (editingReviewId) {
      useStore.getState().editingReviewId = null
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <AdminHeader
        title="Kelola Review"
        onBack={() => navigate('admin-dashboard')}
        rightAction={
          <button onClick={() => navigate('admin-review-form')} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <SetupNotice type="reviews" />
      <div className="p-4 space-y-4">
        {/* Rating Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setRatingFilter(0)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !ratingFilter
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Semua
          </button>
          {[5, 4, 3, 2, 1].map((star, i) => (
            <button
              key={`review-filter-star-${star}-${i}`}
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                ratingFilter === star
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Star className="w-3 h-3" />
              {star} Bintang
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((review, index) => {
              const property = properties.find(p => p.id === review.propertyId)
              return (
                <div key={`review-${review.id}-${index}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{review.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{review.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star, starIndex) => (
                          <Star
                            key={`review-list-star-${starIndex}`}
                            className={`w-3 h-3 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <Quote className="w-4 h-4 text-blue-200 dark:text-blue-800 mb-1.5" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">{review.review}</p>
                  {property && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 truncate mb-3">
                      {property.title}
                    </p>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        useStore.getState().editingReviewId = review.id
                        navigate('admin-review-form')
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => showModal('Hapus review ini?', true, () => deleteReview(review.id))}
                      className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Admin Review Form ─── */
function AdminReviewForm() {
  const { navigate, reviews, editingReviewId, saveReview, properties } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReviewText] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [image, setImage] = useState('')
  const [featured, setFeatured] = useState(false)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      if (editingReviewId) {
        const r = reviews.find(rev => rev.id === editingReviewId)
        if (r) {
          setTimeout(() => {
            setName(r.name)
            setPhone(r.phone)
            setRating(r.rating)
            setReviewText(r.review)
            setPropertyId(r.propertyId)
            setImage(r.image)
            setFeatured(r.featured)
          }, 0)
        }
      }
    }
  }, [editingReviewId, reviews])

  const handleSubmit = async () => {
    if (!name.trim() || !review.trim()) {
      useStore.getState().showModal('Mohon isi nama dan review.')
      return
    }
    await saveReview({
      id: editingReviewId || `review-${Date.now()}`,
      name,
      phone,
      rating,
      review,
      propertyId,
      image,
      featured,
      createdAt: editingReviewId ? reviews.find(r => r.id === editingReviewId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    useStore.getState().editingReviewId = null
    navigate('admin-reviews')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={editingReviewId ? 'Edit Review' : 'Tambah Review'} onBack={() => navigate('admin-reviews')} />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Nama" value={name} onChange={setName} placeholder="Nama pelanggan" />
          <InputField label="No. Telepon" value={phone} onChange={setPhone} placeholder="08xxxxxxxxxx" type="tel" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star, i) => (
                <button
                  key={`admin-review-form-star-${i}`}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="Tulis review pelanggan..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Properti (Opsional)</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih properti</option>
              {properties.map((p, i) => (
                <option key={`review-property-${i}`} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <InputField label="URL Gambar (Opsional)" value={image} onChange={setImage} placeholder="https://example.com/avatar.jpg" type="url" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Tampilkan sebagai review unggulan (featured)</span>
          </label>
        </div>

        <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors">
          {editingReviewId ? 'Update Review' : 'Simpan Review'}
        </button>
      </div>
    </div>
  )
}

/* ─── Front Articles ─── */
function FrontArticles() {
  const { navigate, articles } = useStore()
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = ['Tips Properti', 'Market Update', 'Tips Keuangan', 'Lokasi', 'Umum']
  const publishedArticles = articles.filter(a => a.published)
  const filteredArticles = categoryFilter ? publishedArticles.filter(a => a.category === categoryFilter) : publishedArticles

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="bg-blue-700 text-white px-4 py-4 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">Artikel</h1>
        <p className="text-sm text-blue-200">Tips dan informasi seputar properti</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !categoryFilter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada artikel</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  useStore.getState().selectedArticleId = article.id
                  navigate('front-article-detail')
                }}
                className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={article.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-medium mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Front Article Detail ─── */
function FrontArticleDetail() {
  const { navigate, articles } = useStore()
  const article = articles.find(a => a.id === useStore.getState().selectedArticleId)

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">Artikel tidak ditemukan</p>
          <button onClick={() => navigate('front-articles')} className="px-4 py-2 bg-blue-600 text-white rounded-xl">
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="relative">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
          alt={article.title}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => navigate('front-articles')}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-medium mb-3">
          {article.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>By {article.author}</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {article.excerpt && (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/10 rounded-r-xl">
            <p className="text-gray-600 dark:text-gray-400 italic">{article.excerpt}</p>
          </blockquote>
        )}

        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <button
          onClick={() => navigate('front-articles')}
          className="mt-8 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Kembali ke Artikel
        </button>
      </div>
    </div>
  )
}

/* ─── Admin Users ─── */
function AdminUsers() {
  const { navigate, adminUsers, deleteUser, showModal } = useStore()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Manajemen User"
        onBack={() => navigate('admin-settings')}
        rightAction={
          <button onClick={() => { useStore.getState().editingUserId = null; navigate('admin-user-form') }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminUsers.map((u, i) => (
          <div key={`admin-user-${u.id}-${i}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{u.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{u.username}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{u.role}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { useStore.getState().editingUserId = u.id; navigate('admin-user-form') }} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => showModal('Hapus user ini?', true, () => deleteUser(u.id))} className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin User Form ─── */
function AdminUserForm() {
  const { navigate, editingUserId, adminUsers, saveUser } = useStore()
  const existing = editingUserId ? adminUsers.find((u) => u.id === editingUserId) : null
  const [name, setName] = useState(existing?.name || '')
  const [username, setUsername] = useState(existing?.username || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(existing?.role || 'admin')

  const handleSave = async () => {
    if (!name.trim() || !username.trim()) { useStore.getState().showModal('Nama dan username wajib diisi.'); return }
    await saveUser({ id: editingUserId || undefined, name, username, password: password || undefined, role })
    navigate('admin-users')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit User' : 'Tambah User'} onBack={() => navigate('admin-users')} />
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Nama" value={name} onChange={setName} />
          <InputField label="Username" value={username} onChange={setUsername} />
          <InputField label={existing ? 'Password (kosongkan jika tidak diubah)' : 'Password'} value={password} onChange={setPassword} type="password" />
          <SelectField label="Role" value={role} onChange={setRole} options={[{ value: 'admin', label: 'Admin' }, { value: 'superadmin', label: 'Super Admin' }]} />
          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">{existing ? 'Simpan Perubahan' : 'Tambah User'}</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Locations ─── */
function AdminLocations() {
  const { navigate, locations, deleteLocation, showModal, fetchAllData } = useStore()
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/locations/bulk-template')
      if (!response.ok) throw new Error('Gagal download template')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-kabupaten.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Gagal download template')
    }
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/locations/bulk-upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setUploadResult(result)
        await fetchAllData()
      } else {
        alert(result.error || 'Gagal upload data')
      }
    } catch (error) {
      alert('Gagal upload data. Silakan coba lagi.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Database Kabupaten"
        onBack={() => navigate('admin-settings')}
        rightAction={
          <button onClick={() => { useStore.getState().editingLocationId = null; navigate('admin-location-form') }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* Bulk Actions */}
      <div className="px-4 mt-4 flex flex-wrap gap-2">
        <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <FileSpreadsheet className="w-4 h-4" />
          Template Excel
        </button>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Mengupload...' : 'Upload Massal'}
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleBulkUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="px-4 mt-4 space-y-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{uploadResult.summary.success}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Berhasil Ditambahkan</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-3">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{uploadResult.summary.duplicate}</div>
              <div className="text-xs text-orange-700 dark:text-orange-300">Duplikat Di-skip</div>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Hasil Upload:</h4>
            <div className="space-y-2">
              {uploadResult.results.map((r: any, i: number) => (
                <div key={`upload-result-${i}`} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.kabupaten}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.kecamatanCount} kecamatan</div>
                  </div>
                  {r.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button onClick={() => setUploadResult(null)} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
            Tutup
          </button>
        </div>
      )}

      {/* Location Cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((l, i) => (
          <div key={`admin-location-${l.id}-${i}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{l.kabupaten}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {l.kecamatan.map((d, k) => (<span key={`loc-${l.id}-kec-${k}`} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px]">{d}</span>))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { useStore.getState().editingLocationId = l.id; navigate('admin-location-form') }} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-medium flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => showModal('Hapus kabupaten ini?', true, () => deleteLocation(l.id))} className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Location Form ─── */
function AdminLocationForm() {
  const { navigate, editingLocationId, locations, saveLocation } = useStore()
  const existing = editingLocationId ? locations.find((l) => l.id === editingLocationId) : null
  const [kabupaten, setKabupaten] = useState(existing?.kabupaten || '')
  const [kecamatanStr, setKecamatanStr] = useState(existing?.kecamatan.join(', ') || '')

  const handleSave = async () => {
    if (!kabupaten.trim()) { useStore.getState().showModal('Nama kabupaten wajib diisi.'); return }
    const kecamatanArr = kecamatanStr.split(',').map((d) => d.trim()).filter(Boolean)
    await saveLocation({ id: editingLocationId || undefined, kabupaten, kecamatan: JSON.stringify(kecamatanArr) })
    navigate('admin-locations')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit Lokasi' : 'Tambah Lokasi'} onBack={() => navigate('admin-locations')} />
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Kabupaten" value={kabupaten} onChange={setKabupaten} placeholder="Nama kabupaten" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Kecamatan (pisahkan dengan koma)</label>
            <textarea value={kecamatanStr} onChange={(e) => setKecamatanStr(e.target.value)} rows={4} placeholder="Kebayoran Baru, Pondok Indah, Kemang" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">{existing ? 'Simpan Perubahan' : 'Tambah Lokasi'}</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Admin Property Types ─── */
function AdminPropertyTypes() {
  const { navigate, propertyTypes, deletePropertyType, showModal } = useStore()
  const sorted = [...propertyTypes].sort((a, b) => a.order - b.order)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader
        title="Jenis Properti"
        onBack={() => navigate('admin-settings')}
        rightAction={
          <button onClick={() => { useStore.getState().editingPropertyTypeId = null; navigate('admin-property-type-form') }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        {sorted.map((pt, i) => (
          <div key={`admin-pt-${pt.id}-${i}`} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <PropertyTypeIcon icon={pt.icon} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{pt.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Icon: {pt.icon} • Urutan: {pt.order}</p>
            </div>
            <button onClick={() => { useStore.getState().editingPropertyTypeId = pt.id; navigate('admin-property-type-form') }} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600"><Edit3 className="w-4 h-4" /></button>
            <button onClick={() => showModal('Hapus jenis ini?', true, () => deletePropertyType(pt.id))} className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Property Type Form ─── */
function AdminPropertyTypeForm() {
  const { navigate, editingPropertyTypeId, propertyTypes, savePropertyType } = useStore()
  const existing = editingPropertyTypeId ? propertyTypes.find((pt) => pt.id === editingPropertyTypeId) : null
  const [name, setName] = useState(existing?.name || '')
  const [icon, setIcon] = useState(existing?.icon || 'home')
  const [order, setOrder] = useState(String(existing?.order || propertyTypes.length))

  const iconOptions = ['home', 'building-2', 'building', 'trees', 'tent', 'castle', 'warehouse', 'landmark']

  const handleSave = async () => {
    if (!name.trim()) { useStore.getState().showModal('Nama jenis wajib diisi.'); return }
    await savePropertyType({ id: existing?.id, name, icon, order: Number(order) })
    navigate('admin-property-types')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader title={existing ? 'Edit Jenis Properti' : 'Tambah Jenis Properti'} onBack={() => navigate('admin-property-types')} />
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 space-y-4">
          <InputField label="Nama" value={name} onChange={setName} placeholder="Rumah, Apartemen, dll" />
          <InputField label="Urutan" value={order} onChange={setOrder} type="number" />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((ic) => (
                <button key={ic} onClick={() => setIcon(ic)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${icon === ic ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <PropertyTypeIcon icon={ic} className={`w-5 h-5 ${icon === ic ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors">{existing ? 'Simpan Perubahan' : 'Tambah Jenis'}</button>
        </div>
      </div>
    </div>
  )
}

/* ─── WhatsApp Link Preview ─── */
function WhatsAppPreview({ title, description, image, url }: { title: string; description: string; image: string; url: string }) {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/+$/, '').split('/')[0] || 'propertihub.com'
  return (
    <div className="bg-[#0b141a] rounded-xl p-3 max-w-[320px]">
      <div className="flex gap-2.5">
        {image && (
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1f2c34]">
            <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        )}
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-[13px] font-normal text-[#e9edef] leading-tight line-clamp-2">{title || 'Judul tidak tersedia'}</p>
          <p className="text-[12px] text-[#8696a0] leading-tight mt-0.5 line-clamp-2">{description || 'Deskripsi tidak tersedia'}</p>
          <p className="text-[11px] text-[#8696a0] mt-1">{domain}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Facebook Link Preview ─── */
function FacebookPreview({ title, description, image, url }: { title: string; description: string; image: string; url: string }) {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/+$/, '').split('/')[0] || 'propertihub.com'
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-[320px]">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-gray-100 relative overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
      <div className="p-2.5">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{domain}</p>
        <p className="text-[14px] font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-2">{title || 'Judul tidak tersedia'}</p>
        <p className="text-[12px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{description || 'Deskripsi tidak tersedia'}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   REUSABLE FORM FIELDS
   ═══════════════════════════════════════════════════ */

function InputField({ label, value, onChange, placeholder = '', type = 'text', disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
  )
}

function SelectField({ label, value, onChange, options, placeholder = 'Pilih...', disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; disabled?: boolean
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */

export function AppContent({ initialSlug }: { initialSlug?: string } = {}) {
  const { screen, fetchAllData, isDark, properties } = useStore()
  const slugHandledRef = useRef(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Handle direct URL access like /properti/some-permalink
  useEffect(() => {
    if (initialSlug && !slugHandledRef.current && properties.length > 0) {
      const prop = properties.find((p) => p.permalink === initialSlug)
      if (prop) {
        useStore.getState().selectedPropertyId = prop.id
        useStore.setState({ screen: 'front-detail' })
      }
      slugHandledRef.current = true
    }
  }, [initialSlug, properties.length])

  const renderScreen = () => {
    switch (screen) {
      // Frontend
      case 'front-home': return <FrontHome />
      case 'front-search': return <FrontSearch />
      case 'front-all-properties': return <FrontAllProperties />
      case 'front-detail': return <FrontDetail />
      case 'front-agents': return <FrontAgents />
      case 'front-articles': return <FrontArticles />
      case 'front-article-detail': return <FrontArticleDetail />
      // Admin
      case 'admin-login': return <AdminLogin />
      case 'admin-dashboard': return <AdminDashboard />
      case 'admin-listing': return <AdminListing />
      case 'admin-property-form': return <AdminPropertyForm />
      case 'admin-detail': return <AdminDetail />
      case 'admin-visitors': return <AdminVisitors />
      case 'admin-agents': return <AdminAgents />
      case 'admin-agent-form': return <AdminAgentForm />
      case 'admin-promos': return <AdminPromos />
      case 'admin-promo-form': return <AdminPromoForm />
      case 'admin-settings': return <AdminSettings />
      case 'admin-users': return <AdminUsers />
      case 'admin-user-form': return <AdminUserForm />
      case 'admin-locations': return <AdminLocations />
      case 'admin-location-form': return <AdminLocationForm />
      case 'admin-property-types': return <AdminPropertyTypes />
      case 'admin-property-type-form': return <AdminPropertyTypeForm />
      case 'admin-agency-form': return <AdminAgencyForm />
      case 'admin-seo-form': return <AdminSEOForm />
      case 'admin-analytics': return <AdminAnalytics />
      case 'admin-backup-restore': return <AdminBackupRestore />
      case 'admin-theme': return <AdminThemeSettings />
      case 'admin-articles': return <AdminArticles />
      case 'admin-article-form': return <AdminArticleForm />
      case 'admin-reviews': return <AdminReviews />
      case 'admin-review-form': return <AdminReviewForm />
      default: return <FrontHome />
    }
  }

  const isFrontend = screen.startsWith('front-')
  const showBottomNav = screen === 'front-home' || screen === 'front-all-properties' || screen === 'front-agents' || screen === 'front-articles' || screen === 'front-article-detail'

  return (
    <>
      <LoadingOverlay />
      <Modal />
      {isFrontend ? (
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-950 relative shadow-2xl">
          {renderScreen()}
          {showBottomNav && <BottomNav />}
        </div>
      ) : (
        <div className="max-w-[1024px] mx-auto min-h-screen bg-gray-50 dark:bg-gray-950 shadow-2xl">
          {renderScreen()}
        </div>
      )}
    </>
  )
}

export default function Page() {
  return <AppContent />
}
