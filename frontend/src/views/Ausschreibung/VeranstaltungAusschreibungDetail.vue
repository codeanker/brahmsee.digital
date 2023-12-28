<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'

const router = useRoute()

const { state: ausschreibung } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.verwaltungGet.query({
    id: parseInt(router.params.ausschreibungId as string),
  })
}, undefined)
</script>

<template>
  <div>
    <h5>Veranstaltungen Detail</h5>
    {{ ausschreibung }}
    <Button :to="{ name: 'VeranstaltungAusschreibungEdit' }">Bearbeiten</Button>
  </div>
</template>
