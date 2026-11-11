<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { hitungRole } from '@/lib/engine'
import { fmt } from '@/lib/format'
import PkgTabs from '@/components/PkgTabs.vue'

const route = useRoute()
const router = useRouter()
const store = useSimad()
const form = reactive({})
const item = computed(() => store.hasilGuru(route.params.id))
const role = computed(() => String(route.params.role || ''))

function fill() {
  for (const k of Object.keys(form)) delete form[k]
  const h = item.value?.hasil.hasil[role.value]
  if (!h) return
  for (const c of h.comps) {
    c.vals.forEach((v, i) => { form[`${c.k}_${i}`] = v === null || Number.isNaN(v) ? null : Number(v) })
  }
}
watch(() => [route.params.id, route.params.role, store.nilai], fill, { immediate: true })

const live = computed(() => {
  const scores = {}
  for (const [key, val] of Object.entries(form)) {
    if (val === null || val === '') continue
    const [k, i] = key.split('_')
    scores[`${k},${i}`] = Number(val)
  }
  return hitungRole(role.value, scores)
})

function setAll(v) {
  for (const c of live.value.comps) {
    for (let i = 0; i < c.n; i++) form[`${c.k}_${i}`] = v
  }
}

async function simpan(keHasil) {
  const pairs = []
  for (const [key, val] of Object.entries(form)) {
    if (val === null || val === '') continue
    const [k, i] = key.split('_')
    pairs.push([Number(k), Number(i), Number(val)])
  }
  try {
    await store.saveNilai(Number(route.params.id), role.value, pairs)
    store.setFlash('ok', 'Penilaian disimpan.')
    if (keHasil) router.push(`/pkg/${route.params.id}/hasil`)
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <p v-if="!item" class="empty">Guru tidak ditemukan pada tahun ajaran aktif.</p>
  <template v-else>
    <PkgTabs :guru="item.guru" :hasil="item.hasil" />
    <div class="card mb">
      <div class="hd" style="margin:0">
        <div>
          <h3>{{ live.label }}</h3>
          <p>{{ item.guru.nama }} • {{ item.guru.nip || item.guru.status }} • {{ item.guru.mapel }}</p>
        </div>
        <RouterLink class="btn sm no-print" :to="`/pkg/salin?src=${item.guru.id}&role=${role}`">Salin ke guru lain</RouterLink>
      </div>
      <div class="legend" style="margin:10px 0 0">
        <span><b>0</b> = Tidak ada bukti / tidak terpenuhi</span>
        <span><b>1</b> = Terpenuhi sebagian</span>
        <span><b>2</b> = Seluruhnya terpenuhi</span>
        <span style="margin-left:auto">
          <button type="button" class="btn sm" @click="setAll(2)">Semua → 2</button>
          <button type="button" class="btn sm" @click="setAll(null)">Kosongkan</button>
        </span>
      </div>
    </div>

    <section v-for="c in live.comps" :key="c.k" class="card comp">
      <div class="ch">
        <b>Kompetensi {{ c.k + 1 }} · {{ c.judul }}</b>
        <span style="display:flex;gap:8px;align-items:center">
          <span class="pill g">{{ fmt(c.nilai, 1) }}</span>
          <span class="pill">Level {{ c.level }}</span>
        </span>
      </div>
      <div v-for="(teks, i) in c.indikator" :key="i" class="ind">
        <span class="no">{{ i + 1 }}</span>
        <span>{{ teks }}</span>
        <span class="seg">
          <label v-for="s in [0, 1, 2]" :key="s">
            <input v-model="form[`${c.k}_${i}`]" type="radio" :name="`s_${c.k}_${i}`" :value="s">
            <span>{{ s }}</span>
          </label>
        </span>
      </div>
    </section>

    <div class="sticky-sum">
      <div><small class="mute">Jumlah level</small><div class="big">{{ live.jml_level }}/{{ live.maks_level }}</div></div>
      <div><small class="mute">Nilai skala 100</small><div class="big">{{ fmt(live.nilai100, 1) }}</div></div>
      <div><small class="mute">Terisi</small><div class="big">{{ live.terisi }}/{{ live.total_ind }}</div></div>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button class="btn p lg" type="button" @click="simpan(false)">Simpan</button>
        <button class="btn lg" type="button" @click="simpan(true)">Simpan &amp; Lihat Hasil</button>
      </div>
    </div>
  </template>
</template>
