<script setup>
import { useSimad } from '@/stores/simad'
import { fmt, sebutClass } from '@/lib/format'

const store = useSimad()
function cetak() { window.print() }
</script>

<template>
  <div class="no-print" style="text-align:right;margin-bottom:12px">
    <button class="btn p" type="button" @click="cetak">Cetak</button>
  </div>
  <article class="sheet">
    <div class="kop">
      <div style="font-weight:bold">{{ store.S.madrasah_nama }}</div>
      <div>NSM {{ store.S.nsm || '-' }} • NPSN {{ store.S.npsn || '-' }}</div>
    </div>
    <h2>Rekapitulasi PKG</h2>
    <div class="ctr" style="margin-bottom:12px">Tahun Ajaran {{ store.S.tahun_ajaran }} ({{ store.S.semester }})</div>
    <table class="b">
      <thead>
        <tr><th>No</th><th>Nama</th><th>Instrumen</th><th>Terisi</th><th>Nilai</th><th>Sebutan</th><th>NPK</th></tr>
      </thead>
      <tbody>
        <tr v-if="!store.items.length"><td colspan="7" class="ctr">Belum ada data.</td></tr>
        <tr v-for="(it, i) in store.items" :key="it.guru.id">
          <td class="ctr">{{ i + 1 }}</td>
          <td>{{ it.guru.nama }}</td>
          <td>{{ it.hasil.utama.label }}</td>
          <td class="ctr">{{ it.hasil.utama.terisi }}/{{ it.hasil.utama.total_ind }}</td>
          <td class="num">{{ it.hasil.utama.terisi ? fmt(it.hasil.utama.nilai_akhir, 1) : '–' }}</td>
          <td class="ctr"><span :class="sebutClass(it.hasil.utama.sebutan)">{{ it.hasil.utama.terisi ? it.hasil.utama.sebutan : '–' }}</span></td>
          <td class="ctr">{{ it.hasil.utama.terisi ? it.hasil.utama.npk : '–' }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>
