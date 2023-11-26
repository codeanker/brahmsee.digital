<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'

const router = useRoute()

const { state: ort } = useAsyncState(async () => {
  return apiClient.ort.verwaltungGet.query({ id: parseInt(router.params.ortId as string) })
}, null)
</script>

<template>
  <div>
    <h5>Orte Detail {{ ort?.name }}</h5>
    {{ ort }}
  </div>
</template>
