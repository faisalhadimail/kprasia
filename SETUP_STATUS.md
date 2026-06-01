# 🏠 PropertiHub - Status Setup

## 🗄️ Database Lokal

**Type:** SQLite
**Location:** `/home/z/my-project/db/custom.db`
**Size:** 120KB

### 📊 Data Dummy

| Entity | Count |
|--------|-------|
| Properties | 5 |
| Agents | 2 |
| Promos | 3 |
| Locations (Kabupaten) | 3 |
| Property Types | 4 |
| Articles | 3 |
| Reviews | 3 |
| Admin Users | 1 |

### 🏢 Properties (5 Listing)

1. **Rumah Mewah di Dago Atas** - Rp 2.5 Milyar
2. **Apartemen Modern di Cibiru** - Rp 750 Juta
3. **Ruko Strategis di Bekasi** - Rp 1.2 Milyar
4. **Tanah Kavling di Bogor** - Rp 450 Juta
5. **Cluster Rumah Minimalis** - Rp 850 Juta

### 📍 Locations

- **Bandung**: 16 kecamatan
- **Bogor**: 6 kecamatan
- **Bekasi**: 9 kecamatan

### 🎁 Promos

- PROMO - Gratis Biaya KPR
- HOT - Diskon DP 20%
- BEST - Cashback 15 Juta

## 🔐 Admin Login

```
Username: admin
Password: admin123
```

## 🚀 Server Status

- **Framework:** Next.js 16.1.3 with Turbopack
- **Port:** 3000
- **Host:** 0.0.0.0 (accessible from all interfaces)
- **Status:** Running
- **Mode:** Development with Hot Reload

## 📝 Commands

### Start Server
```bash
bun run dev
```

### Database Operations
```bash
# Push schema changes
bun run db:push

# Generate Prisma Client
bun run db:generate

# Seed dummy data
bun run db:seed
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/seed-data` | GET | Get all data |
| `/api/properties` | GET/POST/DELETE | CRUD Properties |
| `/api/agents` | GET/POST/DELETE | CRUD Agents |
| `/api/promos` | GET/POST/DELETE | CRUD Promos |
| `/api/visitors` | GET/POST/PUT/DELETE | CRUD Visitors/Leads |
| `/api/locations` | GET/POST/DELETE | CRUD Locations |
| `/api/property-types` | GET/POST/DELETE | CRUD Property Types |
| `/api/agency` | GET/PUT | Agency Settings |
| `/api/seo` | GET/PUT | SEO Settings |
| `/api/articles` | GET/POST/DELETE | CRUD Articles |
| `/api/reviews` | GET/POST/DELETE | CRUD Reviews |
| `/api/auth` | POST | Admin Authentication |
| `/api/leads/submit` | POST | Submit Lead Form |

## 📱 Features

### Frontend (Public)
- ✅ Home page dengan properti terbaru
- ✅ Search properti berdasarkan filter
- ✅ Detail properti dengan gambar slider
- ✅ Simulasi KPR
- ✅ List agen
- ✅ Artikel
- ✅ Testimoni
- ✅ Submit lead/pencarian

### Backend (Admin)
- ✅ Dashboard overview
- ✅ Manajemen properti (CRUD)
- ✅ Manajemen agen (CRUD)
- ✅ Manajemen promo (CRUD)
- ✅ Manajemen lokasi (CRUD)
- ✅ Manajemen jenis properti (CRUD)
- ✅ Manajemen visitor/leads (CRUD + update status)
- ✅ Manajemen artikel (CRUD)
- ✅ Manajemen review (CRUD)
- ✅ Settings Agency
- ✅ Settings SEO
- ✅ Backup & Restore data

## 🎨 Tech Stack

- **Frontend:** Next.js 16.1.3, React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, shadcn/ui
- **State Management:** Zustand
- **Database:** SQLite with Prisma ORM
- **Icons:** Lucide React
- **Charts:** Recharts

## 📌 Notes

- Database menggunakan file SQLite lokal (`db/custom.db`)
- Semua data sudah ter-seed dengan dummy data
- Server berjalan di port 3000 dengan hot reload
- Preview panel tersedia di sebelah kanan

---

**Status:** ✅ Ready to use
**Last Updated:** 2025-05-31