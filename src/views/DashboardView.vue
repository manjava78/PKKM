<script setup>
import { computed } from 'vue'
import { useSimad } from '@/stores/simad'
import { sebutan } from '@/lib/engine'
import { fmt, isi, sebutClass } from '@/lib/format'

const store = useSimad()
const items = computed(() => store.items)
const gs = computed(() => items.value.map((i) => i.guru))
const total = computed(() => gs.value.length)
const pns = computed(() => gs.value.filter((g) => g.status === 'PNS' || g.status === 'PPPK').length)
const non = computed(() => gs.value.filter((g) => g.status === 'GTY' || g.status === 'GTT').length)
const jkL = computed(() => gs.value.filter((g) => g.jk === 'Laki-laki').length)
const jkP = computed(() => gs.value.filter((g) => g.jk === 'Perempuan').length)
const dinilai = computed(() => items.value.filter((i) => i.hasil.utama.terisi))
const lengkap = computed(() => items.value.filter((i) => i.hasil.utama.lengkap))
const rata = computed(() => dinilai.value.length
  ? dinilai.value.reduce((s, i) => s + i.hasil.utama.nilai_akhir, 0) / dinilai.value.length
  : 0)
const rekapPk = computed(() => [1, 2, 3, 4].map((t) => store.rekapPkkm(t)))
const pkIsi = computed(() => rekapPk.value.filter((r) => r.terisi[1] || r.terisi[2]).length)
const pkLast = computed(() => [...rekapPk.value].reverse().find((r) => r.terisi[1] || r.terisi[2]) || null)
const preview = computed(() => items.value.slice(0, 8))
</script>

<template>
  <section class="banner">
    <div>
      <span class="chip">Sistem Penilaian Kinerja</span>
      <h2>{{ isi(store.S.banner_judul || 'Selamat Datang', store.S) }}</h2>
      <p>{{ isi(store.S.banner_teks || '', store.S) }}</p>
    </div>
    <RouterLink class="btn" to="/pkg/rekap">Cetak Rekap PKG</RouterLink>
  </section>

  <section class="grid g4 mt">
    <RouterLink class="card stat" to="/guru">
      <span class="lb">Total Guru &amp; GTK</span>
      <div class="num"><b>{{ total }}</b><span class="pill">L: {{ jkL }} | P: {{ jkP }}</span></div>
      <div class="ft"><span>PNS/PPPK: {{ pns }} • GTY/GTT: {{ non }}</span></div>
    </RouterLink>
    <RouterLink class="card stat" to="/pkg">
      <span class="lb">PKG Dinilai</span>
      <div class="num"><b>{{ dinilai.length }}</b><span class="pill b">{{ lengkap.length }} lengkap</span></div>
      <div class="ft"><span>Dari {{ total }} guru terdaftar</span></div>
    </RouterLink>
    <RouterLink class="card stat" to="/pkg/rekap">
      <span class="lb">Rata-rata Nilai PKG</span>
      <div class="num"><b>{{ fmt(rata, 1) }}</b><span :class="sebutClass(dinilai.length ? sebutan(rata) : '')">{{ dinilai.length ? sebutan(rata) : '–' }}</span></div>
      <div class="ft"><span>Nilai akhir tugas utama</span></div>
    </RouterLink>
    <RouterLink class="card stat" to="/pkkm">
      <span class="lb">PKKM Kamad</span>
      <div class="num"><b>{{ pkIsi }}/4</b><span v-if="pkLast" class="pill v">{{ pkLast.predikat }}</span></div>
      <div class="ft"><span>Tahun penilaian terisi</span></div>
    </RouterLink>
  </section>

  <section class="card mt">
    <h3>TINDAKAN CEPAT ADMINISTRASI</h3>
    <div class="quick">
      <RouterLink class="q1" to="/guru/baru">+ Tambah Guru</RouterLink>
      <RouterLink class="q2" to="/guru/unggah">Unggah Data Guru</RouterLink>
      <RouterLink class="q3" to="/pkg">Isi Penilaian PKG</RouterLink>
      <RouterLink class="q4" to="/pkkm">Penilaian PKKM</RouterLink>
    </div>
  </section>

  <section class="grid g21 mt">
    <div class="card">
      <div class="hd">
        <div>
          <h3>Rekapitulasi Penilaian PKG</h3>
          <p>Nilai akhir tugas utama dan kelengkapan pengisian instrumen tiap guru</p>
        </div>
        <RouterLink class="link" to="/pkg">Lihat Detail</RouterLink>
      </div>
      <div class="tw">
        <table class="t">
          <thead><tr><th>Guru / Instrumen</th><th>Terisi</th><th>Nilai Akhir</th><th>Sebutan</th><th>Kelengkapan</th></tr></thead>
          <tbody>
            <tr v-if="!preview.length"><td colspan="5" class="empty">Belum ada data guru. <RouterLink class="link" to="/guru/baru">Tambah manual</RouterLink> atau <RouterLink class="link" to="/guru/unggah">unggah CSV</RouterLink>.</td></tr>
            <tr v-for="it in preview" :key="it.guru.id">
              <td class="l">
                <RouterLink :to="`/pkg/${it.guru.id}/hasil`">{{ it.guru.nama }}</RouterLink><br>
                <small class="mute">{{ it.hasil.utama.label }}</small>
              </td>
              <td>{{ it.hasil.utama.terisi }}/{{ it.hasil.utama.total_ind }}</td>
              <td><b>{{ it.hasil.utama.terisi ? fmt(it.hasil.utama.nilai_akhir, 1) : '–' }}</b></td>
              <td><span v-if="it.hasil.utama.terisi" :class="sebutClass(it.hasil.utama.sebutan)">{{ it.hasil.utama.sebutan }}</span><span v-else>–</span></td>
              <td>
                <span class="bar"><i><b :style="{ width: (it.hasil.utama.total_ind ? Math.round(it.hasil.utama.terisi / it.hasil.utama.total_ind * 100) : 0) + '%' }"></b></i>
                  <span>{{ it.hasil.utama.total_ind ? Math.round(it.hasil.utama.terisi / it.hasil.utama.total_ind * 100) : 0 }}%</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <h3 style="margin-bottom:14px">Pimpinan &amp; Legalitas</h3>
      <div class="info-box"><small>Kepala Madrasah</small><b>{{ store.S.kepala_nama || '-' }}</b><small>NIP: {{ store.S.kepala_nip || '-' }}</small></div>
      <div class="info-box">
        <div class="kv">
          <span>Alamat:</span><span>{{ store.S.alamat || '-' }}</span>
          <span>Kecamatan/Kab:</span><span>{{ store.S.kecamatan }}, {{ store.S.kabupaten }}</span>
          <span>Email Resmi:</span><span style="color:var(--g700)">{{ store.S.email || '-' }}</span>
        </div>
      </div>
      <div class="info-box" style="margin-bottom:0">
        <div class="kv">
          <span>Pengawas:</span><span>{{ store.S.pengawas_nama || '-' }}</span>
          <span>NSM:</span><span>{{ store.S.nsm || '-' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
