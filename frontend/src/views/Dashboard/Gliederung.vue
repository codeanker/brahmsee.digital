<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import VeranstaltungCard from '@/components/UIComponents/VeranstaltungCard.vue'

const { state: veranstaltungen } = useAsyncState(async () => {
  return apiClient.veranstaltung.gliederungList.query()
}, [])
</script>

<template>
  <VeranstaltungCard
    v-for="v in veranstaltungen"
    :key="v.id"
    :veranstaltung="v"
    :has-unterveranstaltung="v.hasUnterveranstaltung"
  />
</template>
