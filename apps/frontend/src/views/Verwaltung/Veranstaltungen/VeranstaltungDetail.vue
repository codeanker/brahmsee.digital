<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  DocumentIcon,
  MegaphoneIcon,
  SquaresPlusIcon,
  UsersIcon,
  WalletIcon,
  CameraIcon,
  RocketLaunchIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import CustomFieldsTable from '@/components/CustomFields/CustomFieldsTable.vue'
import FilesExport, { type ExportedFileType } from '@/components/FilesExport.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import VeranstaltungCard from '@/components/UIComponents/VeranstaltungCard.vue'
import UnterveranstaltungenTable from '@/components/data/UnterveranstaltungenTable.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { formatDateWith } from '@codeanker/helpers'
import { PlusIcon } from '@heroicons/vue/24/solid'
import ProgramList from '../Program/ProgramList.vue'
import AnmeldeLinkTable from '@/components/data/AnmeldeLinkTable.vue'
import FormVeranstaltungDelete from '@/components/forms/veranstaltung/FormVeranstaltungDelete.vue'

const { setTitle } = useRouteTitle()

const route = useRoute()

const { state: veranstaltung } = useAsyncState(async () => {
  const result = await apiClient.veranstaltung.verwaltungGet.query({
    id: route.params.veranstaltungId as string,
  })
  setTitle(`Veranstaltung: ${result.name}`)
  return result
}, null)

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const keyInfoDateFormat = 'dddd, DD. MMMM YYYY'

const keyInfos = computed<KeyInfo[]>(() => {
  if (veranstaltung.value) {
    return [
      {
        title: 'Hostname',
        value: 'https://' + veranstaltung.value.hostname?.hostname + '',
      },
      {
        title: 'Zeitraum der Veranstaltung',
        value: `${formatDateWith(veranstaltung.value.beginn, keyInfoDateFormat)} - ${formatDateWith(veranstaltung.value.ende, keyInfoDateFormat)}`,
      },
      {
        title: 'Zeitraum für Anmeldungen',
        value: `${formatDateWith(veranstaltung.value.meldebeginn, keyInfoDateFormat)} - ${formatDateWith(veranstaltung.value.meldeschluss, keyInfoDateFormat)}`,
      },
      { title: 'Veranstaltungsort', value: veranstaltung.value.ort?.name ?? '' },
      { title: 'Teilnahmebeitrag', value: veranstaltung.value.teilnahmegebuehr + '€' },
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
    { name: 'Programm', icon: ClipboardDocumentListIcon },
    { name: 'Ausschreibungen', icon: MegaphoneIcon },
    { name: 'Anmeldelinks', icon: LinkIcon },
    { name: 'Felder', icon: SquaresPlusIcon },
    { name: 'Veranstaltung löschen', icon: TrashIcon },
  ]
  return tabs
})

const getJWT = () => {
  return localStorage.getItem('jwt')
}

const exportParams = `jwt=${getJWT()}&veranstaltungId=${route.params.veranstaltungId}`

const files: ExportedFileType[] = [
  {
    name: 'Teilnehmendenliste',
    icon: UsersIcon,
    href: `/api/export/sheet/teilnehmendenliste?${exportParams}`,
    description: 'Liste aller Teilnehmenden',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:text-blue-700',
  },
  {
    name: 'Unterschriftenliste',
    icon: DocumentDuplicateIcon,
    href: `/api/export/sheet/unterschriftenliste?${exportParams}`,
    description: 'Unterschriftenliste für Förderungen',
    bgColor: 'bg-green-600',
    hoverColor: 'hover:text-green-700',
  },
  {
    name: 'Verpflegung',
    initial: 'VP',
    href: `/api/export/sheet/verpflegung?${exportParams}`,
    description: 'Übersicht der Verpflegungswünsche',
    bgColor: 'bg-primary-600',
    hoverColor: 'hover:text-primary-700',
  },
  {
    name: 'Fotos (Gruppiert)',
    description: 'Alle Fotos von bestätigten Teilnehmenden, gruppiert nach Veranstaltung und Ausschreibung',
    icon: CameraIcon,
    bgColor: 'bg-orange-600',
    hoverColor: 'hover:text-orange-700',
    href: `/api/export/archive/photos?${exportParams}&mode=group`,
  },
  {
    name: 'Fotos (Für automatisierte Verarbeitung)',
    description: 'Alle Fotos von bestätigten Teilnehmenden, optimiert für automatisierte Verarbeitung',
    icon: CameraIcon,
    bgColor: 'bg-orange-600',
    hoverColor: 'hover:text-orange-700',
    href: `/api/export/archive/photos?${exportParams}&mode=flat`,
  },
]

const publicProgramLink = computed(() => {
  if (!veranstaltung.value || !veranstaltung.value.publicReadToken) {
    return null
  }
  return `https://${veranstaltung.value.hostname?.hostname}/veranstaltung/${veranstaltung.value.publicReadToken}`
})

function copyProgramLink() {
  if (publicProgramLink.value) {
    navigator.clipboard.writeText(publicProgramLink.value)
  }
}
</script>

<template>
  <div class="max-w-2xl lg:mx-0 mb-6">
    <h2 class="text-2xl font-bold tracking-tight sm:text-4xl">
      {{ veranstaltung?.name }}
    </h2>
    <p class="text-md">Hier bearbeiten wir die Veranstaltung damit Gliederungen sich anmelden können.</p>
  </div>
  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab
      key="Allgemein"
      class="grid grid-col-2"
      :full-width="true"
    >
      <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
        <div class="text-lg font-semibold">Überblick zur Veranstaltung</div>
        <RouterLink
          class="text-primary-600"
          :to="{ name: 'VerwaltungVeranstaltungEdit' }"
        >
          Veranstaltung bearbeiten
        </RouterLink>
      </div>

      <VeranstaltungCard
        v-if="veranstaltung"
        :key="veranstaltung.id"
        :veranstaltung="veranstaltung"
      />

      <div class="text-lg font-semibold mt-8 mb-4">Weitere Daten</div>
      <InfoList :infos="keyInfos" />
    </Tab>
    <Tab key="Dokumente">
      <div class="my-10">
        <div class="text-lg font-semibold">Dokumente</div>
        <p class="max-w-2xl text-sm text-gray-500">Exports von Daten zu dieser Veranstaltung</p>
      </div>
      <FilesExport :files="files" />
    </Tab>
    <Tab key="Bedingungen">
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
    <Tab
      key="Programm"
      :full-width="true"
    >
      <div class="my-10 flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold">Programmpunkte <Badge color="danger">BETA</Badge></div>
          <p class="max-w-2xl text-sm text-gray-500">
            Hier kann eine Übersicht über Programmpunkte der Veranstaltung angelegt werden.
          </p>
        </div>

        <RouterLink
          class="text-primary-500 flex items-center"
          :to="{ name: 'Verwaltung Programmpunkt erstellen' }"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          <span>Programmpunkt erstellen</span>
        </RouterLink>
      </div>

      <div
        v-if="publicProgramLink"
        class="p-6 bg-primary-100 dark:bg-primary-900 rounded-md my-8 flex items-top space-x-4"
      >
        <div><RocketLaunchIcon class="h-10 w-10 text-primary-600" /></div>
        <div class="w-full">
          <div class="font-bold text-lg text-primary-600">Die Programmpunkte sind öffentlich verfügbar</div>
          <div>Verteile den folgenden Link an die Teilnehmenden</div>
          <div class="flex mt-4">
            <input
              id="linkInput"
              v-model="publicProgramLink"
              type="text"
              class="form-control rounded-r-none bg-white dark:bg-primary-950"
              placeholder="Link"
              readonly
            />
            <button
              class="p-2 btn-primary rounded-l-none"
              type="button"
              @click="copyProgramLink"
            >
              <DocumentDuplicateIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <ProgramList
        v-if="veranstaltung"
        :veranstaltung-id="veranstaltung.id"
      />
    </Tab>
    <Tab
      key="Ausschreibungen"
      :full-width="true"
    >
      <div class="my-10 flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold">Unterveranstaltungen</div>
          <p class="max-w-2xl text-sm text-gray-500">
            Zu dieser Veranstaltung wurden die folgenden Unterveranstaltungen erstellt.
          </p>
        </div>
        <RouterLink
          class="text-primary-500 flex items-center"
          :to="{ name: 'UnterveranstaltungCreate' }"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          <span>Ausschreibung erstellen</span>
        </RouterLink>
      </div>

      <UnterveranstaltungenTable
        v-if="veranstaltung?.id"
        :veranstaltung-id="veranstaltung?.id"
      />
    </Tab>
    <Tab
      key="anmeldelinks"
      :full-width="true"
    >
      <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
        <div class="max-w-4xl">
          <div class="text-lg font-semibold">Anmeldelinks</div>
          <p class="text-sm text-gray-500">
            Mit einem Anmeldelink können Personen sich auch dann anmelden, wenn der Meldeschluss erreicht oder die
            maximale Teilnehmendenzahl erreicht ist. Eine Bestätigung der Anmeldung ist dennoch erforderlich.
          </p>
        </div>
      </div>

      <AnmeldeLinkTable
        v-if="veranstaltung"
        :filter="{ type: 'veranstaltung', veranstaltungId: veranstaltung.id }"
      />
    </Tab>
    <Tab
      key="Felder"
      :full-width="true"
    >
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
    <Tab key="delete">
      <FormVeranstaltungDelete
        v-if="veranstaltung"
        :id="veranstaltung.id"
      />
    </Tab>
  </Tabs>
</template>
