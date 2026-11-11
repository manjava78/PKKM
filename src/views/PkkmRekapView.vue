<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { fmt, sebutClass } from '@/lib/format'

const route = useRoute()
const store = useSimad()
const tahun = computed(() => Number(route.params.tahun))
const r = computed(() => store.rekapPkkm(tahun.value))
const namaTh = ['Pertama', 'Kedua', 'Ketiga', 'Keempat']
function cetak() { window.print() }
</script>

<template>
  <div class="tabs no-print">
    <RouterLink to="/pkkm">Daftar PKKM</RouterLink>
    <RouterLink :to="`/pkkm/${tahun}/nilai/1`">Penilai I</RouterLink>
    <RouterLink :to="`/pkkm/${tahun}/nilai/2`">Penilai II</RouterLink>
    <button class="btn sm p" type="button" @click="cetak">Cetak</button>
  </div>
  <article class="sheet">
    <div class="kop">
      <div style="font-weight:bold">{{ store.S.madrasah_nama }}</div>
      <div>{{ store.S.unit_kerja_penilai }}</div>
    </div>
    <h2>Rekap PKKM Tahun {{ namaTh[tahun - 1] || tahun }}</h2>
    <div class="ctr" style="margin-bottom:10px">{{ store.S.kepala_nama }} • NIP {{ store.S.kepala_nip || '-' }}</div>
    <table class="b">
      <thead><tr><th>Tugas utama</th><th>Penilai I</th><th>Penilai II</th><th>Rerata</th></tr></thead>
      <tbody>
        <tr v-for="b in r.baris" :key="b.kode">
          <td>{{ b.kode }}. {{ b.judul }}</td>
          <td class="num">{{ fmt(b.p1, 1) }}</td>
          <td class="num">{{ fmt(b.p2, 1) }}</td>
          <td class="num"><b>{{ fmt(b.rerata, 1) }}</b></td>
        </tr>
        <tr v-if="r.extra">
          <td>E. {{ r.extra.judul }}</td>
          <td class="num">{{ fmt(r.extra.p1, 1) }}</td>
          <td class="num">{{ fmt(r.extra.p2, 1) }}</td>
          <td class="num"><b>{{ fmt(r.extra.rerata, 1) }}</b></td>
        </tr>
        <tr>
          <td><b>Jumlah rerata</b></td>
          <td class="num"><b>{{ fmt(r.p1, 1) }}</b></td>
          <td class="num"><b>{{ fmt(r.p2, 1) }}</b></td>
          <td class="num"><b>{{ fmt(r.rerata, 1) }}</b> <span :class="sebutClass(r.predikat)">{{ r.predikat }}</span></td>
        </tr>
      </tbody>
    </table>
  </article>
</template>
