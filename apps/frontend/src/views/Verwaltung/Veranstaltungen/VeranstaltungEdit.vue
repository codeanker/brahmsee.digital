<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormVeranstaltungGeneral from '@/components/forms/veranstaltung/FormVeranstaltungGeneral.vue'

const route = useRoute()
const { state: veranstaltung, execute: fetchVeranstaltung } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: route.params.veranstaltungId as string })
}, null)
</script>

<template>
  <h5>Veranstaltung bearbeiten</h5>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormVeranstaltungGeneral
      v-if="veranstaltung !== null"
      :veranstaltung="veranstaltung"
      mode="update"
      @update="() => fetchVeranstaltung()"
    />
  </div>
</template>
