<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'

const route = useRoute()
const { state: person, execute: refetch } = useAsyncState(async () => {
  const personId = route.params.personId as string
  return await apiClient.person.verwaltungGet.query({ id: parseInt(personId) })
}, null)
</script>

<template>
  <h5>Person: {{ person?.firstname }} {{ person?.lastname }}</h5>

  <div class="mt-10">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <FormPersonGeneral
      v-if="person"
      :person="person"
      @update="refetch"
    />
  </div>
</template>
