<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormOrtGeneral from '@/components/forms/ort/FormOrtGeneral.vue'

const route = useRoute()
const { state: ort, execute: fetchOrt } = useAsyncState(async () => {
  const ortId = route.params.ortId as string
  const result = await apiClient.ort.verwaltungGet.query({ id: parseInt(ortId) })
  return result
}, null)
</script>

<template>
  <div>
    <h5>Ort: {{ ort?.name }}</h5>
    <div class="mt-8">
      <FormOrtGeneral
        v-if="ort !== null"
        :ort="ort"
        mode="update"
        @update="() => fetchOrt()"
      />
    </div>
  </div>
</template>
