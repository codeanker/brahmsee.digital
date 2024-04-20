<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import AnmeldungFormGeneral from '../../Anmeldung/AnmeldungFormGeneral.vue'

import { apiClient } from '@/api'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import { loggedInAccount } from '@/composables/useAuthentication'

const route = useRoute()

const isAdmin = loggedInAccount.value?.role === 'ADMIN'

const { state: unterveranstaltungen, isLoading } = useAsyncState(
  async () => {
    return apiClient.unterveranstaltung.verwaltungList.query({
      filter: {
        veranstaltungId: parseInt(route.params.veranstaltungId as string),
      },
      pagination: { take: 100, skip: 0 },
    })
  },
  [],
  {
    immediate: isAdmin,
  }
)

const unterveranstaltungId = ref(-1)
</script>

<template>
  <BasicSelect
    v-if="loggedInAccount?.role === 'ADMIN' && !isLoading"
    v-model="unterveranstaltungId"
    required
    label="Gliederung"
    placeholder="Gliederung"
    :options="
      unterveranstaltungen.map((veranstaltung) => ({ label: veranstaltung.gliederung.name, value: veranstaltung.id }))
    "
  />

  <AnmeldungFormGeneral
    v-if="unterveranstaltungId >= 0"
    :is-public="false"
    :unterveranstaltung-id="unterveranstaltungId"
  />
</template>
