<script setup lang="ts">
import {
  ChatBubbleLeftRightIcon,
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
import { computed, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Abbr from '@/components/Abbr.vue'
import CustomFieldsTable from '@/components/CustomFields/CustomFieldsTable.vue'
import AnmeldungenTable from '@/components/data/AnmeldungenTable.vue'
import FilesExport from '@/components/FilesExport.vue'
import FilesListAndUpload from '@/components/FilesListAndUpload.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { formatDate } from '@codeanker/helpers'
import FAQList from '../FAQs/FAQList.vue'

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
  return apiClient.anmeldung.count.query({
    filter: {
      type: 'unterveranstaltung',
      unterveranstaltungId: parseInt(route.params.unterveranstaltungId as string),
    },
  })
}, undefined)

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
    { name: 'Felder', icon: SquaresPlusIcon },
    { name: 'FAQ', icon: ChatBubbleLeftRightIcon },
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

const faqList = useTemplateRef('faqList')
</script>

<template>
  <div>
    <div class="pb-8">
      <div class="max-w-2xl lg:mx-0">
        <h2 class="text-2xl font-bold tracking-tight sm:text-4xl items-start flex">
          {{ unterveranstaltung?.veranstaltung?.name }}
          <Badge
            v-if="unterveranstaltung?.type === 'CREW'"
            class="ml-2"
            color="warning"
            >CREW</Badge
          >
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
      <Tab key="allgemeines">
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
        <hr class="my-10" />
        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
        <div class="px-3 py-5">
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="prose dark:prose-invert"
            v-html="unterveranstaltung?.beschreibung"
          />
        </div>
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Bedingungen <Badge color="secondary"> Gliederung </Badge></div>
          <p class="text-sm">Bitte beachte die folgenden Bedingungen</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.bedingungen"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Öffentliche Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
          <p class="text-sm">
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
          <p class="text-sm">Bitte beachte die folgenden Teilnahmebedingungen für die Gliederung</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungen"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Datenschutz <Badge>Veranstaltung</Badge></div>
          <p class="text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
        />
      </Tab>
      <Tab key="anmeldungen">
        <div class="my-10">
          <div class="text-lg font-semibold">Anmeldungen</div>
          <p class="text-sm text-gray-500">Die folgenden Personen haben sich angemeldet</p>
        </div>
        <AnmeldungenTable
          v-if="unterveranstaltung"
          :filter="{ type: 'unterveranstaltung', unterveranstaltungId: unterveranstaltung.id }"
        />
      </Tab>
      <Tab key="dokumente">
        <div class="grid xl:grid-cols-3 gap-8">
          <div class="col-span-2">
            <FilesListAndUpload
              v-if="unterveranstaltung"
              :entity-id="unterveranstaltung?.id"
              entity-type="unterveranstaltung"
            />
          </div>
          <div class="col-span-2 xl:col-span-1">
            <div class="my-10">
              <div class="text-lg font-semibold">Generierte Dokumente</div>
              <p class="text-sm text-gray-500">Exports von Daten zu dieser Veranstaltung</p>
            </div>
            <FilesExport :files="files" />
          </div>
        </div>
      </Tab>
      <Tab key="felder">
        <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
          <div>
            <div class="text-lg font-semibold">Benutzerdefinierte Felder</div>
            <p class="text-sm text-gray-500">
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
      <Tab key="marketing">
        <div class="my-10 flex items-center gap-x-4">
          <div>
            <div class="text-lg font-semibold"><Abbr abbr="faq" /></div>
            <p class="text-sm text-sm text-gray-500">
              Verwalte hier häufig gestellte Fragen, damit die Teilnehmenden wissen, wie der Hase läuft.
            </p>
          </div>
          <div class="flex-1"></div>
          <Button @click="() => faqList?.openFormModal()"> Frage anlegen </Button>
        </div>
        <div class="grid grid-cols-3 gap-8">
          <FAQList
            v-if="unterveranstaltung"
            ref="faqList"
            :unterveranstaltung-id="unterveranstaltung.id"
          />
        </div>
        <hr class="my-10" />
      </Tab>

      <Tab
        v-if="loggedInAccount?.role === 'ADMIN'"
        key="entwickler"
      >
        <div class="my-10">
          <div class="text-lg font-semibold">Entwickler:innen</div>
          <p class="text-sm text-gray-500">Informationen zur Veranstaltung</p>
        </div>

        <pre>{{ unterveranstaltung }}</pre>
      </Tab>
    </Tabs>
  </div>
</template>
