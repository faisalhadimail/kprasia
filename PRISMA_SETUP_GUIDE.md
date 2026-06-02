# Setup Database dengan Prisma ORM

## ✅ Yang Sudah Dilakukan

1. **Prisma Schema** telah diupdate dan di-generate
2. **API Routes** diubah untuk menggunakan Prisma:
   - `/api/admin-users` - User Manager
   - `/api/visitors` - Leads
   - `/api/auth` - Login
   - `/api/db-status` - Cek status database
3. **Seed Script** dibuat untuk data sample

## 🔧 Cara Setup Database dengan Prisma

### Langkah 1: Koneksi ke Supabase

Database URL sudah dikonfigurasi di `.env`:
```
DATABASE_URL="postgresql://postgres:SumateraP11@db.cdornopbukdwgysgpvrf.supabase.co:5432/postgres"
```

### Langkah 2: Push Schema ke Database

Pastikan koneksi Supabase sudah aktif (pastikan password benar), lalu jalankan:

```bash
bun run db:push
```

Ini akan membuat semua tabel berdasarkan `prisma/schema.prisma`.

### Langkah 3: Seed Data Sample

Setelah tabel dibuat, jalankan seed script untuk memasukkan data sample:

```bash
bun run db:seed
```

Data yang akan dibuat:
- ✅ 3 Admin Users (username: admin, marketing, sales / password: admin123)
- ✅ 4 Property Types (Rumah, Apartemen, Ruko, Tanah)
- ✅ 3 Locations (Palembang, Lahat, Prabumulih)
- ✅ 3 Promos
- ✅ 3 Agents
- ✅ 3 Sample Visitors/Leads

### Langkah 4: Login ke Admin Panel

Buka aplikasi dan login dengan:
- **Username:** admin
- **Password:** admin123

## 📊 Struktur Database (Prisma)

### Models yang tersedia:

1. **AdminUser** - User admin untuk login
2. **PropertyType** - Jenis properti (Rumah, Apartemen, dll)
3. **Location** - Lokasi (Kabupaten, Kecamatan)
4. **Agent** - Data agen properti
5. **Promo** - Promo diskon
6. **Property** - Data properti
7. **PropertyPromo** - Relasi Property ↔ Promo (many-to-many)
8. **Article** - Artikel blog
9. **Review** - Review pelanggan
10. **Visitor** - Leads/pengunjung

## 🚨 Jika Terjadi Error

### Error: "Can't reach database server"

Ini berarti tidak bisa connect ke Supabase. Solusi:

1. Cek password di `.env` file
2. Pastikan Supabase project aktif
3. Coba refresh connection di Supabase dashboard

### Error: "Table not found"

Jalankan:
```bash
bun run db:push
```

### Error saat seed data

Cek apakah tabel sudah dibuat dengan `bun run db:push`, baru jalankan `bun run db:seed`

## 📝 Perintah Prisma yang Tersedia

```bash
# Generate Prisma client
bun run db:generate

# Push schema ke database (tanpa migration)
bun run db:push

# Seed data sample
bun run db:seed

# Buat migration baru
bun run db:migrate

# Reset database (delete semua data dan tabel)
bun run db:reset
```

## 🔍 Cara Cek Status Database

1. Buka halaman login (klik icon shield di homepage)
2. Status database akan muncul
3. Jika "Database Terhubung" = OK
4. Jika "Database Terputus" = Cek koneksi

## 📚 API Routes yang Menggunakan Prisma

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin-users` | GET/POST/PUT/DELETE | CRUD Admin Users |
| `/api/visitors` | GET/POST/PUT/DELETE | CRUD Leads/Visitors |
| `/api/auth` | POST | Login authentication |
| `/api/db-status` | GET | Cek status database |
| `/api/setup-prisma` | POST | Cek & setup database |

## 💡 Keuntungan Menggunakan Prisma

1. **Type Safety** - Otomatis TypeScript types
2. **Auto-completion** - IDE support penuh
3. **Clean Queries** - Syntax yang mudah dibaca
4. **Relations** - Handling relasi jadi lebih mudah
5. **Migrations** - Version control untuk database schema

## 🔄 Perubahan dari Supabase Direct ke Prisma

### Sebelumnya (Supabase Direct):
```typescript
const { data, error } = await supabase.from('AdminUser').select('*')
```

### Sekarang (Prisma):
```typescript
const users = await db.adminUser.findMany()
```

Lebih clean dan type-safe! 🎉