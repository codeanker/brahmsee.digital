<script setup lang="ts">
import { ClipboardDocumentListIcon, FaceFrownIcon, MegaphoneIcon } from '@heroicons/vue/24/outline'
import { useAsyncState, formatDate } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'

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
        value: `${formatDate(unterveranstaltung.value.veranstaltung.beginn, 'DD.MM.YYYY')} Uhr`,
      },
      {
        title: 'Ende',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.ende, 'DD.MM.YYYY')} Uhr`,
      },
      { title: 'Meldeschluss', value: formatDate(unterveranstaltung.value.meldeschluss, 'DD.MM.YYYY') },
      { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '' },
      { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€' },
      { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})

const { state: unterveranstaltung, isLoading } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)

const tabs = [
  {
    name: 'Ausschreibung',
    icon: MegaphoneIcon,
  },
  {
    name: 'Bedingungen',
    icon: ClipboardDocumentListIcon,
  },
]
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
      <div class="text-3xl font-medium mb-14">Ausschreibung {{ unterveranstaltung?.veranstaltung.name }}</div>

      <Tabs
        content-space="4"
        :tabs="tabs"
      >
        <Tab>
          <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
            <div class="text-lg font-semibold">Veranstaltungsdaten</div>
          </div>

          <InfoList :infos="keyInfos" />

          <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
          <div class="px-3 py-5">
            <div
              class="prose prose-neutra"
              v-html="unterveranstaltung?.beschreibung"
            ></div>
          </div>
          <Button
            color="primary"
            class="w-full justify-center my-5 lg:mt-10"
            @click="() => router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung')"
            >Jetzt anmelden</Button
          >
        </Tab>
        <Tab>
          <div class="my-10">
            <div class="text-lg font-semibold">Teilnahmebedingungen</div>
            <p class="max-w-2xl text-sm">Bitte beachte die folgenden Teilnahmebedingungen</p>
          </div>
          <div
            class="prose prose-neutra"
            v-html="unterveranstaltung?.bedingungen"
          />
          <div
            class="prose prose-neutra"
            v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
          />
          <hr class="my-10" />
          <div class="my-10">
            <div class="text-lg font-semibold">Datenschutz</div>
            <p class="max-w-2xl text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
          </div>
          <div
            class="prose prose-neutra"
            v-html="unterveranstaltung?.veranstaltung?.datenschutz"
          />
        </Tab>
      </Tabs>
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
        <span>Keine Ausschreibung gefunden</span>
      </template>
    </div>
    <PublicFooter />
  </div>
</template>
