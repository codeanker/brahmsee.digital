<script setup lang="ts">
import { useAsyncState, formatDate } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import CookieAgreement from '@/components/LayoutComponents/CookieAgreement.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'

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

const { state: unterveranstaltung, execute: fetchUnterveranstaltung } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)
fetchUnterveranstaltung()
</script>

<template>
  <CookieAgreement />
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40">
    <template v-if="unterveranstaltung">
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <div class="text-3xl font-medium mb-5">Ausschreibung {{ unterveranstaltung?.veranstaltung.name }}</div>
      <!-- List -->
      <InfoList :infos="keyInfos" />
      <div class="my-5">
        {{ unterveranstaltung?.beschreibung }}
      </div>
      <Button
        color="primary"
        class="w-full lg:w-auto justify-center mb-20"
        @click="() => router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung')"
        >Jetzt anmelden</Button
      >
    </template>
    <template v-else> Keine Ausschreibung gefunden </template>
    <PublicFooter />
  </div>
</template>