<script setup lang="ts">
import { FaceSmileIcon, FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()
const router = useRouter()

const {
  state: unterveranstaltung,
  execute: fetchUnterveranstaltung,
  isLoading,
} = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)
fetchUnterveranstaltung()
</script>

<template>
  <!-- <CookieAgreement /> -->
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow flex flex-col"
    >
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <div class="grow flex flex-col items-center justify-center">
        <FaceSmileIcon class="w-20 h-20 text-primary-500 mb-5" />
        <div class="text-center">
          <h1 class="text-2xl font-semibold mb-2">Anmeldung erfolgreich</h1>
          <p class="mb-5">
            Du hast dich erfolgreich für die Veranstaltung
            <span class="font-semibold">{{ unterveranstaltung.veranstaltung.name }}</span>
            angemeldet.
          </p>
          <Button
            class="w-full flex justify-center"
            color="secondary"
            @click="router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung')"
          >
            Weitere Person anmelden
          </Button>
        </div>
      </div>
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
    <PublicFooter />
  </div>
</template>
