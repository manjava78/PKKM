<script setup>
import { computed } from 'vue'
import { useSimad } from '@/stores/simad'
import { fmt, sebutClass } from '@/lib/format'

const store = useSimad()
const namaTh = ['Pertama', 'Kedua', 'Ketiga', 'Keempat']
const rekap = computed(() => [1, 2, 3, 4].map((t) => store.rekapPkkm(t)))
const th0 = computed(() => Number(store.S.pkkm_tahun_pertama) || 0)
</script>

<template>
  <div class="card mb">
    <div class="hd" style="margin:0">
      <div>
        <h3>{{ store.S.kepala_nama || 'Kepala Madrasah' }}</h3>
        <p>NIP {{ store.S.kepala_nip || '-' }} • {{ store.S.madrasah_nama }} • Tahun pertama: {{ store.S.pkkm_tahun_pertama || '—' }}</p>
      </div>
      <RouterLink class="btn" to="/pkkm/data">Data Kepala &amp; Penilai</RouterLink>
    </div>
  </div>
  <div class="grid g2">
    <div v-for="r in rekap" :key="r.tahun" class="card">
      <div class="hd">
        <div>
          <h3>Penilaian Kinerja Tahun {{ namaTh[r.tahun - 1] }}
            <span v-if="th0" class="pill g">{{ th0 + r.tahun - 1 }}</span>
          </h3>
          <p>Empat tugas utama (A–D){{ r.tahun === 4 ? ' + hasil kinerja empat tahunan (E)' : '' }}</p>
        </div>
        <span v-if="r.terisi[1] || r.terisi[2]" :class="sebutClass(r.predikat)">{{ r.predikat }}</span>
      </div>
      <div class="tw">
        <table class="t">
          <thead><tr><th>Tugas utama</th><th>Penilai I</th><th>Penilai II</th><th>Rerata</th></tr></thead>
          <tbody>
            <tr v-for="b in r.baris" :key="b.kode">
              <td class="l"><b>{{ b.kode }}.</b> {{ b.judul }}</td>
              <td>{{ r.terisi[1] ? fmt(b.p1, 1) : '–' }}</td>
              <td>{{ r.terisi[2] ? fmt(b.p2, 1) : '–' }}</td>
              <td><b>{{ (r.terisi[1] || r.terisi[2]) ? fmt(b.rerata, 1) : '–' }}</b></td>
            </tr>
            <tr v-if="r.extra">
              <td class="l"><b>E.</b> {{ r.extra.judul }}</td>
              <td>{{ fmt(r.extra.p1, 1) }}</td>
              <td>{{ fmt(r.extra.p2, 1) }}</td>
              <td><b>{{ fmt(r.extra.rerata, 1) }}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions" style="margin-top:14px">
        <RouterLink class="btn p sm" :to="`/pkkm/${r.tahun}/nilai/1`">Isi Penilai I ({{ r.terisi[1] }})</RouterLink>
        <RouterLink class="btn p sm" :to="`/pkkm/${r.tahun}/nilai/2`">Isi Penilai II ({{ r.terisi[2] }})</RouterLink>
        <RouterLink class="btn sm" :to="`/pkkm/${r.tahun}/rekap`">Rekap &amp; Cetak</RouterLink>
      </div>
    </div>
  </div>
</template>
