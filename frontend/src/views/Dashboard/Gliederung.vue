<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import VeranstaltungCard from '@/components/UIComponents/VeranstaltungCard.vue'

const { state: veranstaltungen } = useAsyncState(async () => {
  return apiClient.veranstaltung.gliederungList.query({ filter: {}, orderBy: [], pagination: { take: 100, skip: 0 } })
}, [])
</script>

<template>
  <VeranstaltungCard
    v-for="veranstaltung in veranstaltungen"
    :key="veranstaltung.id"
    :veranstaltung="veranstaltung"
    :has-unterveranstaltungen="veranstaltung.unterveranstaltungen.length"
  />
</template>
