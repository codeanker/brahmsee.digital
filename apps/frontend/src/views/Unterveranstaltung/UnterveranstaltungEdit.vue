<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormUnterveranstaltungGeneral from '@/components/forms/unterveranstaltung/FormUnterveranstaltungGeneral.vue'
import { loggedInAccount } from '@/composables/useAuthentication'

const route = useRoute()
const { state: unterveranstaltung, execute: fetchUnterveranstaltung } = useAsyncState(async () => {
  const unterveranstaltungId = route.params.unterveranstaltungId as string
  if (loggedInAccount.value?.role === 'ADMIN') {
    return apiClient.unterveranstaltung.verwaltungGet.query({
      id: unterveranstaltungId,
    })
  } else {
    return apiClient.unterveranstaltung.gliederungGet.query({
      id: unterveranstaltungId,
    })
  }
}, null)
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-2">
    <FormUnterveranstaltungGeneral
      v-if="unterveranstaltung !== null"
      :unterveranstaltung="unterveranstaltung"
      mode="update"
      @update="() => fetchUnterveranstaltung()"
    />
  </div>
</template>
