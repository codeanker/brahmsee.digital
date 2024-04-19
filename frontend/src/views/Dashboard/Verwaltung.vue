<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import VeranstaltungCard from '@/components/UIComponents/VeranstaltungCard.vue'

const { state: veranstaltungen } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])
</script>

<template>
  <VeranstaltungCard
    v-for="veranstaltung in veranstaltungen"
    :key="veranstaltung.id"
    :veranstaltung="veranstaltung"
  />
</template>
