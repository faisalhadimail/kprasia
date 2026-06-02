-- =============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Database: cdornopbukdwgysgpvrf.supabase.co
-- =============================================
-- Instructions:
-- 1. Open https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new
-- 2. Copy and paste this entire script
-- 3. Click "Run" to execute
-- =============================================

-- Drop existing tables to start fresh (ORDER MATTERS due to foreign keys)
DROP TABLE IF EXISTS PropertyPromo CASCADE;
DROP TABLE IF EXISTS Property CASCADE;
DROP TABLE IF EXISTS Promo CASCADE;
DROP TABLE IF EXISTS Visitor CASCADE;
DROP TABLE IF EXISTS AdminUser CASCADE;
DROP TABLE IF EXISTS Agent CASCADE;
DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS PropertyType CASCADE;
DROP TABLE IF EXISTS SEO CASCADE;
DROP TABLE IF EXISTS Agency CASCADE;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Agency table
CREATE TABLE Agency (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT DEFAULT 'PropertiHub',
  phone       TEXT DEFAULT '',
  address     TEXT DEFAULT '',
  "kprInterest" NUMERIC DEFAULT 5.5,
  createdAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO table
CREATE TABLE SEO (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "frontendUrl" TEXT DEFAULT '',
  title       TEXT DEFAULT 'PropertiHub - Temukan Hunian Impian Anda',
  description TEXT DEFAULT 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
  keywords    TEXT DEFAULT 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
  image       TEXT DEFAULT 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  createdAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PropertyType table
CREATE TABLE PropertyType (
  id   TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'home',
  order_num INTEGER DEFAULT 0
);

-- Location table
CREATE TABLE Location (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  kabupaten  TEXT NOT NULL,
  kecamatan  TEXT DEFAULT '[]',
  createdAt  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AdminUser table
CREATE TABLE AdminUser (
  id       TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name     TEXT DEFAULT '',
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email    TEXT,
  role     TEXT DEFAULT 'admin',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor (Leads) table
CREATE TABLE Visitor (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  date      TEXT DEFAULT '',
  name      TEXT DEFAULT '',
  phone     TEXT DEFAULT '',
  email     TEXT,
  type      TEXT DEFAULT '',
  building  TEXT DEFAULT '',
  location  TEXT DEFAULT '',
  dp        TEXT DEFAULT '',
  promo     TEXT DEFAULT '',
  status    TEXT DEFAULT 'Baru',
  notes     TEXT,
  interest  TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent table
CREATE TABLE Agent (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  role      TEXT DEFAULT 'Agen Properti',
  phone     TEXT DEFAULT '',
  image     TEXT DEFAULT 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo table
CREATE TABLE Promo (
  id       TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  badge    TEXT DEFAULT 'PROMO',
  title    TEXT NOT NULL,
  subtitle TEXT DEFAULT ''
);

-- Property table
CREATE TABLE Property (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  dp          NUMERIC DEFAULT 0,
  "allInCost" NUMERIC DEFAULT 0,
  kabupaten   TEXT NOT NULL,
  kecamatan   TEXT DEFAULT '',
  type        TEXT NOT NULL,
  "buildingType" TEXT DEFAULT '',
  description TEXT DEFAULT '',
  images      TEXT DEFAULT '[]',
  brochure    TEXT DEFAULT '',
  permalink   TEXT UNIQUE DEFAULT '',
  "seoTitle"    TEXT DEFAULT '',
  "seoDesc"     TEXT DEFAULT '',
  "seoKeywords" TEXT DEFAULT '',
  "seoAuto"     BOOLEAN DEFAULT TRUE,
  createdAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PropertyPromo junction table
CREATE TABLE PropertyPromo (
  propertyId TEXT NOT NULL,
  promoId    TEXT NOT NULL,
  PRIMARY KEY (propertyId, promoId),
  FOREIGN KEY (propertyId) REFERENCES Property(id) ON DELETE CASCADE,
  FOREIGN KEY (promoId) REFERENCES Promo(id) ON DELETE CASCADE
);

-- =============================================
-- CREATE INDEXES
-- =============================================

CREATE INDEX idx_visitor_created_at ON Visitor(createdAt DESC);
CREATE INDEX idx_visitor_status ON Visitor(status);
CREATE INDEX idx_adminuser_username ON AdminUser(username);
CREATE INDEX idx_property_permalink ON Property(permalink);
CREATE INDEX idx_property_kabupaten ON Property(kabupaten);
CREATE INDEX idx_property_type ON Property(type);
CREATE INDEX idx_property_created_at ON Property(createdAt DESC);

-- =============================================
-- SEED DATA
-- =============================================

-- Agency
INSERT INTO Agency (name, phone, address, "kprInterest")
VALUES ('PropertiHub', '+62 21 1234 5678', 'Jakarta, Indonesia', 5.5);

-- SEO
INSERT INTO SEO (title, description, keywords, image)
VALUES (
  'PropertiHub - Temukan Hunian Impian Anda',
  'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
  'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
);

-- Admin Users
INSERT INTO AdminUser (username, password, name, email, role)
VALUES
  ('admin', 'admin123', 'Super Admin', 'admin@example.com', 'superadmin'),
  ('marketing', 'marketing123', 'Marketing Team', 'marketing@example.com', 'admin'),
  ('sales', 'sales123', 'Sales Team', 'sales@example.com', 'admin');

-- Visitors/Leads
INSERT INTO Visitor (name, phone, email, type, building, location, status, notes, interest)
VALUES
  ('Budi Santoso', '081234567890', 'budi@email.com', 'Rumah', '90m²', 'Jakarta Selatan', 'Baru', 'Lead dari website', 'Rumah Minimalis'),
  ('Siti Rahayu', '081234567891', 'siti@email.com', 'Apartemen', '2BR', 'Jakarta Pusat', 'Follow Up', 'Ingin info unit 2BR', 'Apartemen Mewah'),
  ('Andi Wijaya', '081234567892', 'andi@email.com', 'Rumah', '120m²', 'Bogor', 'Hot Lead', 'Siap KPR, survey minggu depan', 'Cluster Family'),
  ('Dewi Lestari', '081234567893', 'dewi@email.com', 'Ruko', '2 Lantai', 'Bandung', 'Closing', 'Booking fee sudah dibayarkan', 'Ruko Komersial'),
  ('Eko Pratama', '081234567894', 'eko@email.com', 'Tanah', '200m²', 'Bekasi', 'Baru', 'Cari lokasi strategis dekat tol', 'Tanah Kavling');

-- Agents
INSERT INTO Agent (name, role, phone, image)
VALUES
  ('Ahmad Wijaya', 'Senior Agent', '+62 812 3456 7890', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'),
  ('Sarah Putri', 'Property Consultant', '+62 812 3456 7891', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
  ('Budi Santoso', 'Sales Agent', '+62 812 3456 7892', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80');

-- Property Types
INSERT INTO PropertyType (name, icon, order_num)
VALUES
  ('Rumah', 'home', 1),
  ('Apartemen', 'building', 2),
  ('Ruko', 'store', 3),
  ('Tanah', 'map', 4),
  ('Villa', 'house', 5);

-- Locations
INSERT INTO Location (kabupaten, kecamatan)
VALUES
  ('Jakarta Selatan', '["Tebet", "Setiabudi", "Kebayoran Baru", "Pasar Minggu", "Jagakarsa"]'),
  ('Jakarta Pusat', '["Menteng", "Gambir", "Tanah Abang", "Senen", "Cempaka Putih"]'),
  ('Jakarta Barat', '["Kebon Jeruk", "Cengkareng", "Kalideres", "Tambora", "Grogol"]'),
  ('Jakarta Timur', '["Cibubur", "Pulogadung", "Duren Sawit", "Kramat Jati", "Makasar"]'),
  ('Jakarta Utara', '["Kelapa Gading", "Cilincing", "Koja", "Pademangan", "Tanjung Priok"]'),
  ('Bogor', '["Cibinong", "Citeureup", "Sentul", "Ciawi", "Megamendung"]'),
  ('Depok', '["Cinere", "Pancoran Mas", "Beji", "Cipayung", "Sawangan"]'),
  ('Tangerang', '["BSD City", "Serpong", "Ciledug", "Karawaci", "Bintaro"]'),
  ('Bekasi', '["Cikarang", "Bekasi Barat", "Bekasi Timur", "Medan Satria", "Tambun"]'),
  ('Bandung', '["Dago", "Ciumbuleuit", "Cibiru", "Arcamanik", "Cicendo"]');

-- Promos
INSERT INTO Promo (badge, title, subtitle)
VALUES
  ('HOT', 'Diskon DP 50%', 'Hanya bulan ini'),
  ('BEST', 'Free Biaya KPR', 'Syarat & ketentuan berlaku'),
  ('NEW', 'Cashback 5 Juta', 'Untuk pembelian cash');

-- =============================================
-- VERIFICATION
-- =============================================

-- Show summary
SELECT 'Database Setup Complete!' as message;

-- Count records in each table
SELECT 'Agency' as table_name, COUNT(*) as count FROM Agency
UNION ALL
SELECT 'AdminUser', COUNT(*) FROM AdminUser
UNION ALL
SELECT 'Visitor', COUNT(*) FROM Visitor
UNION ALL
SELECT 'Agent', COUNT(*) FROM Agent
UNION ALL
SELECT 'PropertyType', COUNT(*) FROM PropertyType
UNION ALL
SELECT 'Location', COUNT(*) FROM Location
UNION ALL
SELECT 'Promo', COUNT(*) FROM Promo
UNION ALL
SELECT 'Property', COUNT(*) FROM Property;