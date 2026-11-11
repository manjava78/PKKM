<template>
  <section class="banner">
    <div>
      <span class="chip">Panduan Pengguna</span>
      <h2>Tentang PKKM</h2>
      <p>Penilaian kinerja guru (PKG) dan kepala madrasah (PKKM), dipindahkan dari aplikasi CodeIgniter portable ke Vue.js dengan database Supabase.</p>
    </div>
  </section>
  <section class="card mt">
    <h3>Alur kerja</h3>
    <div class="steps mt">
      <div class="s"><span class="n">1</span><div><b>Profil madrasah</b><br><small class="mute">Isi identitas madrasah dan kepala.</small></div></div>
      <div class="s"><span class="n">2</span><div><b>Tahun ajaran</b><br><small class="mute">Pilih tahun aktif di pojok kanan atas, atau tambah tahun baru di Pengaturan.</small></div></div>
      <div class="s"><span class="n">3</span><div><b>Data guru</b><br><small class="mute">Tambah manual atau unggah CSV.</small></div></div>
      <div class="s"><span class="n">4</span><div><b>PKG</b><br><small class="mute">Isi instrumen, kehadiran, dan rencana PKB.</small></div></div>
      <div class="s"><span class="n">5</span><div><b>PKKM</b><br><small class="mute">Lengkapi kepala dan pengawas, lalu nilai empat tahun siklus.</small></div></div>
      <div class="s"><span class="n">6</span><div><b>Cetak &amp; cadangan</b><br><small class="mute">Cetak dari peramban, lalu unduh cadangan JSON secara berkala.</small></div></div>
    </div>
  </section>
  <section class="card mt">
    <h3>Perhitungan</h3>
    <p>Skor indikator PKG 0–2 dijumlah per kompetensi, diubah ke level 1–4, lalu ke skala 100. Nilai akhir tugas utama dikalikan persentase kehadiran: 100% − (hari tanpa keterangan / 46) × 100%. PKKM memakai skor 1–4 (N/A = 0 pada indikator opsional) untuk dua penilai, lalu dirata-rata.</p>
  </section>
</template>
