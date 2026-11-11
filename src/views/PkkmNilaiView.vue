<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { hitungPkkmBagian, pkkmSecs } from '@/lib/engine'
import { fmt } from '@/lib/format'

const route = useRoute()
const store = useSimad()
const form = reactive({})
const tahun = computed(() => Number(route.params.tahun))
const penilai = computed(() => Number(route.params.penilai))
const secs = computed(() => pkkmSecs(tahun.value))

function fill() {
  for (const k of Object.keys(form)) delete form[k]
  const rows = store.pkkm.filter((r) => Number(r.tahun) === tahun.value && Number(r.penilai) === penilai.value)
  for (const r of rows) form[`${r.sec}_${r.u}_${r.i}`] = Number(r.skor)
}
watch(() => [route.params.tahun, route.params.penilai, store.pkkm], fill, { immediate: true })

const live = computed(() => {
  const scores = {}
  for (const [key, val] of Object.entries(form)) {
    if (val === null || val === '') continue
    const [sec, u, i] = key.split('_')
    scores[`${sec},${u},${i}`] = Number(val)
  }
  return hitungPkkmBagian(secs.value, scores)
})

function setAll(v) {
  secs.value.forEach((s) => {
    s.unsur.forEach((un, u) => {
      un.indikator.forEach((_, i) => { form[`${s.kode}_${u}_${i}`] = v })
    })
  })
}

async function simpan() {
  const pairs = []
  for (const [key, val] of Object.entries(form)) {
    if (val === null || val === '') continue
    const [sec, u, i] = key.split('_')
    pairs.push([sec, Number(u), Number(i), Number(val)])
  }
  try {
    await store.savePkkm(tahun.value, penilai.value, pairs)
    store.setFlash('ok', 'Nilai PKKM disimpan.')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <div class="tabs">
    <RouterLink v-for="t in 4" :key="t" :to="`/pkkm/${t}/nilai/${penilai}`" :class="{ on: t === tahun }">Tahun {{ t }}</RouterLink>
    <RouterLink v-for="p in [1, 2]" :key="'p' + p" :to="`/pkkm/${tahun}/nilai/${p}`" :class="{ on: p === penilai }">Penilai {{ p === 1 ? 'I' : 'II' }}</RouterLink>
    <RouterLink :to="`/pkkm/${tahun}/rekap`">Rekap</RouterLink>
  </div>
  <div class="card mb">
    <div class="hd" style="margin:0">
      <div>
        <h3>Instrumen PKKM – Tahun {{ tahun }} – Penilai {{ penilai === 1 ? 'I' : 'II' }}</h3>
        <p>{{ store.S.kepala_nama }} • {{ store.S.madrasah_nama }}</p>
      </div>
    </div>
    <div class="legend" style="margin:10px 0 0">
      <span><b>1</b> Kurang</span><span><b>2</b> Cukup</span><span><b>3</b> Baik</span><span><b>4</b> Sangat baik</span>
      <span><b>N/A</b> tidak berlaku (indikator opsional)</span>
      <span style="margin-left:auto">
        <button type="button" class="btn sm" @click="setAll(4)">Semua → 4</button>
        <button type="button" class="btn sm" @click="setAll(null)">Kosongkan</button>
      </span>
    </div>
  </div>
  <section v-for="(s, si) in secs" :key="s.kode" class="card comp">
    <div class="ch">
      <b>{{ s.kode }}. {{ s.judul }}</b>
      <span class="pill g">Nilai {{ fmt(live[si]?.nilai || 0, 1) }}</span>
    </div>
    <template v-for="(un, u) in s.unsur" :key="un.no">
      <div style="padding:10px 18px;background:#fafcfb;border-bottom:1px solid #eef2f0;font-weight:700;font-size:13px">{{ un.no }} {{ un.judul }}</div>
      <div v-for="(ind, i) in un.indikator" :key="i" class="ind">
        <span class="no">{{ i + 1 }}</span>
        <span>{{ ind.teks }}<br v-if="ind.data"><small v-if="ind.data" class="mute">Data: {{ ind.data }}</small></span>
        <span class="seg s4">
          <label v-for="x in [1, 2, 3, 4]" :key="x">
            <input v-model="form[`${s.kode}_${u}_${i}`]" type="radio" :name="`s_${s.kode}_${u}_${i}`" :value="x"><span>{{ x }}</span>
          </label>
          <label v-if="ind.opsional">
            <input v-model="form[`${s.kode}_${u}_${i}`]" class="na" type="radio" :name="`s_${s.kode}_${u}_${i}`" :value="0"><span>N/A</span>
          </label>
        </span>
      </div>
    </template>
  </section>
  <div class="sticky-sum">
    <button class="btn p lg" type="button" @click="simpan">Simpan</button>
    <RouterLink class="btn lg" to="/pkkm">Kembali</RouterLink>
  </div>
</template>
