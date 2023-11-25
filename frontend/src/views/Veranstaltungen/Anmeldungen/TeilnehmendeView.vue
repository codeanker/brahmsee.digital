<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'

const route = useRoute()

watch(
  () => route.params.veranstaltungId,
  () => {
    veranstaltung.value = null
    execute()
  }
)

const { state: veranstaltung, execute } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Veranstaltung</h5>
    {{ veranstaltung }}
  </div>
</template>
