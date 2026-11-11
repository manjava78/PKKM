<script setup>
import { reactive } from 'vue'
import { useSimad } from '@/stores/simad'

const store = useSimad()
const keys = [
  ['kepala_nama', 'Nama kepala'],
  ['kepala_nip', 'NIP kepala'],
  ['kepala_jk', 'Jenis kelamin'],
  ['kepala_tempat_lahir', 'Tempat lahir'],
  ['kepala_tgl_lahir', 'Tanggal lahir'],
  ['kepala_pangkat', 'Pangkat'],
  ['kepala_nuptk', 'NUPTK'],
  ['kepala_pendidikan', 'Pendidikan'],
  ['pengawas_nama', 'Pengawas I'],
  ['pengawas_nip', 'NIP pengawas I'],
  ['pengawas_pangkat', 'Pangkat pengawas I'],
  ['pengawas_jabatan', 'Jabatan pengawas I'],
  ['pengawas2_nama', 'Pengawas II'],
  ['pengawas2_nip', 'NIP pengawas II'],
  ['pengawas2_pangkat', 'Pangkat pengawas II'],
  ['unit_kerja_penilai', 'Unit kerja penilai'],
  ['tempat_penilaian', 'Tempat penilaian'],
  ['pkkm_tahun_pertama', 'Tahun pertama PKKM'],
]
const form = reactive(Object.fromEntries(keys.map(([k]) => [k, store.S[k] || ''])))

async function simpan() {
  try {
    await store.saveSettings({ ...form })
    store.setFlash('ok', 'Data kepala dan penilai disimpan.')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <form class="card" @submit.prevent="simpan">
    <h3>Kepala madrasah dan penilai PKKM</h3>
    <p class="mute">PKKM tidak dipecah per tahun ajaran. Data ini dipakai di rekap dan cetak.</p>
    <div class="fg mt">
      <label v-for="[k, lab] in keys" :key="k" class="f">{{ lab }}
        <input v-if="k !== 'kepala_jk'" v-model="form[k]" :type="k.includes('tgl') ? 'date' : 'text'">
        <select v-else v-model="form[k]"><option value="">—</option><option>Laki-laki</option><option>Perempuan</option></select>
      </label>
    </div>
    <div class="actions"><button class="btn p" type="submit">Simpan</button></div>
  </form>
</template>
