<script setup>
import { useRoute } from 'vue-router'

defineProps({
  guru: { type: Object, required: true },
  hasil: { type: Object, required: true },
})
const route = useRoute()
</script>

<template>
  <div class="tabs no-print">
    <RouterLink
      v-for="r in hasil.roles"
      :key="r.key"
      :to="`/pkg/${guru.id}/nilai/${r.key}`"
      :class="{ on: route.params.role === r.key }"
    >{{ r.label }}{{ r.utama ? '' : ' (tambahan)' }}</RouterLink>
    <RouterLink :to="`/pkg/${guru.id}/kehadiran`" :class="{ on: route.path.endsWith('/kehadiran') }">Kehadiran</RouterLink>
    <RouterLink :to="`/pkg/${guru.id}/pkb`" :class="{ on: route.path.endsWith('/pkb') }">Rencana PKB</RouterLink>
    <RouterLink :to="`/pkg/${guru.id}/hasil`" :class="{ on: route.path.endsWith('/hasil') }">Hasil &amp; Cetak</RouterLink>
  </div>
</template>
