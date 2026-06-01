-- ═══════════════════════════════════════════════════════════════
-- PROPERTIHUB - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Trigger function for updatedAt ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════

-- Agency (singleton)
CREATE TABLE IF NOT EXISTS "Agency" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL DEFAULT 'PropertiHub',
  "phone" TEXT NOT NULL DEFAULT '',
  "address" TEXT NOT NULL DEFAULT '',
  "kprInterest" REAL NOT NULL DEFAULT 5.5,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SEO (singleton)
CREATE TABLE IF NOT EXISTS "SEO" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "frontendUrl" TEXT NOT NULL DEFAULT '',
  "title" TEXT NOT NULL DEFAULT 'PropertiHub - Temukan Hunian Impian Anda',
  "description" TEXT NOT NULL DEFAULT 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
  "keywords" TEXT NOT NULL DEFAULT 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
  "image" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PropertyType
CREATE TABLE IF NOT EXISTS "PropertyType" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "icon" TEXT NOT NULL DEFAULT 'home',
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Location (kecamatan as JSONB array)
CREATE TABLE IF NOT EXISTS "Location" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "kabupaten" TEXT NOT NULL,
  "kecamatan" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property (images as JSONB array)
CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "dp" REAL NOT NULL DEFAULT 0,
  "allInCost" REAL NOT NULL DEFAULT 0,
  "kabupaten" TEXT NOT NULL,
  "kecamatan" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL,
  "buildingType" TEXT NOT NULL DEFAULT '',
  "description" TEXT NOT NULL DEFAULT '',
  "images" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "brochure" TEXT NOT NULL DEFAULT '',
  "permalink" TEXT NOT NULL DEFAULT '' UNIQUE,
  "seoTitle" TEXT NOT NULL DEFAULT '',
  "seoDesc" TEXT NOT NULL DEFAULT '',
  "seoKeywords" TEXT NOT NULL DEFAULT '',
  "seoAuto" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Promo
CREATE TABLE IF NOT EXISTS "Promo" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "badge" TEXT NOT NULL DEFAULT 'PROMO',
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL DEFAULT ''
);

-- PropertyPromo (join table)
CREATE TABLE IF NOT EXISTS "PropertyPromo" (
  "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
  "promoId" TEXT NOT NULL REFERENCES "Promo"("id") ON DELETE CASCADE,
  PRIMARY KEY ("propertyId", "promoId")
);

-- Agent
CREATE TABLE IF NOT EXISTS "Agent" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'Agen Properti',
  "phone" TEXT NOT NULL DEFAULT '',
  "image" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Visitor
CREATE TABLE IF NOT EXISTS "Visitor" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "date" TEXT NOT NULL,
  "name" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "type" TEXT NOT NULL DEFAULT '',
  "building" TEXT NOT NULL DEFAULT '',
  "location" TEXT NOT NULL DEFAULT '',
  "dp" TEXT NOT NULL DEFAULT '',
  "promo" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'Baru',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AdminUser
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL DEFAULT '',
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════

CREATE TRIGGER "Agency_updatedAt" BEFORE UPDATE ON "Agency" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "SEO_updatedAt" BEFORE UPDATE ON "SEO" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "Location_updatedAt" BEFORE UPDATE ON "Location" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "Property_updatedAt" BEFORE UPDATE ON "Property" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "Agent_updatedAt" BEFORE UPDATE ON "Agent" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "Visitor_updatedAt" BEFORE UPDATE ON "Visitor" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER "AdminUser_updatedAt" BEFORE UPDATE ON "AdminUser" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY (allow all for anon)
-- ═══════════════════════════════════════════

ALTER TABLE "Agency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SEO" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Promo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyPromo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Visitor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on Agency" ON "Agency" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on SEO" ON "SEO" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on PropertyType" ON "PropertyType" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Location" ON "Location" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Property" ON "Property" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Promo" ON "Promo" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on PropertyPromo" ON "PropertyPromo" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Agent" ON "Agent" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Visitor" ON "Visitor" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on AdminUser" ON "AdminUser" FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════

-- Admin User
INSERT INTO "AdminUser" ("name", "username", "password", "role") VALUES
('Administrator', 'admin', 'admin123', 'admin');

-- Agency
INSERT INTO "Agency" ("name", "phone", "address", "kprInterest") VALUES
('PropertiHub', '0812-3456-7890', 'Jl. Raya Properti No. 1, Tangerang Selatan', 5.5);

-- SEO
INSERT INTO "SEO" ("frontendUrl", "title", "description", "keywords", "image") VALUES
('', 'PropertiHub - Temukan Hunian Impian Anda', 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.', 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80');

-- Property Types
INSERT INTO "PropertyType" ("name", "icon", "order") VALUES
('Rumah', 'home', 0),
('Apartemen', 'building-2', 1),
('Tanah', 'trees', 2),
('Ruko', 'building', 3),
('Kavling', 'tent', 4);

-- Locations
INSERT INTO "Location" ("kabupaten", "kecamatan") VALUES
('Tangerang Selatan', '["Serpong", "Serpong Utara", "Ciputat", "Ciputat Timur", "Pamulang", "Pondok Aren", "Bintaro"]'::jsonb),
('Tangerang', '["Cikupa", "Balaraja", "Kota Tangerang", "Cibodas", "Karawaci", "Pinang"]'::jsonb),
('Bekasi', '["Bekasi Selatan", "Bekasi Timur", "Bekasi Barat", "Cikarang", "Cibitung", "Jababeka"]'::jsonb),
('Bogor', '["Bogor Selatan", "Bogor Utara", "Bogor Tengah", "Dramaga", "Ciomas", "Cibinong"]'::jsonb),
('Depok', '["Beji", "Cimanggis", "Depok", "Sawangan", "Pancoran Mas", "Limau Prasok"]'::jsonb);

-- Promos
INSERT INTO "Promo" ("badge", "title", "subtitle") VALUES
('DISKON', 'Diskon Spesial', 'Potongan harga langsung untuk pembelian pertama'),
('FREE AC', 'Free AC', 'Gratis pemasangan AC setiap unit'),
('DP 0%', 'DP 0 Rupiah', 'Beli tanpa uang muka, cicilan ringan'),
('BONUS FURNITURE', 'Bonus Furniture', 'Lengkap dengan furniture premium'),
('FREE BIAYA KPR', 'Free Biaya KPR', 'Gratis provisi, notaris, dan administrasi');

-- Agents
INSERT INTO "Agent" ("name", "role", "phone", "image") VALUES
('Budi Santoso', 'Senior Agent', '0812-9876-5432', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'),
('Siti Rahayu', 'Property Consultant', '0813-8765-4321', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
('Ahmad Wijaya', 'Marketing Executive', '0857-6543-2109', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80');

-- Properties
INSERT INTO "Property" ("id", "title", "price", "dp", "allInCost", "kabupaten", "kecamatan", "type", "buildingType", "description", "images", "permalink", "seoTitle", "seoDesc", "seoKeywords", "seoAuto") VALUES
('prop-001', 'Griya Asri Residence Serpong', 750000000, 75000000, 825000000, 'Tangerang Selatan', 'Serpong', 'Rumah', '36/72', 'Rumah modern minimalis di kawasan Serpong yang sedang berkembang pesat. Dekat dengan fasilitas pendidikan, kesehatan, dan perbelanjaan. Akses mudah ke tol dan stasiun.', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'griya-asri-residence-serpong', 'Griya Asri Residence Serpong - Rumah di Tangerang Selatan 750 Juta', 'Dijual rumah tipe 36/72 Griya Asri Residence Serpong di Serpong, Tangerang Selatan. Harga Rp750.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'griya asri, rumah serpong, rumah tangerang selatan, properti tangerang selatan, dijual rumah serpong, propertihub', false),

('prop-002', 'Apartemen Green Valley Pamulang', 450000000, 0, 450000000, 'Tangerang Selatan', 'Pamulang', 'Apartemen', 'Studio', 'Apartemen studio modern dengan pemandangan kota. Cocok untuk investasi atau hunian pertama. Fasilitas lengkap: pool, gym, security 24 jam.', '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'apartemen-green-valley-pamulang', 'Apartemen Green Valley Pamulang - Apartemen di Tangerang Selatan 450 Juta', 'Dijual apartemen tipe Studio Apartemen Green Valley Pamulang di Pamulang, Tangerang Selatan. Harga Rp450.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'green valley, apartemen pamulang, apartemen tangerang selatan, properti tangerang selatan, dijual apartemen pamulang, propertihub', false),

('prop-003', 'Tanah Strategis Cikarang', 1200000000, 0, 1200000000, 'Bekasi', 'Cikarang', 'Tanah', '', 'Tanah strategis di kawasan industri Cikarang. Cocok untuk gudang, pabrik, atau investasi jangka panjang. Akses langsung ke jalan tol.', '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'tanah-strategis-cikarang', 'Tanah Strategis Cikarang - Tanah di Bekasi 1.2 Miliar', 'Dijual tanah Tanah Strategis Cikarang di Cikarang, Bekasi. Harga Rp1.200.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'tanah strategis, tanah cikarang, tanah bekasi, properti bekasi, dijual tanah cikarang, propertihub', false),

('prop-004', 'Ruko Business Park Bintaro', 2500000000, 500000000, 2700000000, 'Tangerang Selatan', 'Bintaro', 'Ruko', '3 Lantai', 'Ruko 3 lantai di kawasan bisnis Bintaro. Lokasi premium dengan traffic tinggi. Ideal untuk segala jenis usaha.', '["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'ruko-business-park-bintaro', 'Ruko Business Park Bintaro - Ruko di Tangerang Selatan 2.5 Miliar', 'Dijual ruko tipe 3 Lantai Ruko Business Park Bintaro di Bintaro, Tangerang Selatan. Harga Rp2.500.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'ruko business park, ruko bintaro, ruko tangerang selatan, properti tangerang selatan, dijual ruko bintaro, propertihub', false),

('prop-005', 'Kavling Islami Bogor Selatan', 350000000, 35000000, 385000000, 'Bogor', 'Bogor Selatan', 'Kavling', '72', 'Kavling siap bangun di kawasan Islami Bogor Selatan. Lingkungan asri, udara sejuk, dekat masjid dan fasilitas umum.', '["https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kavling-islami-bogor-selatan', 'Kavling Islami Bogor Selatan - Kavling di Bogor 350 Juta', 'Dijual kavling tipe 72 Kavling Islami Bogor Selatan di Bogor Selatan, Bogor. Harga Rp350.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'kavling islami, kavling bogor selatan, kavling bogor, properti bogor, dijual kavling bogor selatan, propertihub', false),

('prop-006', 'Rumah Cluster Karawaci', 980000000, 98000000, 1078000000, 'Tangerang', 'Karawaci', 'Rumah', '45/90', 'Rumah cluster eksklusif di Karawaci. One gate system, keamanan 24 jam, club house, dan taman bermain. Dekat Supermal Karawaci.', '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'rumah-cluster-karawaci', 'Rumah Cluster Karawaci - Rumah di Tangerang 980 Juta', 'Dijual rumah tipe 45/90 Rumah Cluster Karawaci di Karawaci, Tangerang. Harga Rp980.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'rumah cluster, rumah karawaci, rumah tangerang, properti tangerang, dijual rumah karawaci, propertihub', false),

('prop-007', 'Apartemen Sudirman Park Depok', 380000000, 0, 380000000, 'Depok', 'Depok', 'Apartemen', '1 BR', 'Apartemen 1 bedroom di jantung kota Depok. Dekat UI, Stasiun Depok, dan mall. Investment yield tinggi.', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'apartemen-sudirman-park-depok', 'Apartemen Sudirman Park Depok - Apartemen di Depok 380 Juta', 'Dijual apartemen tipe 1 BR Apartemen Sudirman Park Depok di Depok, Depok. Harga Rp380.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'sudirman park, apartemen depok, apartemen depok, properti depok, dijual apartemen depok, propertihub', false),

('prop-008', 'Rumah Town House Cibinong', 650000000, 65000000, 715000000, 'Bogor', 'Cibinong', 'Rumah', '40/80', 'Town house modern di Cibinong. Desain minimalis, lingkungan asri. Dekat PNRI, IPB, dan akses tol Jagorawi.', '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'rumah-town-house-cibinong', 'Rumah Town House Cibinong - Rumah di Bogor 650 Juta', 'Dijual rumah tipe 40/80 Rumah Town House Cibinong di Cibinong, Bogor. Harga Rp650.000.000. Temukan penawaran terbaik hanya di PropertiHub.', 'town house, rumah cibinong, rumah bogor, properti bogor, dijual rumah cibinong, propertihub', false);

-- Property-Promo relations (prop-001: DISKON + FREE AC, prop-004: DP 0% + FREE BIAYA KPR, prop-006: BONUS FURNITURE + DISKON, prop-008: DP 0%)
INSERT INTO "PropertyPromo" ("propertyId", "promoId")
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-001' AND pr.badge = 'DISKON'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-001' AND pr.badge = 'FREE AC'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-004' AND pr.badge = 'DP 0%'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-004' AND pr.badge = 'FREE BIAYA KPR'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-006' AND pr.badge = 'BONUS FURNITURE'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-006' AND pr.badge = 'DISKON'
UNION ALL
SELECT p.id, pr.id FROM "Property" p, "Promo" pr
WHERE p.id = 'prop-008' AND pr.badge = 'DP 0%';

-- Visitors (sample)
INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status") VALUES
(CURRENT_DATE - INTERVAL '6 days', 'Rina Wati', '0812-1111-2222', 'Rumah', '36/72', 'Serpong', '75 Juta', 'DISKON', 'Baru'),
(CURRENT_DATE - INTERVAL '5 days', 'Dedi Kurniawan', '0813-2222-3333', 'Apartemen', 'Studio', 'Pamulang', '0', 'DP 0%', 'Follow Up'),
(CURRENT_DATE - INTERVAL '3 days', 'Linda Permata', '0857-3333-4444', 'Rumah', '45/90', 'Karawaci', '100 Juta', 'BONUS FURNITURE', 'Hot Lead'),
(CURRENT_DATE - INTERVAL '1 day', 'Joko Prasetyo', '0878-4444-5555', 'Tanah', '-', 'Cikarang', '200 Juta', '', 'Baru'),
(CURRENT_DATE, 'Maya Sari', '0899-5555-6666', 'Ruko', '3 Lantai', 'Bintaro', '500 Juta', 'FREE BIAYA KPR', 'Closing');

-- ═══════════════════════════════════════════
-- INDEXES for performance
-- ═══════════════════════════════════════════

CREATE INDEX IF NOT EXISTS "idx_property_permalink" ON "Property" ("permalink");
CREATE INDEX IF NOT EXISTS "idx_property_type" ON "Property" ("type");
CREATE INDEX IF NOT EXISTS "idx_property_kabupaten" ON "Property" ("kabupaten");
CREATE INDEX IF NOT EXISTS "idx_property_kecamatan" ON "Property" ("kecamatan");
CREATE INDEX IF NOT EXISTS "idx_property_createdAt" ON "Property" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_visitor_date" ON "Visitor" ("date");
CREATE INDEX IF NOT EXISTS "idx_visitor_status" ON "Visitor" ("status");
CREATE INDEX IF NOT EXISTS "idx_adminuser_username" ON "AdminUser" ("username");
CREATE INDEX IF NOT EXISTS "idx_location_kabupaten" ON "Location" ("kabupaten");
