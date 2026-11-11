<script setup>
import { useSimad } from '@/stores/simad'
import { fmt, sebutClass } from '@/lib/format'

const store = useSimad()
</script>

<template>
  <div class="card">
    <div class="hd">
      <div>
        <h3>Penilaian Kinerja Guru (PKG)</h3>
        <p>Berdasarkan SK Dirjen Pendis No. 1843 Tahun 2021 • Skor indikator 0 / 1 / 2</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <RouterLink class="btn" to="/pkg/salin">Salin Penilaian</RouterLink>
        <RouterLink class="btn p" to="/pkg/rekap">Rekap &amp; Cetak</RouterLink>
      </div>
    </div>
    <div class="tw">
      <table class="t">
        <thead><tr><th>Guru</th><th>Instrumen</th><th>Terisi</th><th>Nilai Akhir</th><th>Sebutan</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-if="!store.items.length"><td colspan="6" class="empty">Belum ada data guru.</td></tr>
          <tr v-for="it in store.items" :key="it.guru.id">
            <td class="l"><b>{{ it.guru.nama }}</b><br><small class="mute">{{ it.guru.nip || it.guru.status }} • {{ it.guru.mapel || it.guru.jenis_guru }}</small></td>
            <td class="l" style="min-width:210px">
              <div v-for="r in it.hasil.roles" :key="r.key" style="margin:2px 0">
                <RouterLink class="pill" :class="it.hasil.hasil[r.key].lengkap ? '' : (it.hasil.hasil[r.key].terisi ? 'a' : 'g')" :to="`/pkg/${it.guru.id}/nilai/${r.key}`">
                  {{ r.label }}{{ r.utama ? '' : ' (tambahan)' }} · {{ it.hasil.hasil[r.key].terisi }}/{{ it.hasil.hasil[r.key].total_ind }}
                </RouterLink>
              </div>
            </td>
            <td>{{ it.hasil.utama.terisi }}/{{ it.hasil.utama.total_ind }}</td>
            <td><b>{{ it.hasil.utama.terisi ? fmt(it.hasil.utama.nilai_akhir, 1) : '–' }}</b></td>
            <td><span v-if="it.hasil.utama.terisi" :class="sebutClass(it.hasil.utama.sebutan)">{{ it.hasil.utama.sebutan }}</span><span v-else>–</span></td>
            <td class="nowrap">
              <RouterLink class="btn sm p" :to="`/pkg/${it.guru.id}/nilai/${it.hasil.utama.role}`">Nilai</RouterLink>
              <RouterLink class="btn sm" :to="`/pkg/${it.guru.id}/kehadiran`">Hadir</RouterLink>
              <RouterLink class="btn sm" :to="`/pkg/${it.guru.id}/pkb`">PKB</RouterLink>
              <RouterLink class="btn sm" :to="`/pkg/${it.guru.id}/hasil`">Hasil</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
