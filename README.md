# PKKM

Aplikasi penilaian kinerja guru (PKG) dan kepala madrasah (PKKM). Ini migrasi dari project CodeIgniter 4 + SQLite (`CI4_Portable`) ke **Vue 3** dan **Supabase**.

Rumus penilaian, instrumen, dan arsip per tahun ajaran mengikuti aplikasi sebelumnya. Masuk memakai akun Supabase (email dan sandi), bukan lagi `admin` / `admin123`.

## Menyiapkan Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`, lalu jalankan.
3. Di **Authentication → Providers → Email**, matikan *Confirm email* bila ingin daftar langsung dari halaman masuk.
4. Buat pengguna di **Authentication → Users**, atau pakai tombol Daftar di aplikasi.
5. Salin **Project URL** dan **anon public key**.

## Menjalankan aplikasi

Perlu Node.js 20 atau yang lebih baru.

```bat
copy .env.example .env
```

Isi `.env`:

```ini
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

```bat
npm install
npm run dev
```

Buka alamat yang muncul, biasanya `http://127.0.0.1:5173/`.

## Yang ikut pindah

- Profil madrasah, tahun ajaran (termasuk salin guru saat tahun baru), dan ganti tahun aktif
- Data guru: tambah, ubah, hapus, unggah CSV, unduh CSV
- PKG: skor instrumen, kehadiran, rencana PKB, hasil cetak, rekap, salin nilai antar guru
- PKKM: data kepala/pengawas, nilai penilai I dan II untuk 4 tahun, rekap cetak
- Cadangan dan pulihkan berkas JSON
- Pengaturan tampilan dan sandi akun

## Yang tidak ikut

Generator berkas Word/PDF untuk SK tim, laporan PKG, dan kop surat masih ada di aplikasi CodeIgniter. Di versi ini, hasil PKG dan rekap dicetak lewat peramban. Logo madrasah belum disimpan (bisa ditambah lewat Supabase Storage nanti).
