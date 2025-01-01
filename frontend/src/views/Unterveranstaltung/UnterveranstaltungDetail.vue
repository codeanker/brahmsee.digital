<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import AnmeldungenTable from '@/components/AnmeldungenTable.vue'
import CustomFieldsTable from '@/components/CustomFields/CustomFieldsTable.vue'
import DownloadLink from '@/components/DownloadLink.vue'
import FilesExport from '@/components/FilesExport.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { formatDate } from '@codeanker/helpers'

const route = useRoute()
const { setTitle } = useRouteTitle()

const { state: unterveranstaltung } = useAsyncState(async () => {
  let result
  if (loggedInAccount.value?.role === 'ADMIN') {
    result = await apiClient.unterveranstaltung.verwaltungGet.query({
      id: parseInt(route.params.unterveranstaltungId as string),
    })
  } else {
    result = await apiClient.unterveranstaltung.gliederungGet.query({
      id: parseInt(route.params.unterveranstaltungId as string),
    })
  }
  setTitle(`Ausschreibung für ${result.veranstaltung.name}`)
  return result
}, undefined)

const { state: countAnmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN')
    return apiClient.anmeldung.verwaltungCount.query({
      filter: {
        unterveranstaltungId: parseInt(route.params.unterveranstaltungId as string),
      },
    })
  else
    return apiClient.anmeldung.gliederungCount.query({
      filter: {
        unterveranstaltungId: parseInt(route.params.unterveranstaltungId as string),
      },
    })
}, [])

// @ToDo count for Gliederungen

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
        value: `${formatDate(unterveranstaltung.value.veranstaltung.beginn)} Uhr`,
      },
      {
        title: 'Ende',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.ende)} Uhr`,
      },
      { title: 'Meldeschluss', value: formatDate(unterveranstaltung.value.meldeschluss) },
      { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '' },
      { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€' },
      { title: 'max. Teilnahmezahl', value: unterveranstaltung.value.maxTeilnehmende + '' },
      { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})

const tabs = computed(() => {
  const tabs = [
    { name: 'Ausschreibung', icon: MegaphoneIcon },
    { name: 'Anmeldungen', icon: UserGroupIcon, count: countAnmeldungen.value?.total },
    { name: 'Dokumente', icon: DocumentIcon },
    { name: 'Bedingungen', icon: ClipboardDocumentListIcon },
    { name: 'Felder', icon: SquaresPlusIcon },
  ]
  if (loggedInAccount.value?.role === 'ADMIN') {
    tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
  }
  return tabs
})

const publicLink = computed(() => {
  if (unterveranstaltung?.value && unterveranstaltung.value.veranstaltung?.hostname?.hostname) {
    return `https://${unterveranstaltung?.value.veranstaltung?.hostname.hostname}/ausschreibung/${unterveranstaltung.value.id}`
  }
  return ''
})

function copyLink() {
  navigator.clipboard.writeText(publicLink.value)
}

//** Export Documents */

const getJWT = () => localStorage.getItem('jwt')
const exportParams = `jwt=${getJWT()}&unterveranstaltungId=${route.params.unterveranstaltungId}`

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
  <div>
    <div class="pb-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-2xl font-bold tracking-tight sm:text-4xl">
          {{ unterveranstaltung?.veranstaltung?.name }}
        </h2>
        <p class="mt-4 text-md leading-6">
          Erstelle und bearbeite deine Ausschreibung, Teilnehmende können sich direkt über die Ausschreibung anmelden,
          so behältst Du den Überblick.
        </p>
      </div>
    </div>
    <Tabs
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <div class="p-6 bg-primary-100 dark:bg-primary-900 rounded-md my-8 flex items-top space-x-4">
          <div><RocketLaunchIcon class="h-10 w-10 text-primary-500" /></div>
          <div>
            <div class="font-bold text-lg text-primary-500">Juhuuu deine Ausschreibung ist ready</div>
            <div>Teilnehmende können sich unter dem folgenden Link anmelden.</div>
            <div class="flex mt-4">
              <input
                id="linkInput"
                v-model="publicLink"
                type="text"
                class="form-control rounded-r-none bg-white dark:bg-primary-950"
                placeholder="Link"
                readonly
              />
              <button
                class="p-2 btn-primary rounded-l-none"
                type="button"
                @click="copyLink"
              >
                <DocumentDuplicateIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
          <div class="text-lg font-semibold">Veranstaltungsdaten</div>
          <RouterLink
            class="text-primary-500"
            :to="{ name: 'UnterveranstaltungEdit' }"
          >
            Ausschreibung bearbeiten
          </RouterLink>
        </div>

        <InfoList :infos="keyInfos" />

        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
        <div class="px-3 py-5">
          <div
            class="prose dark:prose-invert"
            v-html="unterveranstaltung?.beschreibung"
          />
        </div>

        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Dokumente</div>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
            <tr
              v-for="(document, index) in unterveranstaltung?.documents ?? []"
              :key="'document-' + index"
              class="even:bg-gray-50 dark:even:bg-gray-800"
            >
              <td class="whitespace-nowrap w-full py-5 pl-4 pr-3 text-sm">
                {{ document.name }}
              </td>
              <td class="text-sm pl-4 pr-3">
                <DownloadLink :file-id="document.fileId" />
              </td>
            </tr>
          </tbody>
        </table>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold">Anmeldungen</div>
          <p class="max-w-2xl text-sm">Die folgenden Personen haben sich angemeldet</p>
        </div>
        <AnmeldungenTable
          v-if="unterveranstaltung"
          :unterveranstaltung-id="unterveranstaltung?.id"
        />
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
          <div class="text-lg font-semibold">Bedingungen <Badge color="secondary"> Gliederung </Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die folgenden Bedingungen</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.bedingungen"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Öffentliche Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">
            Bitte beachte die folgenden Teilnahmebedingungen, diese sind bei der Anmeldung öffentlich einsehbar.
          </p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Interne Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die folgenden Teilnahmebedingungen für die Gliederung</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungen"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Datenschutz <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
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
            :to="{
              name: 'Unterveranstaltung Custom Field erstellen',
              params: { veranstaltungId: route.params.veranstaltungId },
            }"
          >
            Neues Feld
          </RouterLink>
        </div>
        <CustomFieldsTable
          v-if="unterveranstaltung?.id"
          :id="unterveranstaltung?.id"
          entity="unterveranstaltung"
        />
      </Tab>

      <Tab v-if="loggedInAccount?.role === 'ADMIN'">
        <div class="my-10">
          <div class="text-lg font-semibold">Entwickler:innen</div>
          <p class="max-w-2xl text-sm">Informationen zur Veranstaltung</p>
        </div>

        <pre>{{ unterveranstaltung }}</pre>
      </Tab>
    </Tabs>
  </div>
</template>
