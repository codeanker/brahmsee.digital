<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'

const router = useRoute()

const { state: veranstaltung } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(router.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Veranstaltungen Detail {{ veranstaltung.veranstaltung.name }}</h5>
    {{ veranstaltung }}
  </div>
</template>
