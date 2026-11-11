<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSimad } from '@/stores/simad'
import { isi } from '@/lib/format'

const route = useRoute()
const router = useRouter()
const store = useSimad()

const nama = computed(() => store.profile?.nama || store.user?.email || 'Admin')
const inisial = computed(() => nama.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'A')
const title = computed(() => route.meta.title || isi(store.S.dash_judul || 'Dashboard', store.S))
const onGuru = computed(() => route.path === '/guru' || route.path.startsWith('/guru/'))

watch(() => route.fullPath, () => {
  document.getElementById('sb')?.classList.remove('open')
})

async function gantiTa(e) {
  try {
    await store.setTahunAktif(Number(e.target.value))
  } catch (err) {
    store.setFlash('error', err.message || String(err))
  }
}

function bukaMenu() {
  document.getElementById('sb')?.classList.toggle('open')
}

async function keluar() {
  await store.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar" id="sb">
    <div class="brand">
      <div class="logo" style="font-weight:800;color:#047857">PK</div>
      <div>
        <b>SIMAD ONLINE<br>PKG &amp; PKKM</b>
        <small>{{ store.S.madrasah_nama || 'Madrasah' }}</small>
      </div>
    </div>
    <nav class="nav">
      <h6>Menu Utama</h6>
      <RouterLink to="/" :class="{ on: route.path === '/' }">Dashboard</RouterLink>
      <RouterLink to="/profil" :class="{ on: route.path === '/profil' }">Profil Madrasah</RouterLink>
      <RouterLink to="/guru" :class="{ on: onGuru && route.path !== '/guru/unggah' }">Data Guru &amp; GTK</RouterLink>
      <RouterLink v-if="onGuru" class="sub" to="/guru/unggah" :class="{ on: route.path === '/guru/unggah' }">Unggah Data Guru</RouterLink>
      <RouterLink to="/pkg" :class="{ on: route.path === '/pkg' || route.path.includes('/nilai/') || route.path.includes('/hasil') || route.path.includes('/kehadiran') || route.path.includes('/pkb') }">PKG – Kinerja Guru</RouterLink>
      <RouterLink to="/pkg/salin" :class="{ on: route.path === '/pkg/salin' }">Salin Penilaian PKG</RouterLink>
      <RouterLink to="/pkkm" :class="{ on: route.path === '/pkkm' || route.path.startsWith('/pkkm/') && route.path !== '/pkkm/data' }">PKKM – Kamad</RouterLink>
      <h6>Administrasi</h6>
      <RouterLink to="/pkg/rekap" :class="{ on: route.path === '/pkg/rekap' }">Rekap &amp; Cetak</RouterLink>
      <h6>Alat Data</h6>
      <RouterLink to="/pengaturan" :class="{ on: route.path === '/pengaturan' }">Pengaturan Akun</RouterLink>
      <RouterLink to="/pkkm/data" :class="{ on: route.path === '/pkkm/data' }">Kepala &amp; Penilai</RouterLink>
      <RouterLink to="/pengaturan#tahun">Atur Tahun Ajaran</RouterLink>
      <RouterLink to="/cadangan" :class="{ on: route.path === '/cadangan' }">Cadangan Data</RouterLink>
      <RouterLink to="/tentang" :class="{ on: route.path === '/tentang' }">Tentang Aplikasi</RouterLink>
    </nav>
    <div class="me">
      <div class="av">{{ inisial }}</div>
      <div><b>{{ nama }}</b><small>NSM: {{ store.S.nsm || '-' }}</small></div>
      <button title="Keluar" aria-label="Keluar" style="margin-left:auto" @click="keluar">↪</button>
    </div>
  </aside>
  <div class="main">
    <header class="topbar">
      <button class="burger" aria-label="Menu" @click="bukaMenu">☰</button>
      <div class="logo2" style="font-weight:800;color:#047857">PK</div>
      <div>
        <h1>{{ title }}</h1>
        <div class="sub">
          <b>{{ store.S.madrasah_nama }}</b>
          <span v-if="store.S.npsn">• NPSN: <b>{{ store.S.npsn }}</b></span>
          <span v-if="store.S.akreditasi" class="pill">Akreditasi {{ store.S.akreditasi }}</span>
        </div>
      </div>
      <div class="grow"></div>
      <div class="ta" title="Ganti tahun ajaran aktif">
        <label>TAHUN AJARAN
          <select :value="store.tahunAktif?.id || ''" aria-label="Tahun ajaran aktif" @change="gantiTa">
            <option v-for="ta in store.tahun" :key="ta.id" :value="ta.id">
              {{ ta.nama }} ({{ ta.semester }}){{ ta.is_aktif ? '' : ' · arsip' }}
            </option>
            <option v-if="!store.tahun.length" value="">Belum ada tahun ajaran</option>
          </select>
        </label>
      </div>
      <RouterLink class="btn hide-s" to="/cadangan">Cadangan</RouterLink>
      <RouterLink class="btn p hide-s" to="/guru/baru">Guru Baru</RouterLink>
      <button class="btn d" @click="keluar"><span class="hide-s">Keluar</span></button>
    </header>
    <main class="content">
      <div v-if="store.dbError" class="flash error">
        Database belum siap: {{ store.dbError }}. Jalankan berkas <b>supabase/schema.sql</b> di SQL Editor Supabase, lalu muat ulang halaman.
      </div>
      <div v-if="store.flash" class="flash" :class="store.flash.type === 'error' ? 'error' : 'ok'" role="alert">{{ store.flash.text }}</div>
      <p v-if="store.loading" class="mute">Memuat data…</p>
      <slot />
    </main>
  </div>
</template>
