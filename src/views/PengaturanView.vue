<script setup>
import { reactive } from 'vue'
import { useSimad } from '@/stores/simad'

const store = useSimad()
const ta = reactive({ nama: '', semester: 'Ganjil' })
const akun = reactive({ nama: store.profile?.nama || '', password: '' })
const tampilan = reactive({
  app_nama: store.S.app_nama || '',
  app_subjudul: store.S.app_subjudul || '',
  dash_judul: store.S.dash_judul || '',
  banner_judul: store.S.banner_judul || '',
  banner_teks: store.S.banner_teks || '',
  login_judul: store.S.login_judul || '',
  login_sub: store.S.login_sub || '',
})

async function aktifkan(id) {
  try { await store.setTahunAktif(id) } catch (e) { store.setFlash('error', e.message || String(e)) }
}
async function tambah() {
  try {
    await store.tambahTahun(ta.nama, ta.semester)
    ta.nama = ''
  } catch (e) { store.setFlash('error', e.message || String(e)) }
}
async function simpanTampil() {
  try {
    await store.saveSettings({ ...tampilan })
    store.setFlash('ok', 'Tampilan disimpan.')
  } catch (e) { store.setFlash('error', e.message || String(e)) }
}
async function simpanAkun() {
  try {
    if (akun.nama.trim()) await store.ubahProfilAkun(akun.nama.trim())
    if (akun.password) {
      await store.ubahSandi(akun.password)
      akun.password = ''
    }
    store.setFlash('ok', 'Akun diperbarui.')
  } catch (e) { store.setFlash('error', e.message || String(e)) }
}
</script>

<template>
  <div class="card" id="tahun">
    <h3>Tahun ajaran</h3>
    <p class="mute">Setiap tahun ajaran menyimpan daftar guru dan PKG sendiri. Menambah tahun baru menyalin guru tanpa nilai. PKKM tetap global.</p>
    <div class="tw" style="margin:14px 0">
      <table class="t">
        <thead><tr><th>Tahun ajaran</th><th>Semester</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr v-for="row in store.tahun" :key="row.id">
            <td class="l">{{ row.nama }}</td>
            <td>{{ row.semester }}</td>
            <td><span class="pill" :class="row.is_aktif ? '' : 'g'">{{ row.is_aktif ? 'Aktif' : 'Arsip' }}</span></td>
            <td><button v-if="!row.is_aktif" class="btn sm" type="button" @click="aktifkan(row.id)">Aktifkan</button><span v-else class="mute">sedang dipakai</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <form class="filters" @submit.prevent="tambah">
      <label class="f">Tahun ajaran baru<input v-model="ta.nama" placeholder="2027/2028" required></label>
      <label class="f">Semester<select v-model="ta.semester"><option>Ganjil</option><option>Genap</option></select></label>
      <button class="btn p" type="submit">Tambah &amp; aktifkan</button>
    </form>
  </div>

  <form class="card mt" @submit.prevent="simpanTampil">
    <h3>Tampilan aplikasi</h3>
    <p class="mute">Gunakan {madrasah} pada judul agar nama madrasah tersisip otomatis.</p>
    <div class="fg mt">
      <label class="f">Nama aplikasi<input v-model="tampilan.app_nama"></label>
      <label class="f">Subjudul<input v-model="tampilan.app_subjudul"></label>
      <label class="f">Judul dashboard<input v-model="tampilan.dash_judul"></label>
      <label class="f">Judul banner<input v-model="tampilan.banner_judul"></label>
      <label class="f full">Teks banner<textarea v-model="tampilan.banner_teks" rows="3"></textarea></label>
      <label class="f">Judul login<input v-model="tampilan.login_judul"></label>
      <label class="f">Sub login<input v-model="tampilan.login_sub"></label>
    </div>
    <div class="actions"><button class="btn p" type="submit">Simpan tampilan</button></div>
  </form>

  <form class="card mt" @submit.prevent="simpanAkun">
    <h3>Akun</h3>
    <div class="fg mt">
      <label class="f">Nama tampilan<input v-model="akun.nama"></label>
      <label class="f">Sandi baru<input v-model="akun.password" type="password" minlength="6" placeholder="kosongkan jika tidak diubah"></label>
    </div>
    <p class="mute">Masuk memakai nama pengguna admin.</p>
    <div class="actions"><button class="btn p" type="submit">Simpan akun</button></div>
  </form>
</template>
