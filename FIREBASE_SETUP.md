# Firebase Setup Guide untuk PropertiHub

## Langkah-langkah Konfigurasi Firebase

### 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau buat project baru
3. Beri nama project (misal: "propertihub")
4. Disable Google Analytics (opsional)
5. Klik "Create project"

### 2. Buat Firestore Database

1. Di Firebase Console, pilih project Anda
2. Klik menu **Firestore Database** di sidebar kiri
3. Klik **Create database**
4. Pilih lokasi (pilih yang terdekat dengan user Anda, misal: singapore)
5. Pilih mode: **Start in production mode** (recommended)
6. Klik **Create**

### 3. Atur Firestore Rules

Di tab **Rules** di Firestore Database, ganti dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Peringatan:** Rules di atas mengizinkan read/write tanpa autentikasi. Untuk production, ganti dengan rules yang lebih ketat.

### 4. Buat Web App Configuration

1. Di Firebase Console, klik **Gear icon** (Project Settings)
2. Scroll ke bagian **Your apps**
3. Klik **</>** icon (Web app)
4. Beri nama app (misal: "PropertiHub Web")
5. Tidak perlu centang "Firebase Hosting" (opsional)
6. Klik **Register app**
7. Copy konfigurasi yang muncul

### 5. Update File `.env`

Copy konfigurasi dari Firebase dan paste ke file `.env`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=propertihub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=propertihub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=propertihub.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 6. Install Firebase SDK (sudah diinstall)

```bash
bun add firebase
```

### 7. Test Koneksi

Buka URL: `http://localhost:3000/seed-firebase.html`

Jika konfigurasi benar, akan muncul:
- ✅ Firebase terkonfigurasi dengan benar

Jika error:
- ⚠️ Mungkin belum dikonfigurasi. Coba upload data untuk testing.

### 8. Seeding Data

1. Klik tombol **"🔥 Upload Massal ke Firebase"**
2. Tunggu proses selesai
3. Data dummy akan terisi ke Firestore

### 9. Login ke Admin Panel

- **URL:** `http://localhost:3000/` (klik menu "Admin" di navbar)
- **Username:** `admin`
- **Password:** `admin123`

## Troubleshooting

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Solusi:**
- Pastikan semua environment variables di `.env` sudah diisi dengan benar
- Restart dev server: `bun run dev`

### Error: "Missing or insufficient permissions"

**Solusi:**
- Update Firestore Rules seperti di langkah #3
- Pastikan rules sudah di-publish

### Error: "The default Firebase app does not exist"

**Solusi:**
- Pastikan `NEXT_PUBLIC_FIREBASE_API_KEY` dan `NEXT_PUBLIC_FIREBASE_PROJECT_ID` sudah diisi
- Cek tidak ada typo di nama environment variables

### Data tidak muncul di aplikasi

**Solusi:**
1. Cek Firebase Console → Firestore Database untuk memastikan data ada
2. Buka browser dev tools → Console untuk melihat error
3. Cek network tab untuk melihat API calls

### Seeding gagal

**Solusi:**
1. Pastikan Firestore database sudah dibuat
2. Cek Firestore rules mengizinkan read/write
3. Cek browser console untuk error detail

## Firebase Collections yang Digunakan

Aplikasi menggunakan collections berikut:

1. `agency` - Settings perusahaan (1 document)
2. `seo` - SEO settings (1 document)
3. `propertyTypes` - Tipe properti (Rumah, Apartemen, Ruko, Tanah)
4. `locations` - Lokasi properti (kabupaten + kecamatan)
5. `agents` - Data agen properti
6. `properties` - Data properti
7. `promos` - Promo/harga khusus
8. `articles` - Artikel/blog
9. `reviews` - Testimonial pelanggan
10. `visitors` - Data lead/customer
11. `adminUsers` - User untuk login admin

## Tips

1. **Production:** Gunakan Firebase Authentication untuk mengamankan admin login
2. **Security:** Update Firestore rules untuk production dengan proper authentication
3. **Monitoring:** Gunakan Firebase Analytics untuk tracking user behavior
4. **Hosting:** Deploy Next.js app ke Vercel + Firebase Hosting untuk optimal performance

## Link Penting

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

---

© 2024 PropertiHub. Powered by Firebase 🔥