<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { tglIndo, tugasTeks } from '@/lib/engine'
import { fmt } from '@/lib/format'
import PkgTabs from '@/components/PkgTabs.vue'

const route = useRoute()
function cetak() { window.print() }
const store = useSimad()
const item = computed(() => store.hasilGuru(route.params.id))
const pkb = computed(() => store.pkbGuru(route.params.id).items)
const adaTugas = computed(() => (item.value?.hasil.roles.length || 0) > 1)
const hurufAk = computed(() => (adaTugas.value ? 'E' : 'D'))
const hurufPkb = computed(() => (adaTugas.value ? 'F' : 'E'))

function ttl(g) {
  const tgl = tglIndo(g.tgl_lahir)
  if (g.tempat_lahir && tgl) return `${g.tempat_lahir}, ${tgl}`
  return g.tempat_lahir || tgl || '-'
}
</script>

<template>
  <p v-if="!item">Guru tidak ditemukan.</p>
  <template v-else>
    <PkgTabs :guru="item.guru" :hasil="item.hasil" />
    <div class="no-print" style="text-align:right;margin:-6px 0 12px">
      <button class="btn p" type="button" @click="cetak">Cetak</button>
    </div>
    <div v-if="!item.hasil.utama.terisi" class="flash error no-print">Instrumen {{ item.hasil.utama.label }} belum diisi.</div>
    <article class="sheet hasil-sheet">
      <div class="kop">
        <div style="font-weight:bold">POKJAWAS MADRASAH PROVINSI JAWA TIMUR</div>
        <div>{{ store.S.unit_kerja_penilai }}</div>
      </div>
      <h2>Rekap Hasil Penilaian Kinerja Guru</h2>
      <div class="ctr" style="margin-bottom:10px">{{ item.hasil.utama.label }} • Tahun Ajaran {{ store.S.tahun_ajaran }}</div>
      <h4>A. Identitas Guru yang Dinilai</h4>
      <table class="id">
        <tbody>
        <tr><td>Nama Guru</td><td>:</td><td>{{ item.guru.nama }}</td></tr>
        <tr><td>NIP / No. Seri Karpeg</td><td>:</td><td>{{ item.guru.nip || '-' }} / {{ item.guru.no_karpeg || '-' }}</td></tr>
        <tr><td>Tempat / Tanggal Lahir</td><td>:</td><td>{{ ttl(item.guru) }}</td></tr>
        <tr><td>Pangkat / Golongan</td><td>:</td><td>{{ item.guru.pangkat || '-' }}</td></tr>
        <tr><td>TMT Golongan / TMT Guru</td><td>:</td><td>{{ tglIndo(item.guru.tmt_golongan) || '-' }} / {{ tglIndo(item.guru.tmt_guru) || '-' }}</td></tr>
        <tr><td>Masa Kerja</td><td>:</td><td>{{ item.hasil.masa_kerja || '-' }}</td></tr>
        <tr><td>NUPTK / NRG</td><td>:</td><td>{{ item.guru.nuptk || '-' }} / {{ item.guru.nrg || '-' }}</td></tr>
        <tr><td>Jenis Kelamin / Pendidikan</td><td>:</td><td>{{ item.guru.jk || '-' }} / {{ item.guru.pendidikan || '-' }}</td></tr>
        <tr><td>Mata Pelajaran</td><td>:</td><td>{{ item.guru.mapel || '-' }}</td></tr>
        <tr><td>Tugas Tambahan</td><td>:</td><td>{{ tugasTeks(item.guru) }}</td></tr>
        <tr><td>Jam Mengajar + Tambahan + Lembaga Lain</td><td>:</td><td>{{ item.guru.jam_mengajar || 0 }} + {{ item.hasil.jam_tambahan || 0 }} + {{ item.guru.jam_lembaga_lain || 0 }} = <b>{{ item.hasil.jam_total }} jam tatap muka</b></td></tr>
        <tr><td>Madrasah</td><td>:</td><td>{{ store.S.madrasah_nama }}, {{ store.S.desa }}, {{ store.S.kecamatan }}, {{ store.S.kabupaten }}, {{ store.S.provinsi }}</td></tr>
        <tr><td>Penilai</td><td>:</td><td>{{ item.guru.penilai_nama || store.S.kepala_nama }}</td></tr>
        <tr><td>Periode / Tanggal Penilaian</td><td>:</td><td>{{ tglIndo(item.guru.periode_awal) || '-' }} s.d. {{ tglIndo(item.guru.periode_akhir) || '-' }} / {{ tglIndo(item.guru.tgl_penilaian) || '-' }}</td></tr>
        </tbody>
      </table>
      <h4>B. Hasil Penilaian Kompetensi – {{ item.hasil.utama.label }}</h4>
      <table class="b keep">
        <thead><tr><th style="width:36px">No</th><th>Kompetensi</th><th>Skor</th><th>Nilai</th><th>Level</th></tr></thead>
        <tbody>
          <tr v-for="(c, i) in item.hasil.utama.comps" :key="i">
            <td class="ctr">{{ i + 1 }}</td><td>{{ c.judul }}</td><td class="ctr">{{ c.total }}/{{ c.maks }}</td><td class="num">{{ fmt(c.nilai, 1) }}</td><td class="ctr"><b>{{ c.level }}</b></td>
          </tr>
          <tr><td colspan="4" class="num"><b>Jumlah (Hasil Penilaian Kinerja Guru)</b></td><td class="ctr"><b>{{ item.hasil.utama.jml_level }}</b></td></tr>
          <tr><td colspan="4" class="num">Konversi ke skala 0–100</td><td class="ctr"><b>{{ fmt(item.hasil.utama.nilai100, 1) }}</b></td></tr>
        </tbody>
      </table>
      <h4>C. Nilai Akhir PKG</h4>
      <table class="b keep">
        <tbody>
          <tr><td>Nilai PKG dari penilai</td><td class="num">{{ fmt(item.hasil.utama.nilai100, 2) }}</td></tr>
          <tr><td>Tidak hadir tanpa keterangan = {{ fmt(item.hasil.hadir.tk, 1) }} hari → persentase kehadiran</td><td class="num">{{ fmt(item.hasil.faktor_hadir, 2) }}%</td></tr>
          <tr><td><b>Nilai Akhir PKG</b></td><td class="num"><b>{{ fmt(item.hasil.utama.nilai_akhir, 2) }}</b></td></tr>
          <tr><td>Sebutan</td><td class="num"><b>{{ item.hasil.utama.sebutan }}</b></td></tr>
          <tr><td>Persentase Angka Kredit (PAK)</td><td class="num"><b>{{ item.hasil.utama.npk }}</b></td></tr>
        </tbody>
      </table>
      <template v-if="item.hasil.roles.length > 1">
        <h4>D. Penilaian Tugas Tambahan</h4>
        <table class="b keep">
          <thead><tr><th>Tugas</th><th>Jumlah Level</th><th>Nilai</th><th>Sebutan</th><th>NPK</th></tr></thead>
          <tbody>
            <tr v-for="h in Object.values(item.hasil.hasil).filter(x => !x.utama)" :key="h.role">
              <td>{{ h.label }}<span v-if="h.tugas"> ({{ h.tugas }})</span></td>
              <td class="ctr">{{ h.jml_level }}/{{ h.maks_level }}</td>
              <td class="num">{{ fmt(h.nilai100, 1) }}</td>
              <td class="ctr">{{ h.sebutan }}</td>
              <td class="ctr">{{ h.npk }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <h4>{{ hurufAk }}. Perolehan Angka Kredit (AK)</h4>
      <table class="b keep">
        <thead><tr><th>AKK minimal</th><th>Pengembangan diri + publikasi</th><th>Unsur penunjang</th><th>AK dasar</th></tr></thead>
        <tbody><tr>
          <td class="ctr">{{ item.hasil.ak.akk }}</td>
          <td class="ctr">{{ item.hasil.ak.diri }} + {{ item.hasil.ak.publikasi }}</td>
          <td class="ctr">{{ item.hasil.ak.penunjang }}</td>
          <td class="ctr">{{ item.hasil.ak.dasar }}</td>
        </tr></tbody>
      </table>
      <table class="b keep" style="margin-top:6px">
        <tbody>
          <tr><td>AK tugas utama = (AK dasar × NPK) / 4</td><td class="num">{{ fmt(item.hasil.ak.ak_utama, 3) }}</td></tr>
          <template v-for="t in item.hasil.ak.tambahan" :key="t.role">
            <tr><td>AK {{ item.hasil.utama.label }} dengan tugas tambahan {{ t.label }} (50%)</td><td class="num">{{ fmt(t.ak_utama_50, 3) }}</td></tr>
            <tr><td>AK tugas tambahan sebagai {{ t.label }} (50%)</td><td class="num">{{ fmt(t.ak_tugas, 3) }}</td></tr>
          </template>
          <tr><td><b>Jumlah AK</b><span v-if="item.hasil.ak.gol_lanjut"> – menuju golongan {{ item.hasil.ak.gol_lanjut }}</span></td><td class="num"><b>{{ fmt(item.hasil.ak.jumlah, 3) }}</b></td></tr>
        </tbody>
      </table>
      <p v-if="!item.hasil.ak.golongan" style="font-size:12px;color:#92400e">Pangkat/golongan belum diisi sehingga angka kredit tidak dapat dihitung.</p>
      <template v-if="pkb.length">
        <h4>{{ hurufPkb }}. Prioritas PKB</h4>
        <table class="b keep">
          <thead><tr><th>No</th><th>Indikator</th><th>Unsur PKB</th><th>Kegiatan</th></tr></thead>
          <tbody>
            <tr v-for="p in pkb" :key="p.no">
              <td class="ctr">{{ p.no }}</td><td>{{ p.indikator }}</td><td>{{ p.unsur }}</td><td>{{ p.kegiatan }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <div class="ttd">
        <div>Penilai,<div class="sp"></div><div class="nm">{{ item.guru.penilai_nama || store.S.kepala_nama }}</div>NIP. {{ item.guru.penilai_nip || store.S.kepala_nip || '-' }}</div>
        <div>{{ store.S.kabupaten }}, {{ tglIndo(item.guru.tgl_laporan || item.guru.tgl_penilaian) || '-' }}<br>Guru yang Dinilai,<div class="sp"></div><div class="nm">{{ item.guru.nama }}</div>NIP. {{ item.guru.nip || '-' }}</div>
      </div>
    </article>
  </template>
</template>
