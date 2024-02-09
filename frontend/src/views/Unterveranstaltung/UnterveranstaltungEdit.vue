<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormUnterveranstaltungGeneral from '@/components/forms/unterveranstaltung/FormUnterveranstaltungGeneral.vue'

const route = useRoute()
const { state: unterveranstaltung, execute: fetchUnterveranstaltung } = useAsyncState(async () => {
  const unterveranstaltungId = route.params.unterveranstaltungId as string
  return apiClient.unterveranstaltung.gliederungGet.query({
    id: parseInt(unterveranstaltungId),
  })
}, null)
</script>

<template>
  <FormUnterveranstaltungGeneral
    v-if="unterveranstaltung !== null"
    :unterveranstaltung="unterveranstaltung"
    mode="update"
    @update="() => fetchUnterveranstaltung()"
  />
</template>
