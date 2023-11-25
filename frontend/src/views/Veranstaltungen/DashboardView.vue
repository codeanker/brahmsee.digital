<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()

watch(
  () => route.params.veranstaltungId,
  () => {
    veranstaltung.value = null
    execute()
  }
)

const {
  state: veranstaltung,
  execute,
  isLoading,
} = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Veranstaltungen Detail {{ veranstaltung?.name }}</h5>
    <div v-if="isLoading"><Loading color="primary" /> Loading...</div>
    <div v-else>
      {{ veranstaltung }}
    </div>
  </div>
</template>
