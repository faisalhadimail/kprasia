# 🚨 SETUP DATABASE - PENTING!

## Masalah

Database Supabase **SUDAH TERHUBUNG**, tapi **TABEL BELUM DIBUAT**.

## Solusi Cepat - Setup Tabel Database

### Langkah 1: Buka SQL Editor Supabase

Klik link ini: **https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new**

### Langkah 2: Copy SQL Script

Copy script berikut:

```sql
-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS "PropertyPromo" CASCADE;
DROP TABLE IF EXISTS "Visitor" CASCADE;
DROP TABLE IF EXISTS "AdminUser" CASCADE;
DROP TABLE IF EXISTS "Property" CASCADE;
DROP TABLE IF EXISTS "Agent" CASCADE;
DROP TABLE IF EXISTS "Promo" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;
DROP TABLE IF EXISTS "PropertyType" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;

-- Create AdminUser table
CREATE TABLE "AdminUser" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'admin',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Visitor table
CREATE TABLE "Visitor" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD'),
  name TEXT,
  phone TEXT,
  email TEXT,
  type TEXT,
  building TEXT,
  location TEXT,
  dp TEXT,
  promo TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  interest TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample Admin Users
INSERT INTO "AdminUser" (name, username, password, email, role) VALUES
  ('Super Admin', 'admin', 'admin123', 'admin@propertihub.com', 'superadmin'),
  ('Marketing Manager', 'marketing', 'admin123', 'marketing@propertihub.com', 'admin'),
  ('Sales Agent', 'sales', 'admin123', 'sales@propertihub.com', 'admin');

-- Insert sample Visitors
INSERT INTO "Visitor" (name, phone, email, type, building, location, dp, promo, status, interest) VALUES
  ('Budi Santoso', '081234567890', 'budi@gmail.com', 'Rumah', '45/72', 'Palembang, Ilir Timur I', 'Rp 50.000.000', 'Diskon DP 0%', 'hot', 'Tinggi'),
  ('Siti Aminah', '081234567891', 'siti@gmail.com', 'Rumah', '60/90', 'Palembang, Ilir Timur II', 'Rp 65.000.000', 'Free Biaya KPR', 'warm', 'Sedang'),
  ('Ahmad Fauzi', '081234567892', 'ahmad@gmail.com', 'Ruko', '80/60', 'Palembang, Ilir Barat I', 'Rp 85.000.000', 'Bonus Furnitur', 'new', 'Tinggi');

-- Create indexes for better performance
CREATE INDEX idx_visitor_date ON "Visitor"(date);
CREATE INDEX idx_visitor_status ON "Visitor"(status);

-- Enable Row Level Security (RLS)
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Visitor" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (DEMO ONLY - restrict in production)
CREATE POLICY "Public read access" ON "AdminUser" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Visitor" FOR SELECT USING (true);
CREATE POLICY "All operations" ON "AdminUser" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Visitor" FOR ALL USING (true) WITH CHECK (true);

COMMIT;
```

### Langkah 3: Paste dan Eksekusi

1. Paste script ke SQL Editor Supabase
2. Klik tombol **"Run"**
3. Tunggu sampai success message muncul

### Langkah 4: Refresh Halaman

Setelah SQL berhasil, refresh halaman Preview Panel

## Login ke Admin

**Username:** admin  
**Password:** admin123

## Cek Status Database

Buka halaman login (klik icon shield di homepage) dan lihat status database.

## Apa yang Terjadi?

- ✅ Supabase **SUDAH TERHUBUNG** (API connect berhasil)
- ❌ Tabel **BELUM DIBUAT** (perlu SQL script)
- ✅ Aplikasi siap setelah tabel dibuat

## Keuntungan Supabase REST API vs Prisma Direct

| Metode | Status |
|--------|--------|
| Supabase Direct (Prisma) | ❌ Firewall memblokir port 5432 |
| Supabase REST API | ✅ Berjalan (HTTP-based) |

Karena itu kita kembali menggunakan **Supabase REST API** yang bekerja lebih baik di environment ini.