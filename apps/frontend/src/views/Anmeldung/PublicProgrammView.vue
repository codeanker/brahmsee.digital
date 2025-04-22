<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import ProgramList from '../Verwaltung/Program/ProgramList.vue'
import { useAsyncState } from '@vueuse/core'
import { apiClient } from '@/api'

const veranstaltungId = useRouteParams('veranstaltungId', '', {
  transform: (id) => parseInt(id),
})

const { state: veranstaltung } = useAsyncState(
  () => {
    if (!veranstaltungId.value) {
      return null
    }

    return apiClient.veranstaltung.publicGet.query(veranstaltungId.value)
  },
  null,
  { immediate: true }
)
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
    <div class="mx-auto mb-16 max-w-2xl sm:text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600">{{ veranstaltung?.name }}</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
        Programm
      </p>
    </div>
  </div>

  <div class="pb-32">
    <ProgramList :veranstaltung-id="veranstaltungId" />
  </div>
</template>
