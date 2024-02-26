<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import AnmeldungenTable from '@/components/AnmeldungenTable.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { formatDate } from '@codeanker/helpers'

const route = useRoute()

const { state: unterveranstaltung } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN')
    return apiClient.unterveranstaltung.verwaltungGet.query({
      id: parseInt(route.params.unterveranstaltungId as string),
    })
  return apiClient.unterveranstaltung.gliederungGet.query({
    id: parseInt(route.params.unterveranstaltungId as string),
  })
}, undefined)

const { state: countAnmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    return apiClient.anmeldung.verwaltungCount.query({
      filter: {
        unterveranstaltungId: parseInt(route.params.unterveranstaltungId as string),
      },
    })
  }
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
  let tabs = [
    { name: 'Ausschreibung', icon: MegaphoneIcon },
    { name: 'Anmeldungen', icon: UserGroupIcon, count: countAnmeldungen.value.total },
    { name: 'Bedingungen', icon: ClipboardDocumentListIcon },
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
</script>

<template>
  <div>
    <h5 class="mb-10">Ausschreibung für {{ unterveranstaltung?.veranstaltung?.name }}</h5>
    <div class="pt-2 pb-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
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
          <div><RocketLaunchIcon class="h-10 w-10 text-primary-500"></RocketLaunchIcon></div>
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
                <DocumentDuplicateIcon class="h-5 w-5"></DocumentDuplicateIcon>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
          <div class="text-lg font-semibold">Veranstaltungsdaten</div>
          <RouterLink
            class="text-primary-500"
            :to="{ name: 'UnterveranstaltungEdit' }"
            >Ausschreibung bearbeiten</RouterLink
          >
        </div>

        <InfoList :infos="keyInfos" />

        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
        <div class="px-3 py-5">
          <div
            class="prose prose-neutra"
            v-html="unterveranstaltung?.beschreibung"
          ></div>
        </div>
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
          <div class="text-lg font-semibold">Bedingungen <Badge color="secondary">Gliederung</Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die folgenden Bedingungen</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.bedingungen"
        ></div>
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Öffentliche Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">
            Bitte beachte die folgenden Teilnahmebedingungen, diese sind bei der Anmeldung öffentlich einsehbar.
          </p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
        ></div>
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Interne Teilnahmebedingungen <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die folgenden Teilnahmebedingungen für die Gliederung</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungen"
        ></div>
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Datenschutz <Badge>Veranstaltung</Badge></div>
          <p class="max-w-2xl text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
        ></div>
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
