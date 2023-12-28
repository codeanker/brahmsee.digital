<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormAusschreibungGeneral from '@/components/forms/ausschreibung/FormAusschreibungGeneral.vue'

const route = useRoute()
const { state: ausschreibung, execute: fetchAusschreibung } = useAsyncState(async () => {
  const ausschreibungId = route.params.ausschreibungId as string
  return apiClient.unterveranstaltung.gliederungGet.query({
    id: parseInt(ausschreibungId),
  })
}, null)
</script>

<template>
  <FormAusschreibungGeneral
    v-if="ausschreibung !== null"
    :ausschreibung="ausschreibung"
    mode="update"
    @update="() => fetchAusschreibung()"
  />
</template>
