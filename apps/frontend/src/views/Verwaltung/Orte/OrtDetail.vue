<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormOrtGeneral from '@/components/forms/ort/FormOrtGeneral.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()

const route = useRoute()
const { state: ort, execute: fetchOrt } = useAsyncState(async () => {
  const ortId = route.params.ortId as string
  const result = await apiClient.ort.verwaltungGet.query({ id: ortId })
  setTitle('Ort: ' + result.name)
  return result
}, null)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormOrtGeneral
      v-if="ort !== null"
      :ort="ort"
      mode="update"
      @update="() => fetchOrt()"
    />
  </div>
</template>
