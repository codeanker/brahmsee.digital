<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  DocumentIcon,
  MegaphoneIcon,
  UsersIcon,
  SquaresPlusIcon,
  WalletIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import CustomFieldsTable from '@/components/CustomFields/CustomFieldsTable.vue'
import FilesExport from '@/components/FilesExport.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import UnterveranstaltungenTable from '@/components/UnterveranstaltungenTable.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { formatDate } from '@codeanker/helpers'

const { setTitle } = useRouteTitle()

const route = useRoute()

const { state: veranstaltung } = useAsyncState(async () => {
  const result = await apiClient.veranstaltung.verwaltungGet.query({
    id: parseInt(route.params.veranstaltungId as string),
  })
  setTitle(`Veranstaltung: ${result.name}`)
  return result
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
        title: 'Hostname',
        value: 'https://' + veranstaltung.value.hostname?.hostname + '',
      },
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
  const tabs = [
    { name: 'Allgemein', icon: WalletIcon },
    { name: 'Dokumente', icon: DocumentIcon },
    { name: 'Bedingungen', icon: ClipboardDocumentListIcon },
    { name: 'Unterveranstaltungen', icon: MegaphoneIcon },
    { name: 'Felder', icon: SquaresPlusIcon },
  ]
  return tabs
})

const getJWT = () => {
  return localStorage.getItem('jwt')
}

const exportParams = `jwt=${getJWT()}&veranstaltungId=${route.params.veranstaltungId}`

const files = [
  {
    name: 'Teilnehmendenliste',
    icon: UsersIcon,
    href: `/api/export/sheet/teilnehmendenliste?${exportParams}`,
    description: 'Liste aller Teilnehmenden',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:text-blue-700',
  },
  {
    name: 'Verpflegung',
    initial: 'VP',
    href: `/api/export/sheet/verpflegung?${exportParams}`,
    description: 'Übersicht der Verpflegungswünsche',
    bgColor: 'bg-primary-600',
    hoverColor: 'hover:text-primary-700',
  },
]
</script>

<template>
  <div class="mx-auto max-w-2xl lg:mx-0 mb-6">
    <h2 class="text-2xl font-bold tracking-tight sm:text-4xl">
      {{ veranstaltung?.name }}
    </h2>
    <p class="text-md">Hier bearbeiten wir die Veranstaltung damit Gliederungen sich anmelden können.</p>
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
        >
          Veranstaltung bearbeiten
        </RouterLink>
      </div>

      <InfoList :infos="keyInfos" />

      <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
      <div class="px-3 py-5">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="prose dark:prose-invert"
          v-html="veranstaltung?.beschreibung"
        />
      </div>
    </Tab>
    <Tab>
      <div class="my-10">
        <div class="text-lg font-semibold">Dokumente</div>
        <p class="max-w-2xl text-sm text-gray-500">Exports von Daten zu dieser Veranstaltung</p>
      </div>
      <FilesExport :files="files" />
    </Tab>
    <Tab>
      <div class="my-10">
        <div class="text-lg font-semibold">Öffentliche Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
        <p class="max-w-2xl text-sm">
          Bitte beachte die folgenden Teilnahmebedingungen, diese sind bei der Anmeldung öffentlich einsehbar.
        </p>
      </div>
      <div
        v-if="veranstaltung?.teilnahmeBedingungenPublic"
        class="prose dark:prose-invert"
        v-html="veranstaltung?.teilnahmeBedingungenPublic"
      />
      <div v-else>
        <p class="text-gray-500">Keine öffentlichen Teilnahmebedingungen hinterlegt</p>
      </div>
      <hr class="my-10" />
      <div class="my-10">
        <div class="text-lg font-semibold">Interne Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
        <p class="max-w-2xl text-sm">Bitte beachte die folgenden Teilnahmebedingungen für die Gliederung</p>
      </div>
      <div
        v-if="veranstaltung?.teilnahmeBedingungen"
        class="prose dark:prose-invert"
        v-html="veranstaltung?.teilnahmeBedingungen"
      />
      <div v-else>
        <p class="text-gray-500">Keine internen Teilnahmebedingungen hinterlegt</p>
      </div>
      <hr class="my-10" />
      <div class="my-10">
        <div class="text-lg font-semibold">Datenschutz <Badge>Veranstaltung</Badge></div>
        <p class="max-w-2xl text-sm text-gray-500">Bitte beachte die Hinweise zum Datenschutz</p>
      </div>
      <div
        v-if="veranstaltung?.datenschutz"
        class="prose dark:prose-invert"
        v-html="veranstaltung?.datenschutz"
      />
      <div v-else>
        <p class="text-gray-500">Keine Datenschutzhinweise hinterlegt</p>
      </div>
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
        :hide-columns="['veranstaltung.name']"
      />
    </Tab>
    <Tab>
      <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
        <div>
          <div class="text-lg font-semibold">Benutzerdefinierte Felder</div>
          <p class="max-w-2xl text-sm text-gray-500">
            Hier können benutzerdefinierte Felder erstellt werden, welche für alle Unterveranstaltungen gelten.
          </p>
        </div>
        <RouterLink
          class="text-primary-600"
          :to="{ name: 'Verwaltung Custom Field erstellen' }"
        >
          Neues Feld
        </RouterLink>
      </div>
      <CustomFieldsTable
        v-if="veranstaltung?.id"
        :id="veranstaltung?.id"
        entity="veranstaltung"
      />
    </Tab>
  </Tabs>
</template>
