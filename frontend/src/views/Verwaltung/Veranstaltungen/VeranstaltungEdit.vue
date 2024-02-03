<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormVeranstaltungGeneral from '@/components/forms/veranstaltung/FormVeranstaltungGeneral.vue'

const route = useRoute()
const { state: veranstaltung, execute: fetchVeranstaltung } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <FormVeranstaltungGeneral
    v-if="veranstaltung !== null"
    :veranstaltung="veranstaltung"
    mode="update"
    @update="() => fetchVeranstaltung()"
  />
</template>
