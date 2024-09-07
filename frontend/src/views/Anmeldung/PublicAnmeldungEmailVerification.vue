<script setup lang="ts">
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'

const route = useRoute()

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
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow flex flex-col"
    >
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <div class="grow flex flex-col items-center justify-center">
        <EnvelopeIcon class="w-20 h-20 text-primary-500 mb-5" />
        <div class="text-center">
          <h1 class="text-2xl font-semibold mb-2">Noch ein letzter Schritt</h1>
          <p class="mb-5">
            Wir haben dir eine E-Mail an die E-Mail-Adresse geschickt, die du bei deiner Anmeldung angegeben hast. Bitte
            klicke auf den Link in der E-Mail, um die Anmeldung abzuschließen.
          </p>
          <p>Du kannst dieses Fenster schließen.</p>
        </div>
      </div>
    </div>
    <PublicFooter />
  </div>
</template>
