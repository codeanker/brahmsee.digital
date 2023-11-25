<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'

const router = useRoute()

const { state: gliederung } = useAsyncState(async () => {
  return apiClient.gliederung.managementGet.query({ id: parseInt(router.params.gliederungId as string) })
}, null)
</script>

<template>
  <div class="container">
    <h5>Gliederungen Detail ```verwaltung/gliederungen/:id```</h5>
    {{ gliederung }}
  </div>
</template>
