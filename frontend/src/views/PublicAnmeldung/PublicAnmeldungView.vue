<script setup lang="ts">
import { ChevronLeftIcon, FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const router = useRouter()
const route = useRoute()

const { state: unterveranstaltung, isLoading } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)

const {
  execute: createAnmeldung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(async (anmeldung) => {
  await apiClient.anmeldung.publicCreate.mutate({
    data: {
      ...anmeldung,
      unterveranstaltungId: Number(route.params.ausschreibungId),
      gliederungId: Number(unterveranstaltung.value?.gliederung.id),
    },
  })
  router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung/result')
}, undefined)
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow"
    >
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <Button
        class="mb-10"
        color="secondary"
        @click="router.back()"
        ><ChevronLeftIcon class="h-5 mr-2" />Zurück zur Aussschreibung</Button
      >
      <div class="text-3xl font-medium">Anmeldung</div>
      <div class="mb-5">{{ unterveranstaltung?.veranstaltung.name }}</div>
      <!-- Form -->
      <FormPersonGeneral
        :loading="isLoadingCreate"
        :error="errorCreate as Error"
        submit-text="Anmelden"
        is-public-anmeldung
        @submit="(value) => createAnmeldung(undefined, value)"
      />
      <PublicFooter />
    </div>
    <div
      v-else
      class="grow flex flex-col items-center justify-center font-semibold"
    >
      <template v-if="isLoading">
        <Loading
          size="md"
          class="mb-2"
        />
        Lade Daten...
      </template>
      <template v-else>
        <FaceFrownIcon class="w-20 h-20 text-primary-500 mb-5" />
        Es ist ein Fehler aufgetreten
      </template>
    </div>
  </div>
</template>
