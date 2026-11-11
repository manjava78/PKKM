<script setup>
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { GOL, JENIS_GURU, REF, STATUS, TAHAP, UTAMA, blankGuru } from '@/lib/engine'

const route = useRoute()
const router = useRouter()
const store = useSimad()
const form = reactive(blankGuru())
const baru = () => !route.params.id

watch(() => [route.params.id, store.guru], () => {
  const g = route.params.id ? store.guruById(route.params.id) : null
  const next = { ...blankGuru(), ...(g || {}) }
  for (const k of Object.keys(next)) {
    if (next[k] === null) next[k] = ''
  }
  for (const k of ['tugas1', 'tugas2', 'tugas3']) {
    if (!next[k]) next[k] = '-'
  }
  for (const k of Object.keys(form)) delete form[k]
  Object.assign(form, next)
}, { immediate: true })

function pilihPenilai(e) {
  const o = store.opsiPenilai.find((x) => x.nama === e.target.value)
  form.penilai_nip = o?.nip || ''
  form.penilai_pangkat = o?.pangkat || ''
}

async function simpan() {
  try {
    await store.saveGuru(form, route.params.id ? Number(route.params.id) : null)
    store.setFlash('ok', baru() ? 'Guru ditambahkan.' : 'Data guru disimpan.')
    router.push('/guru')
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <form class="card" @submit.prevent="simpan">
    <div class="sec-title">{{ route.params.id ? 'Ubah data guru' : 'Guru baru' }}</div>
    <div class="fg">
      <label class="f">Nama lengkap *<input v-model="form.nama" required></label>
      <label class="f">NIP<input v-model="form.nip"></label>
      <label class="f">No. Karpeg<input v-model="form.no_karpeg"></label>
      <label class="f">NRG<input v-model="form.nrg"></label>
      <label class="f">NUPTK<input v-model="form.nuptk"></label>
      <label class="f">Jenis kelamin *<select v-model="form.jk" required><option value="">—</option><option>Laki-laki</option><option>Perempuan</option></select></label>
      <label class="f">Tempat lahir<input v-model="form.tempat_lahir"></label>
      <label class="f">Tanggal lahir<input v-model="form.tgl_lahir" type="date"></label>
      <label class="f">Pendidikan<input v-model="form.pendidikan"></label>
      <label class="f">Status<select v-model="form.status"><option v-for="x in STATUS" :key="x">{{ x }}</option></select></label>
      <label class="f">Pangkat/Golongan<select v-model="form.pangkat"><option value="">—</option><option v-for="x in GOL" :key="x">{{ x }}</option></select></label>
      <label class="f">TMT Golongan<input v-model="form.tmt_golongan" type="date"></label>
      <label class="f">TMT Guru<input v-model="form.tmt_guru" type="date"></label>
      <label class="f">Jenis guru *<select v-model="form.jenis_guru" required><option value="">—</option><option v-for="x in JENIS_GURU" :key="x">{{ x }}</option></select></label>
      <label class="f">Instrumen<select v-model="form.instrumen"><option v-for="x in UTAMA" :key="x">{{ x }}</option></select></label>
      <label class="f">Mata pelajaran
        <select v-model="form.mapel">
          <option value="">—</option>
          <option v-for="x in REF.mapel" :key="x" :value="x">{{ x }}</option>
          <option v-if="form.mapel && !REF.mapel.includes(form.mapel)" :value="form.mapel">{{ form.mapel }}</option>
        </select>
      </label>
      <label class="f">Jam mengajar<input v-model.number="form.jam_mengajar" type="number" min="0" max="80"></label>
      <label v-for="i in 3" :key="i" class="f">Tugas tambahan {{ i }}
        <select v-model="form['tugas' + i]">
          <option value="-">—</option>
          <option v-for="x in REF.tugas" :key="x">{{ x }}</option>
        </select>
      </label>
      <label class="f">TMT tugas<input v-model="form.tmt_tugas" type="date"></label>
      <label class="f">Lembaga lain<input v-model="form.lembaga_lain"></label>
      <label class="f">Jam lembaga lain<input v-model.number="form.jam_lembaga_lain" type="number" min="0" max="80"></label>
    </div>
    <div class="sec-title">Penilai &amp; periode</div>
    <div class="fg">
      <label class="f">Nama penilai
        <select v-model="form.penilai_nama" @change="pilihPenilai">
          <option value="">— pilih penilai —</option>
          <option v-for="o in store.opsiPenilai" :key="o.nama" :value="o.nama">{{ o.nama }} — {{ o.ket }}</option>
          <option v-if="form.penilai_nama && !store.opsiPenilai.some(o => o.nama === form.penilai_nama)" :value="form.penilai_nama">{{ form.penilai_nama }} — (tersimpan)</option>
        </select>
      </label>
      <label class="f">NIP penilai<input v-model="form.penilai_nip"></label>
      <label class="f">Pangkat penilai<input v-model="form.penilai_pangkat"></label>
      <label class="f">Periode awal<input v-model="form.periode_awal" type="date"></label>
      <label class="f">Periode akhir<input v-model="form.periode_akhir" type="date"></label>
      <label class="f">Tgl penilaian<input v-model="form.tgl_penilaian" type="date"></label>
      <label class="f">Tgl laporan<input v-model="form.tgl_laporan" type="date"></label>
      <label class="f">Tahap<select v-model="form.tahap"><option v-for="x in TAHAP" :key="x">{{ x }}</option></select></label>
    </div>
    <div class="actions">
      <button class="btn p lg" type="submit">Simpan</button>
      <RouterLink class="btn" to="/guru">Batal</RouterLink>
    </div>
  </form>
</template>
