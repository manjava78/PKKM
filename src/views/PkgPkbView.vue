<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { PKB_JENIS } from '@/lib/engine'
import PkgTabs from '@/components/PkgTabs.vue'

const route = useRoute()
const store = useSimad()
const item = computed(() => store.hasilGuru(route.params.id))
const rows = ref([])
const unsurList = Object.keys(PKB_JENIS)

function kosong() {
  return { indikator: '', unsur: unsurList[0], jenis: PKB_JENIS[unsurList[0]][0], kegiatan: '' }
}

watch(() => [route.params.id, store.pkb, store.nilai], () => {
  const paket = store.pkbGuru(route.params.id)
  const awal = paket.items.length ? paket.items : []
  rows.value = Array.from({ length: Math.max(5, awal.length) }, (_, i) => ({ ...kosong(), ...(awal[i] || {}) }))
}, { immediate: true })

async function simpan() {
  try {
    await store.savePkb(Number(route.params.id), rows.value)
    store.setFlash('ok', 'Rencana PKB disimpan.')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <p v-if="!item">Guru tidak ditemukan.</p>
  <template v-else>
    <PkgTabs :guru="item.guru" :hasil="item.hasil" />
    <form class="card" @submit.prevent="simpan">
      <div class="hd">
        <div>
          <h3>Rencana Pengembangan Keprofesian Berkelanjutan</h3>
          <p>Baris diisi dari indikator yang skornya di bawah 2. Ubah bila rencana PKB sudah ditetapkan.</p>
        </div>
      </div>
      <div v-for="(row, idx) in rows" :key="idx" class="card" style="margin-bottom:12px">
        <div class="sec-title">Prioritas {{ idx + 1 }}</div>
        <div class="fg">
          <label class="f full">Indikator<textarea v-model="row.indikator" rows="2"></textarea></label>
          <label class="f">Unsur
            <select v-model="row.unsur">
              <option v-for="u in unsurList" :key="u">{{ u }}</option>
            </select>
          </label>
          <label class="f">Jenis
            <select v-model="row.jenis">
              <option v-for="j in (PKB_JENIS[row.unsur] || [])" :key="j">{{ j }}</option>
            </select>
          </label>
          <label class="f full">Kegiatan<textarea v-model="row.kegiatan" rows="2"></textarea></label>
        </div>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="rows.push(kosong())">Tambah baris</button>
        <button class="btn p" type="submit">Simpan PKB</button>
      </div>
    </form>
  </template>
</template>
