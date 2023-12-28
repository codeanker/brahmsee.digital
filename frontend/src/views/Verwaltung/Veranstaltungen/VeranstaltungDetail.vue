<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormVeranstaltungGeneral from '@/components/forms/veranstaltung/FormVeranstaltungGeneral.vue'

const router = useRoute()

const { state: veranstaltung, execute: fetchVeranstaltung } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(router.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Veranstaltungen Detail {{ veranstaltung?.name }}</h5>
    <FormVeranstaltungGeneral
      v-if="veranstaltung !== null"
      :veranstaltung="veranstaltung"
      mode="update"
      @update="() => fetchVeranstaltung()"
    />
  </div>
</template>
