<script setup lang="ts">
import { ClipboardDocumentListIcon, MegaphoneIcon, WalletIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import UnterveranstaltungenTable from '@/components/UnterveranstaltungenTable.vue'
import { formatDate } from '@codeanker/helpers'

const route = useRoute()

const { state: veranstaltung } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
}, null)

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const keyInfos = computed<KeyInfo[]>(() => {
  if (veranstaltung.value) {
    return [
      {
        title: 'Beginn',
        value: `${formatDate(veranstaltung.value.beginn)} Uhr`,
      },
      {
        title: 'Ende',
        value: `${formatDate(veranstaltung.value.ende)} Uhr`,
      },
      {
        title: 'Anmeldezeitraum',
        value: `${formatDate(veranstaltung.value.meldebeginn)} - ${formatDate(veranstaltung.value.meldeschluss)}`,
      },
      { title: 'Veranstaltungsort', value: veranstaltung.value.ort?.name ?? '' },
      { title: 'Teilnahmebeitrag', value: veranstaltung.value.teilnahmegebuehr + '€' },
      { title: 'max. Teilnahmezahl', value: veranstaltung.value.maxTeilnehmende + '' },
      { title: 'Zielgruppe', value: veranstaltung.value.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})

const tabs = computed(() => {
  let tabs = [
    { name: 'Allgemein', icon: WalletIcon },
    { name: 'Bedingungen', icon: ClipboardDocumentListIcon },
    { name: 'Unterveranstaltungen', icon: MegaphoneIcon },
  ]
  return tabs
})
</script>

<template>
  <div>
    <h5 class="mb-10">Veranstaltung</h5>
    <div class="pt-2 pb-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">{{ veranstaltung?.name }}</h2>
        <p class="mt-4 text-md leading-6">
          Hier bearbeiten wir die Veranstaltung damit Gliederungen sich anmelden können.
        </p>
      </div>
    </div>
    <Tabs
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
          <div class="text-lg font-semibold">Veranstaltungsdaten</div>
          <RouterLink
            class="text-primary-600"
            :to="{ name: 'VerwaltungVeranstaltungEdit' }"
            >Veranstaltung bearbeiten</RouterLink
          >
        </div>

        <InfoList :infos="keyInfos" />

        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
        <div class="px-3 py-5">
          <div
            class="prose prose-neutra"
            v-html="veranstaltung?.beschreibung"
          ></div>
        </div>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold">Teilnahmebedingungen</div>
          <p class="max-w-2xl text-sm text-gray-500">Bitte beachte die folgenden Teilnahmebedingungen</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="veranstaltung?.teilnahmeBedingungen"
        ></div>
        <div class="my-10">
          <div class="text-lg font-semibold">Datenschutz</div>
          <p class="max-w-2xl text-sm text-gray-500">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="veranstaltung?.datenschutz"
        ></div>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold">Unterveranstaltungen</div>
          <p class="max-w-2xl text-sm text-gray-500">
            Zu dieser Veranstaltung wurden die folgenden Unterveranstaltungen erstellt.
          </p>
        </div>
        <UnterveranstaltungenTable
          v-if="veranstaltung?.id"
          :veranstaltung-id="veranstaltung?.id"
        />
      </Tab>
    </Tabs>
  </div>
</template>
