<script setup>
import { ref } from 'vue'
import { useSimad } from '@/stores/simad'

const store = useSimad()
const sibuk = ref(false)

async function unduh() {
  sibuk.value = true
  try {
    const data = await store.exportSemua()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pkkm-cadangan-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  } finally {
    sibuk.value = false
  }
}

function pulihkan(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    if (!confirm('Pulihkan cadangan ini? Data guru, PKG, PKKM, dan tahun ajaran yang ada akan diganti.')) return
    sibuk.value = true
    try {
      await store.pulihkan(JSON.parse(String(reader.result)))
      store.setFlash('ok', 'Cadangan dipulihkan.')
    } catch (err) {
      store.setFlash('error', err.message || String(err))
    } finally {
      sibuk.value = false
      e.target.value = ''
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="card">
    <h3>Cadangan data</h3>
    <p class="mute">Unduh seluruh pengaturan, tahun ajaran, guru, PKG, dan PKKM sebagai berkas JSON. Pulihkan mengganti data yang sedang tersimpan di Supabase.</p>
    <div class="actions">
      <button class="btn p" type="button" :disabled="sibuk" @click="unduh">Unduh cadangan</button>
    </div>
  </div>
  <div class="card mt" id="reset">
    <h3>Pulihkan</h3>
    <div class="drop">
      <b>Pilih berkas JSON cadangan</b>
      <input type="file" accept="application/json,.json" :disabled="sibuk" @change="pulihkan">
    </div>
  </div>
</template>
