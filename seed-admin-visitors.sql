-- ═══════════════════════════════════════════════════════════════
-- ADMIN USERS & VISITORS SEED DATA
-- Jalankan di Supabase SQL Editor jika tabel AdminUser dan Visitor kosong
-- ═══════════════════════════════════════════════════════════════

-- Hapus data lama jika ada (opsional)
-- DELETE FROM "AdminUser" WHERE username IN ('admin', 'marketing', 'sales');
-- DELETE FROM "Visitor";

-- Insert Admin Users jika kosong
INSERT INTO "AdminUser" ("name", "username", "password", "role")
SELECT 'Administrator', 'admin', 'admin123', 'superadmin'
WHERE NOT EXISTS (SELECT 1 FROM "AdminUser" WHERE username = 'admin');

INSERT INTO "AdminUser" ("name", "username", "password", "role")
SELECT 'Marketing Manager', 'marketing', 'marketing123', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM "AdminUser" WHERE username = 'marketing');

INSERT INTO "AdminUser" ("name", "username", "password", "role")
SELECT 'Sales Agent', 'sales', 'sales123', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM "AdminUser" WHERE username = 'sales');

-- Insert Visitors jika kosong
INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status")
SELECT CURRENT_DATE - INTERVAL '2 days', 'Rina Wati', '0812-1111-2222', 'Rumah', '36/72', 'Serpong, Tangerang Selatan', '75 Juta', 'DISKON', 'Follow Up'
WHERE NOT EXISTS (SELECT 1 FROM "Visitor" WHERE phone = '0812-1111-2222');

INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status")
SELECT CURRENT_DATE - INTERVAL '1 day', 'Dedi Kurniawan', '0813-2222-3333', 'Apartemen', 'Studio', 'Pamulang, Tangerang Selatan', '0', 'DP 0%', 'Hot Lead'
WHERE NOT EXISTS (SELECT 1 FROM "Visitor" WHERE phone = '0813-2222-3333');

INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status")
SELECT CURRENT_DATE, 'Linda Permata', '0857-3333-4444', 'Rumah', '45/90', 'Karawaci, Tangerang', '100 Juta', 'BONUS FURNITURE', 'Baru'
WHERE NOT EXISTS (SELECT 1 FROM "Visitor" WHERE phone = '0857-3333-4444');

INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status")
SELECT CURRENT_DATE, 'Joko Prasetyo', '0878-4444-5555', 'Tanah', '-', 'Cikarang, Bekasi', '200 Juta', '', 'Baru'
WHERE NOT EXISTS (SELECT 1 FROM "Visitor" WHERE phone = '0878-4444-5555');

INSERT INTO "Visitor" ("date", "name", "phone", "type", "building", "location", "dp", "promo", "status")
SELECT CURRENT_DATE, 'Maya Sari', '0899-5555-6666', 'Ruko', '3 Lantai', 'Bintaro, Tangerang Selatan', '500 Juta', 'FREE BIAYA KPR', 'Closing'
WHERE NOT EXISTS (SELECT 1 FROM "Visitor" WHERE phone = '0899-5555-6666');

-- Verifikasi hasil
SELECT 'AdminUser count:' as info, COUNT(*) as count FROM "AdminUser"
UNION ALL
SELECT 'Visitor count:', COUNT(*) FROM "Visitor";

-- Menampilkan data AdminUser
SELECT * FROM "AdminUser" ORDER BY "createdAt" DESC;

-- Menampilkan data Visitor
SELECT * FROM "Visitor" ORDER BY "createdAt" DESC;