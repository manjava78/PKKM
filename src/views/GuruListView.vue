<script setup>
import { computed, ref } from 'vue'
import { useSimad } from '@/stores/simad'
import { GURU_FIELDS } from '@/lib/engine'

const store = useSimad()
const q = ref('')
const status = ref('')
const dipilih = ref([])

const rows = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return store.guru.filter((g) => {
    if (status.value && g.status !== status.value) return false
    if (!needle) return true
    return [g.nama, g.nip, g.mapel].some((v) => String(v || '').toLowerCase().includes(needle))
  })
})

function toggleAll(e) {
  dipilih.value = e.target.checked ? rows.value.map((g) => g.id) : []
}

async function hapus(ids) {
  if (!ids.length) return
  if (!confirm(`Hapus ${ids.length} data guru beserta penilaian PKG-nya?`)) return
  try {
    await store.deleteGuru(ids)
    dipilih.value = []
    store.setFlash('ok', 'Data guru dihapus.')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}

function unduhCsv() {
  const header = GURU_FIELDS.join(',')
  const lines = store.guru.map((g) => GURU_FIELDS.map((k) => {
    const v = String(g[k] ?? '')
    return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v
  }).join(','))
  const blob = new Blob([`\uFEFF${header}\n${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'data-guru.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <div class="card">
    <div class="hd">
      <div>
        <h3>Data Guru &amp; GTK</h3>
        <p>{{ store.tahunAktif ? store.tahunAktif.nama + ' (' + store.tahunAktif.semester + ')' : 'Tahun ajaran belum diatur' }}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn" type="button" @click="unduhCsv">Unduh CSV</button>
        <RouterLink class="btn" to="/guru/unggah">Unggah</RouterLink>
        <RouterLink class="btn p" to="/guru/baru">Guru Baru</RouterLink>
      </div>
    </div>
    <div class="filters">
      <input v-model="q" type="search" placeholder="Cari nama, NIP, mapel">
      <select v-model="status">
        <option value="">Semua status</option>
        <option>PNS</option><option>PPPK</option><option>GTY</option><option>GTT</option>
      </select>
      <button v-if="dipilih.length" class="btn d" type="button" @click="hapus(dipilih)">Hapus terpilih ({{ dipilih.length }})</button>
    </div>
    <div class="tw">
      <table class="t">
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAll"></th>
            <th>Nama</th><th>NIP</th><th>Status</th><th>Mapel</th><th>Instrumen</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length"><td colspan="7" class="empty">Tidak ada data guru pada tahun ajaran ini.</td></tr>
          <tr v-for="g in rows" :key="g.id">
            <td><input v-model="dipilih" type="checkbox" :value="g.id"></td>
            <td class="l"><b>{{ g.nama }}</b><br><small class="mute">{{ g.jenis_guru }}</small></td>
            <td>{{ g.nip || '–' }}</td>
            <td><span class="pill g">{{ g.status }}</span></td>
            <td class="l">{{ g.mapel || '–' }}</td>
            <td>{{ g.instrumen }}</td>
            <td class="nowrap">
              <RouterLink class="btn sm" :to="`/pkg/${g.id}/nilai/${g.instrumen || 'GMP'}`">Nilai</RouterLink>
              <RouterLink class="btn sm" :to="`/guru/${g.id}/edit`">Ubah</RouterLink>
              <button class="btn sm d" type="button" @click="hapus([g.id])">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
