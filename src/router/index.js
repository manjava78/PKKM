import { createRouter, createWebHistory } from 'vue-router'
import { supabaseReady } from '@/lib/supabase'
import { useSimad } from '@/stores/simad'

import LoginView from '@/views/LoginView.vue'
import SetupView from '@/views/SetupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfilView from '@/views/ProfilView.vue'
import GuruListView from '@/views/GuruListView.vue'
import GuruFormView from '@/views/GuruFormView.vue'
import GuruUnggahView from '@/views/GuruUnggahView.vue'
import PkgListView from '@/views/PkgListView.vue'
import PkgNilaiView from '@/views/PkgNilaiView.vue'
import PkgHadirView from '@/views/PkgHadirView.vue'
import PkgPkbView from '@/views/PkgPkbView.vue'
import PkgHasilView from '@/views/PkgHasilView.vue'
import PkgRekapView from '@/views/PkgRekapView.vue'
import PkgSalinView from '@/views/PkgSalinView.vue'
import PkkmView from '@/views/PkkmView.vue'
import PkkmNilaiView from '@/views/PkkmNilaiView.vue'
import PkkmRekapView from '@/views/PkkmRekapView.vue'
import PkkmDataView from '@/views/PkkmDataView.vue'
import PengaturanView from '@/views/PengaturanView.vue'
import CadanganView from '@/views/CadanganView.vue'
import TentangView from '@/views/TentangView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/siapkan', name: 'setup', component: SetupView, meta: { bare: true, public: true } },
    { path: '/login', name: 'login', component: LoginView, meta: { bare: true, public: true } },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { title: '' } },
    { path: '/profil', component: ProfilView, meta: { title: 'Profil Madrasah' } },
    { path: '/guru', component: GuruListView, meta: { title: 'Data Guru & GTK' } },
    { path: '/guru/baru', component: GuruFormView, meta: { title: 'Guru Baru' } },
    { path: '/guru/unggah', component: GuruUnggahView, meta: { title: 'Unggah Data Guru' } },
    { path: '/guru/:id/edit', component: GuruFormView, meta: { title: 'Ubah Data Guru' } },
    { path: '/pkg', component: PkgListView, meta: { title: 'PKG – Kinerja Guru' } },
    { path: '/pkg/rekap', component: PkgRekapView, meta: { title: 'Rekap & Cetak PKG' } },
    { path: '/pkg/salin', component: PkgSalinView, meta: { title: 'Salin Penilaian PKG' } },
    { path: '/pkg/:id/nilai/:role', component: PkgNilaiView, meta: { title: 'Isi Penilaian PKG' } },
    { path: '/pkg/:id/kehadiran', component: PkgHadirView, meta: { title: 'Kehadiran Guru' } },
    { path: '/pkg/:id/pkb', component: PkgPkbView, meta: { title: 'Rencana PKB' } },
    { path: '/pkg/:id/hasil', component: PkgHasilView, meta: { title: 'Hasil PKG' } },
    { path: '/pkkm', component: PkkmView, meta: { title: 'PKKM – Kepala Madrasah' } },
    { path: '/pkkm/data', component: PkkmDataView, meta: { title: 'Kepala & Penilai' } },
    { path: '/pkkm/:tahun/nilai/:penilai', component: PkkmNilaiView, meta: { title: 'Isi PKKM' } },
    { path: '/pkkm/:tahun/rekap', component: PkkmRekapView, meta: { title: 'Rekap PKKM' } },
    { path: '/pengaturan', component: PengaturanView, meta: { title: 'Pengaturan' } },
    { path: '/cadangan', component: CadanganView, meta: { title: 'Cadangan Data' } },
    { path: '/tentang', component: TentangView, meta: { title: 'Tentang Aplikasi' } },
  ],
})

router.beforeEach(async (to) => {
  if (!supabaseReady) {
    if (to.name !== 'setup') return { name: 'setup' }
    return true
  }
  const store = useSimad()
  if (!store.booted) await store.boot()
  if (to.name === 'setup') return true
  if (!store.user && !to.meta.public) {
    return { name: 'login', query: { next: to.fullPath } }
  }
  if (store.user && to.name === 'login') return { path: '/' }
  return true
})

export default router
