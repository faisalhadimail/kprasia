# Cara Setup Database Supabase

## Langkah 1: Setup Tables di Supabase

1. Buka browser dan akses: https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new

2. Copy SQL script dari file `/home/z/my-project/supabase-setup-v2.sql`

3. Paste script ke SQL Editor Supabase

4. Klik tombol **"Run"** (atau tekan Ctrl+Enter)

5. Tunggu sampai eksekusi selesai (sekitar 10-30 detik)

6. Anda akan melihat pesan "Success" jika berhasil

## Langkah 2: Verifikasi Setup

Setelah SQL berhasil dieksekusi, Anda bisa:
- Cek tabel di sidebar: Table Editor → Anda akan melihat tabel: AdminUser, Visitor, Property, dll
- Cek data sample: Buka tabel AdminUser → akan ada 3 admin user

## Login ke Admin

Gunakan credentials berikut untuk login:
- **Username:** admin
- **Password:** admin123

## Data Sample yang Dibuat

Database setup akan membuat:
- ✅ 10 Tabel (AdminUser, Property, Visitor, Promo, Agent, dll)
- ✅ 3 Admin Users
- ✅ 3 Sample Properties
- ✅ 3 Sample Visitors/Leads
- ✅ 3 Sample Agents
- ✅ 3 Sample Articles
- ✅ 3 Sample Reviews
- ✅ 4 Property Types
- ✅ 3 Locations (Palembang, Lahat, Prabumulih)
- ✅ 3 Promos

## Jika Ada Error

Jika SQL Editor menampilkan error:
1. Pastikan password database sudah benar
2. Coba refresh halaman SQL Editor
3. Copy ulang script dari `/home/z/my-project/supabase-setup-v2.sql`

## Database URL

Jika perlu menggunakan tools lain (psql, Prisma Studio, dll):

```
Host: db.cdornopbukdwgysgpvrf.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: SumateraP11
```

## Supabase Dashboard Link

- **Project Dashboard:** https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf
- **Table Editor:** https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/editor
- **SQL Editor:** https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new
- **API Settings:** https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/settings/api