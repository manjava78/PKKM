<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimad } from '@/stores/simad'

const route = useRoute()
const store = useSimad()
const src = ref('')
const role = ref('GMP')
const target = ref([])

watch(() => store.guru, () => {
  if (!src.value && route.query.src) src.value = String(route.query.src)
  if (route.query.role) role.value = String(route.query.role)
}, { immediate: true })

const sumber = computed(() => store.hasilGuru(src.value))
const roles = computed(() => sumber.value?.hasil.roles || [])

watch(roles, (list) => {
  if (list.length && !list.some((r) => r.key === role.value)) role.value = list[0].key
})

async function salin() {
  try {
    await store.salinNilai(Number(src.value), role.value, target.value.map(Number))
    store.setFlash('ok', `Nilai disalin ke ${target.value.length} guru.`)
    target.value = []
  } catch (e) {
    store.setFlash('error', e.message || String(e))
  }
}
</script>

<template>
  <form class="card" @submit.prevent="salin">
    <h3>Salin penilaian PKG</h3>
    <p class="mute">Skor instrumen sumber menggantikan skor instrumen yang sama pada guru tujuan. Identitas guru tidak berubah.</p>
    <div class="fg mt">
      <label class="f">Guru sumber
        <select v-model="src" required>
          <option value="">—</option>
          <option v-for="g in store.guru" :key="g.id" :value="String(g.id)">{{ g.nama }}</option>
        </select>
      </label>
      <label class="f">Instrumen
        <select v-model="role" required>
          <option v-for="r in roles" :key="r.key" :value="r.key">{{ r.label }}</option>
          <option v-if="!roles.length" value="GMP">GMP</option>
        </select>
      </label>
    </div>
    <div class="sec-title">Guru tujuan</div>
    <div class="fg">
      <label v-for="g in store.guru.filter(g => String(g.id) !== String(src))" :key="g.id" class="f" style="font-weight:600">
        <input v-model="target" type="checkbox" :value="g.id" style="width:auto;min-height:0;margin-right:8px"> {{ g.nama }}
      </label>
    </div>
    <div class="actions"><button class="btn p" type="submit" :disabled="!target.length">Salin penilaian</button></div>
  </form>
</template>
