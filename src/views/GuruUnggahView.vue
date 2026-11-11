<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { GURU_FIELDS } from '@/lib/engine'

const store = useSimad()
const router = useRouter()
const preview = ref([])
const pesan = ref('')

function parseCsv(text) {
  const rows = []
  let row = []
  let cur = ''
  let q = false
  const src = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (q) {
      if (c === '"') {
        if (src[i + 1] === '"') { cur += '"'; i++ } else q = false
      } else cur += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else if (c !== '\r') cur += c
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row) }
  return rows.filter((r) => r.some((x) => String(x).trim() !== ''))
}

function onFile(e) {
  pesan.value = ''
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const table = parseCsv(String(reader.result || ''))
    if (table.length < 2) {
      pesan.value = 'Berkas kosong atau hanya berisi judul kolom.'
      preview.value = []
      return
    }
    const header = table[0].map((h) => h.trim())
    const missing = ['nama'].filter((k) => !header.includes(k))
    if (missing.length) {
      pesan.value = 'Kolom wajib tidak ada: nama. Unduh template CSV lalu isi.'
      preview.value = []
      return
    }
    preview.value = table.slice(1).map((cols) => {
      const o = {}
      header.forEach((h, i) => { if (GURU_FIELDS.includes(h)) o[h] = cols[i] ?? '' })
      return o
    }).filter((o) => o.nama)
  }
  reader.readAsText(file)
}

function template() {
  const blob = new Blob([`\uFEFF${GURU_FIELDS.join(',')}\n`], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'template-guru.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

async function proses() {
  try {
    await store.importGuru(preview.value)
    store.setFlash('ok', `${preview.value.length} guru diunggah.`)
    router.push('/guru')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <div class="card">
    <div class="hd">
      <div>
        <h3>Unggah data guru</h3>
        <p>Berkas CSV dengan judul kolom yang sama seperti template. Excel bisa disimpan sebagai CSV.</p>
      </div>
      <button class="btn" type="button" @click="template">Unduh template CSV</button>
    </div>
    <div class="drop">
      <b>Pilih berkas .csv</b>
      <input type="file" accept=".csv,text/csv" @change="onFile">
    </div>
    <p v-if="pesan" class="flash error mt">{{ pesan }}</p>
    <div v-if="preview.length" class="mt">
      <p><b>{{ preview.length }}</b> baris siap diimpor ke tahun ajaran aktif.</p>
      <div class="tw">
        <table class="t">
          <thead><tr><th>Nama</th><th>NIP</th><th>Status</th><th>Mapel</th></tr></thead>
          <tbody>
            <tr v-for="(g, i) in preview.slice(0, 12)" :key="i">
              <td class="l">{{ g.nama }}</td><td>{{ g.nip }}</td><td>{{ g.status }}</td><td class="l">{{ g.mapel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions"><button class="btn p" type="button" @click="proses">Impor sekarang</button></div>
    </div>
  </div>
</template>
