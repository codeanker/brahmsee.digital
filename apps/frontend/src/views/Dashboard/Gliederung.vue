<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import VeranstaltungCard from '@/components/UIComponents/VeranstaltungCard.vue'
import initialData from '@/components/Table/initialData'

const { state: veranstaltungen } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({})
}, initialData)
</script>

<template>
  <VeranstaltungCard
    v-for="veranstaltung in veranstaltungen.data"
    :key="veranstaltung.id"
    :veranstaltung="veranstaltung"
    :has-unterveranstaltungen="veranstaltung.unterveranstaltungen.length"
  />
</template>
