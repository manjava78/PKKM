<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useSimad } from '@/stores/simad'
import { isi } from '@/lib/format'

const route = useRoute()
const router = useRouter()
const store = useSimad()
const err = ref('')
const S = reactive({ login_judul: 'SIMAD Online', login_sub: 'Sistem Penilaian Kinerja', madrasah_nama: '' })
const form = reactive({ username: 'admin', password: 'admin123' })

onMounted(async () => {
  const { data } = await supabase.from('settings').select('setting_key,value')
  if (data) {
    for (const r of data) S[r.setting_key] = r.value || ''
  }
})

async function kirim() {
  err.value = ''
  try {
    await store.login(form.username.trim(), form.password)
    router.push(typeof route.query.next === 'string' ? route.query.next : '/')
  } catch (e) {
    err.value = e.message || 'Gagal masuk.'
  }
}
</script>

<template>
  <div class="login">
    <form class="box" @submit.prevent="kirim">
      <div class="logo" style="font-weight:800;color:#047857">PK</div>
      <h1>{{ isi(S.login_judul || 'SIMAD Online', S) }}</h1>
      <p class="s">{{ isi(S.login_sub || 'Sistem Penilaian Kinerja', S) }}</p>
      <div v-if="err" class="flash error">{{ err }}</div>
      <label class="f">Nama pengguna<input v-model="form.username" type="text" autocomplete="username" required autofocus></label>
      <label class="f" style="margin-top:14px">Kata sandi<input v-model="form.password" type="password" autocomplete="current-password" required></label>
      <button class="btn p lg" style="width:100%;justify-content:center;margin-top:20px">Masuk</button>
    </form>
  </div>
</template>
