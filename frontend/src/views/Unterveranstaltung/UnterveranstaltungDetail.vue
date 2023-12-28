<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'

const router = useRoute()

const { state: unterveranstaltung } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.verwaltungGet.query({
    id: parseInt(router.params.unterveranstaltungId as string),
  })
}, undefined)
</script>

<template>
  <div>
    <h5>Ausschreibung Detail</h5>
    {{ unterveranstaltung }}
    <Button :to="{ name: 'UnterveranstaltungEdit' }">Bearbeiten</Button>
  </div>
</template>
