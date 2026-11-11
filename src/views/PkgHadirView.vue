<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { hitungHadir } from '@/lib/engine'
import { fmt } from '@/lib/format'
import PkgTabs from '@/components/PkgTabs.vue'

const route = useRoute()
const store = useSimad()
const item = computed(() => store.hasilGuru(route.params.id))
const bulan = reactive(Array.from({ length: 12 }, () => ({ terlambat: 0, pulang_cepat: 0, tk: 0 })))

watch(() => [route.params.id, store.hadir], () => {
  const rows = store.hadir.filter((r) => Number(r.guru_id) === Number(route.params.id))
  for (let b = 1; b <= 12; b++) {
    const row = rows.find((r) => Number(r.bulan) === b)
    bulan[b - 1].terlambat = row ? Number(row.terlambat) || 0 : 0
    bulan[b - 1].pulang_cepat = row ? Number(row.pulang_cepat) || 0 : 0
    bulan[b - 1].tk = row ? Number(row.tk) || 0 : 0
  }
}, { immediate: true })

const kh = computed(() => {
  const map = {}
  bulan.forEach((r, i) => { map[i + 1] = [Number(r.terlambat) || 0, Number(r.pulang_cepat) || 0, Number(r.tk) || 0] })
  return hitungHadir(map)
})

async function simpan() {
  try {
    await store.saveHadir(Number(route.params.id), kh.value.tabel.map((b) => ({
      bulan: b.no,
      terlambat: bulan[b.no - 1].terlambat,
      pulang_cepat: bulan[b.no - 1].pulang_cepat,
      tk: bulan[b.no - 1].tk,
    })))
    store.setFlash('ok', 'Kehadiran disimpan. Nilai akhir PKG ikut berubah.')
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
          <h3>Rekapitulasi Ketidakhadiran Guru</h3>
          <p>Terlambat dan pulang cepat diisi dalam menit; tanpa keterangan diisi jumlah hari. Nilai PKG dikalikan persentase kehadiran.</p>
        </div>
      </div>
      <div class="tw">
        <table class="t">
          <thead>
            <tr>
              <th>Bulan</th><th>Terlambat (menit)</th><th>Pulang cepat (menit)</th><th>Jumlah (menit)</th>
              <th>Konversi (hari)</th><th>Tanpa keterangan (hari)</th><th>Tidak hadir</th><th>Hadir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in kh.tabel" :key="b.no">
              <td class="l">{{ b.bulan }}</td>
              <td><input v-model.number="bulan[b.no - 1].terlambat" type="number" min="0" step="1" style="width:90px;margin:0;text-align:center"></td>
              <td><input v-model.number="bulan[b.no - 1].pulang_cepat" type="number" min="0" step="1" style="width:90px;margin:0;text-align:center"></td>
              <td>{{ Math.round(b.menit) }}</td>
              <td>{{ fmt(b.konversi, 2) }}</td>
              <td><input v-model.number="bulan[b.no - 1].tk" type="number" min="0" max="31" step="0.5" style="width:80px;margin:0;text-align:center"></td>
              <td>{{ fmt(b.tdk_hadir, 2) }}%</td>
              <td>{{ fmt(b.hadir, 2) }}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background:#f8faf9;font-weight:800">
              <td class="l">JUMLAH</td>
              <td>{{ Math.round(kh.terlambat) }}</td>
              <td>{{ Math.round(kh.pulang_cepat) }}</td>
              <td>{{ Math.round(kh.menit) }}</td>
              <td>{{ fmt(kh.konversi, 2) }}</td>
              <td>{{ fmt(kh.tk, 1) }}</td>
              <td>—</td>
              <td style="color:var(--g700)">{{ fmt(kh.persen_hadir, 2) }}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="actions"><button class="btn p" type="submit">Simpan kehadiran</button></div>
    </form>
  </template>
</template>
