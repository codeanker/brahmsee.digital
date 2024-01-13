<script setup lang="ts">
import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState, formatDate } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()
const router = useRouter()

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const keyInfos = computed<KeyInfo[]>(() => {
  if (unterveranstaltung.value) {
    return [
      {
        title: 'Beginn',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.beginn, 'DD.MM.YYYY HH:mm')} Uhr`,
      },
      {
        title: 'Ende',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.ende, 'DD.MM.YYYY HH:mm')} Uhr`,
      },
      { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '', small: true },
      { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€ pro Person' },
      { title: 'Meldeschluss', value: formatDate(unterveranstaltung.value.meldeschluss, 'DD.MM.YYYY') },
      { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})

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
      class="grow"
    >
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <div class="text-3xl font-medium mb-5">Ausschreibung {{ unterveranstaltung?.veranstaltung.name }}</div>
      <!-- List -->
      <InfoList :infos="keyInfos" />
      <div
        class="my-5"
        v-html="unterveranstaltung?.beschreibung"
      ></div>
      <Button
        color="primary"
        class="w-full lg:w-auto justify-center mb-20"
        @click="() => router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung')"
        >Jetzt anmelden</Button
      >
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
        Keine Ausschreibung gefunden
      </template>
    </div>
    <PublicFooter />
  </div>
</template>
