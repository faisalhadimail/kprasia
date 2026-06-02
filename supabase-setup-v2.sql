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

-- Create PropertyType table
CREATE TABLE "PropertyType" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'home',
  displayOrder INTEGER DEFAULT 0
);

-- Create Location table
CREATE TABLE "Location" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  kabupaten TEXT NOT NULL,
  kecamatan TEXT[] DEFAULT '{}',
  UNIQUE (kabupaten)
);

-- Create Agent table
CREATE TABLE "Agent" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  image TEXT,
  whatsapp TEXT,
  displayOrder INTEGER DEFAULT 0
);

-- Create Promo table
CREATE TABLE "Promo" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  badge TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  displayOrder INTEGER DEFAULT 0
);

-- Create Property table
CREATE TABLE "Property" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  buildingType TEXT,
  price BIGINT,
  dp BIGINT DEFAULT 0,
  allInCost BIGINT DEFAULT 0,
  kabupaten TEXT NOT NULL,
  kecamatan TEXT,
  location TEXT,
  images TEXT[] DEFAULT '{}',
  bedrooms INTEGER,
  bathrooms INTEGER,
  carports INTEGER,
  buildingSize INTEGER,
  landSize INTEGER,
  electricity INTEGER,
  water TEXT,
  certificate TEXT,
  facilities TEXT[] DEFAULT '{}',
  contact TEXT,
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  permalink TEXT UNIQUE,
  brochure TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PropertyPromo junction table
CREATE TABLE "PropertyPromo" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  propertyId TEXT NOT NULL REFERENCES "Property"(id) ON DELETE CASCADE,
  promoId TEXT NOT NULL REFERENCES "Promo"(id) ON DELETE CASCADE,
  UNIQUE (propertyId, promoId)
);

-- Create Article table
CREATE TABLE "Article" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT DEFAULT 'General',
  author TEXT,
  published BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Review table
CREATE TABLE "Review" (
  id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image TEXT,
  featured BOOLEAN DEFAULT false,
  propertyId TEXT,
  propertyTitle TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Visitor (Leads) table
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

-- Create indexes for better performance
CREATE INDEX idx_property_type ON "Property"(type);
CREATE INDEX idx_property_kabupaten ON "Property"(kabupaten);
CREATE INDEX idx_property_kecamatan ON "Property"(kecamatan);
CREATE INDEX idx_property_permalink ON "Property"(permalink);
CREATE INDEX idx_visitor_date ON "Visitor"(date);
CREATE INDEX idx_visitor_status ON "Visitor"(status);
CREATE INDEX idx_article_slug ON "Article"(slug);
CREATE INDEX idx_review_featured ON "Review"(featured) WHERE featured = true;

-- Insert sample PropertyTypes
INSERT INTO "PropertyType" (name, icon, displayOrder) VALUES
  ('Rumah', 'home', 1),
  ('Apartemen', 'building-2', 2),
  ('Ruko', 'building', 3),
  ('Tanah', 'trees', 4);

-- Insert sample Locations
INSERT INTO "Location" (kabupaten, kecamatan) VALUES
  ('Palembang', ARRAY['Ilir Timur I', 'Ilir Timur II', 'Ilir Barat I', 'Ilir Barat II', 'Seberang Ulu I', 'Seberang Ulu II']),
  ('Lahat', ARRAY['Lahat', 'Kikim Barat', 'Kikim Selatan', 'Kikim Timur', 'Kikim Tengah', 'Pagar Gunung']),
  ('Prabumulih', ARRAY['Prabumulih Timur', 'Prabumulih Barat', 'Prabumulih Utara', 'Prabumulih Selatan']);

-- Insert sample Admin Users (password: admin123)
INSERT INTO "AdminUser" (name, username, password, email, role) VALUES
  ('Super Admin', 'admin', '$2b$10$YourHashedPasswordHere', 'admin@propertihub.com', 'superadmin'),
  ('Marketing Manager', 'marketing', '$2b$10$YourHashedPasswordHere', 'marketing@propertihub.com', 'admin'),
  ('Sales Agent', 'sales', '$2b$10$YourHashedPasswordHere', 'sales@propertihub.com', 'admin');

-- Insert sample Promos
INSERT INTO "Promo" (badge, title, subtitle, active, displayOrder) VALUES
  ('HOT DEAL', 'Diskon DP 0%', 'Tanpa uang muka khusus bulan ini', true, 1),
  ('SPECIAL', 'Free Biaya KPR', 'Dapatkan promo gratis biaya administrasi', true, 2),
  ('LIMITED', 'Bonus Furnitur', 'Dapatkan set furnitur lengkap', true, 3);

-- Insert sample Agents
INSERT INTO "Agent" (name, role, phone, email, image, whatsapp, displayOrder) VALUES
  ('Budi Santoso', 'Senior Marketing', '081234567890', 'budi@propertihub.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', '6281234567890', 1),
  ('Siti Rahayu', 'Marketing Executive', '081234567891', 'siti@propertihub.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', '6281234567891', 2),
  ('Ahmad Wijaya', 'Sales Agent', '081234567892', 'ahmad@propertihub.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', '6281234567892', 3);

-- Insert sample Articles
INSERT INTO "Article" (title, slug, excerpt, content, image, category, author, published) VALUES
  ('Tips Memilih Rumah Pertama', 'tips-memilih-rumah-pertama', 'Panduan lengkap untuk memilih rumah pertama yang sesuai dengan kebutuhan dan budget Anda.', '<p>Membeli rumah pertama adalah momen penting dalam hidup. Berikut tips yang perlu diperhatikan:</p><ul><li>Tentukan budget Anda</li><li>Pilih lokasi strategis</li><li>Perhatikan fasilitas di sekitar</li><li>Cek legalitas properti</li></ul>', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Tips', 'Tim PropertiHub', true),
  ('Keuntungan Investasi Properti', 'keuntungan-investasi-properti', 'Kenapa investasi properti menjadi pilihan terbaik untuk masa depan financial Anda.', '<p>Investasi properti menawarkan banyak keuntungan seperti:</p><ul><li>Nilai properti yang terus naik</li><li>Pasif income dari sewa</li><li>Lindung nilai terhadap inflasi</li><li>Aset yang nyata dan tangible</li></ul>', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Investasi', 'Tim PropertiHub', true),
  ('Cara Mengajukan KPR', 'cara-mengajukan-kpr', 'Panduan langkah demi langkah mengajukan kredit pemilikan rumah dengan mudah.', '<p>Berikut langkah-langkah mengajukan KPR:</p><ol><li>Siapkan DP minimal 20%</li><li>Persiapkan dokumen yang diperlukan</li><li>Pilih bank dengan suku bunga terbaik</li><li>Lakukan survey properti</li><li>Tanda tangan perjanjian kredit</li></ol>', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'KPR', 'Tim PropertiHub', true);

-- Insert sample Reviews
INSERT INTO "Review" (name, review, rating, image, featured) VALUES
  ('Andi Pratama', 'Sangat puas dengan pelayanan tim PropertiHub. Rumah impian saya akhirnya tercapai!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', true),
  ('Dewi Kartika', 'Proses cepat dan transparan. Agen sangat membantu menjelaskan detail properti.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', true),
  ('Rudi Hermawan', 'Sudah langganan sejak lama. Selalu mendapatkan penawaran properti terbaik.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', true);

-- Insert sample Properties
INSERT INTO "Property" (
  type, title, description, buildingType, price, dp, kabupaten, kecamatan,
  location, images, bedrooms, bathrooms, carports, buildingSize, landSize,
  electricity, water, certificate, facilities, contact, status, featured, permalink
) VALUES
  (
    'Rumah', 'Rumah Minimalis Modern', 'Rumah minimalis modern dengan desain elegan dan fasilitas lengkap. Lokasi strategis di pusat kota.',
    '45/72', 450000000, 50000000, 'Palembang', 'Ilir Timur I',
    'Jl. Jenderal Sudirman No. 123',
    ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    2, 1, 1, 45, 72, 2200, 'PDAM', 'SHM',
    ARRAY['AC', 'Kitchen Set', 'Taman', 'Garasi'],
    '081234567890', 'available', true, 'rumah-minimalis-modern-palembang'
  ),
  (
    'Rumah', 'Rumah Cluster Exclusive', 'Rumah di cluster exclusive dengan keamanan 24 jam. Dekat dengan fasilitas umum.',
    '60/90', 650000000, 65000000, 'Palembang', 'Ilir Timur II',
    'Komplek Griya Indah Blok A5',
    ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
    3, 2, 1, 60, 90, 2200, 'PDAM', 'SHM',
    ARRAY['AC', 'Kitchen Set', 'Taman', 'Garasi', 'Security 24 Jam'],
    '081234567890', 'available', true, 'rumah-cluster-exclusive-palembang'
  ),
  (
    'Ruko', 'Ruko 2 Lantai Strategis', 'Ruko 2 lantai di lokasi strategis, cocok untuk usaha atau kantor.',
    '80/60', 850000000, 85000000, 'Palembang', 'Ilir Barat I',
    'Jl. Basuki Rahmat No. 45',
    ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    2, 2, 2, 80, 60, 3500, 'PDAM', 'HGB',
    ARRAY['AC', 'Toilet Luar', 'Teras Luas'],
    '081234567891', 'available', false, 'ruko-2-lantai-palembang'
  );

-- Insert sample Visitor/Leads
INSERT INTO "Visitor" (name, phone, email, type, building, location, dp, promo, status, interest) VALUES
  ('Budi Santoso', '081234567890', 'budi@gmail.com', 'Rumah', '45/72', 'Palembang, Ilir Timur I', 'Rp 50.000.000', 'Diskon DP 0%', 'hot', 'Tinggi'),
  ('Siti Aminah', '081234567891', 'siti@gmail.com', 'Rumah', '60/90', 'Palembang, Ilir Timur II', 'Rp 65.000.000', 'Free Biaya KPR', 'warm', 'Sedang'),
  ('Ahmad Fauzi', '081234567892', 'ahmad@gmail.com', 'Ruko', '80/60', 'Palembang, Ilir Barat I', 'Rp 85.000.000', 'Bonus Furnitur', 'new', 'Tinggi');

-- Update function to auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for auto-update updatedAt
CREATE TRIGGER update_adminuser_updated_at BEFORE UPDATE ON "AdminUser"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_updated_at BEFORE UPDATE ON "Property"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_updated_at BEFORE UPDATE ON "Article"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON "Review"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitor_updated_at BEFORE UPDATE ON "Visitor"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Promo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Visitor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyPromo" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON "AdminUser" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Property" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Promo" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Agent" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "PropertyType" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Location" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Visitor" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Article" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "PropertyPromo" FOR SELECT USING (true);

-- Create policies for all operations (for demo purposes - restrict in production)
CREATE POLICY "All operations" ON "AdminUser" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Property" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Promo" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Agent" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "PropertyType" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Location" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Visitor" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Article" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "Review" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All operations" ON "PropertyPromo" FOR ALL USING (true) WITH CHECK (true);

COMMIT;