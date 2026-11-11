<script setup>
import { reactive } from 'vue'
import { useSimad } from '@/stores/simad'

const store = useSimad()
const keys = [
  ['madrasah_nama', 'Nama madrasah'],
  ['npsn', 'NPSN'],
  ['nsm', 'NSM'],
  ['akreditasi', 'Akreditasi'],
  ['status_madrasah', 'Status'],
  ['alamat', 'Alamat'],
  ['desa', 'Desa'],
  ['kecamatan', 'Kecamatan'],
  ['kabupaten', 'Kabupaten'],
  ['provinsi', 'Provinsi'],
  ['telp', 'Telepon'],
  ['email', 'Email'],
  ['kepala_nama', 'Kepala madrasah'],
  ['kepala_nip', 'NIP kepala'],
  ['unit_kerja_penilai', 'Unit kerja penilai'],
  ['tempat_penilaian', 'Tempat penilaian'],
]
const form = reactive(Object.fromEntries(keys.map(([k]) => [k, store.S[k] || ''])))

async function simpan() {
  try {
    await store.saveSettings({ ...form })
    store.setFlash('ok', 'Profil madrasah disimpan.')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <form class="card" @submit.prevent="simpan">
    <h3>Profil madrasah</h3>
    <div class="fg mt">
      <label v-for="[k, lab] in keys" :key="k" class="f" :class="{ full: k === 'alamat' }">{{ lab }}
        <input v-model="form[k]">
      </label>
    </div>
    <div class="actions"><button class="btn p" type="submit">Simpan profil</button></div>
  </form>
</template>
