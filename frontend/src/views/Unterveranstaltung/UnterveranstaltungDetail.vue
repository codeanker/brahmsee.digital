<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  CodeBracketIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import { dayjs, formatDate } from '@codeanker/helpers'

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

const { state: anmeldungen } = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN')
      return apiClient.anmeldung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
    return apiClient.anmeldung.gliederungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  },
  [],
  {
    immediate: true,
  }
)

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
      { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})

const tabs = computed(() => {
  let tabs = [
    { name: 'Ausschreibung', icon: MegaphoneIcon },
    { name: 'Anmeldungen', icon: UserGroupIcon, count: anmeldungen.value.length },
    { name: 'Bedingungen', icon: ClipboardDocumentListIcon },
    { name: 'Datenschutz', icon: ShieldCheckIcon },
  ]
  if (loggedInAccount.value?.role === 'ADMIN') {
    tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
  }
  return tabs
})

const publicLink = computed(() => {
  if (unterveranstaltung.value) {
    return `${window.location.origin}/ausschreibung/${unterveranstaltung.value.id}`
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
    <div class="bg-white pt-2 pb-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {{ unterveranstaltung?.veranstaltung?.name }}
        </h2>
        <p class="mt-4 text-md leading-6 text-gray-600">
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
        <div class="p-6 bg-primary-100 rounded-md my-8 flex items-top space-x-4">
          <div><RocketLaunchIcon class="h-10 w-10 text-primary-600"></RocketLaunchIcon></div>
          <div>
            <div class="font-bold text-lg text-primary-600">Juhuuu deine Ausschreibung ist ready</div>
            <div>Teilnehmende können sich unter dem folgenden Link anmelden.</div>
            <div class="flex mt-4">
              <input
                id="linkInput"
                v-model="publicLink"
                type="text"
                class="form-control rounded-r-none bg-white"
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
          <div class="text-lg font-semibold text-gray-900">Veranstaltungsdaten</div>
          <RouterLink
            class="text-primary-600"
            :to="{ name: 'UnterveranstaltungEdit' }"
            >Ausschreibung bearbeiten</RouterLink
          >
        </div>

        <InfoList :infos="keyInfos" />

        <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold text-gray-900">Beschreibung</div>
        <div class="px-3 py-5">
          <div
            class="prose prose-neutra"
            v-html="unterveranstaltung?.beschreibung"
          ></div>
        </div>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold text-gray-900">Anmeldungen</div>
          <p class="max-w-2xl text-sm text-gray-500">Die folgenden Personen haben sich angemeldet</p>
        </div>
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Alter
              </th>
              <th
                v-if="loggedInAccount?.role === 'ADMIN'"
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Gliederung
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Account
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                T-Shirt
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="anmeldung in anmeldungen"
              :key="anmeldung.id"
              class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
              :title="anmeldung.person.firstname + ' ' + anmeldung.person.lastname + ' bearbeiten'"
              @click="router.push({ name: 'Verwaltung Persondetails', params: { personId: anmeldung.person.id } })"
            >
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div class="text-gray-900">{{ anmeldung.person.firstname }} {{ anmeldung.person.lastname }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div v-if="anmeldung.person.birthday">
                  {{ dayjs().diff(anmeldung.person.birthday, 'year') }} Jahre
                  <br />
                  {{ formatDate(anmeldung.person.birthday) }}
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {{ anmeldung.person.gliederung?.name }}
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div class="flex items-center">Todo: {{ anmeldung.status }}</div>
              </td>
              <td
                v-if="loggedInAccount?.role === 'ADMIN'"
                class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
              >
                Größe <span v-if="anmeldung.tshirtBestellt">{{ anmeldung.person.konfektionsgroesse }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold text-gray-900">Teilnahmebedingungen</div>
          <p class="max-w-2xl text-sm text-gray-500">Bitte beachte die folgenden Teilnahmebedingungen</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungen"
        ></div>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold text-gray-900">Datenschutz</div>
          <p class="max-w-2xl text-sm text-gray-500">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose prose-neutra"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
        ></div>
      </Tab>
      <Tab v-if="loggedInAccount?.role === 'ADMIN'">
        <div class="my-10">
          <div class="text-lg font-semibold text-gray-900">Entwickler:innen</div>
          <p class="max-w-2xl text-sm text-gray-500">Informationen zur Veranstaltung</p>
        </div>
        <pre>{{ unterveranstaltung }}</pre>
      </Tab>
    </Tabs>
  </div>
</template>
