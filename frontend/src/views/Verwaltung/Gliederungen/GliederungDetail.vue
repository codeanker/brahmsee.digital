<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormGliederungGeneral from '@/components/forms/gliederung/FormGliederungGeneral.vue'

const router = useRoute()

const { state: gliederung, execute: fetchGliederung } = useAsyncState(async () => {
  return apiClient.gliederung.verwaltungGet.query({ id: parseInt(router.params.gliederungId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Gliederungen Detail</h5>
    <FormGliederungGeneral
      v-if="gliederung !== null"
      :gliederung="gliederung"
      mode="update"
      @update="() => fetchGliederung()"
    ></FormGliederungGeneral>
  </div>
</template>
