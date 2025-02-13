<script setup lang="ts">
import { ClipboardDocumentListIcon, FaceFrownIcon, MegaphoneIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import DownloadLink from '@/components/DownloadLink.vue'
import Button from '@/components/UIComponents/Button.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { dayjs } from '@codeanker/helpers'

const router = useRouter()

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const unterveranstaltung = injectUnterveranstaltung()

const keyInfos = computed<KeyInfo[]>(() => {
  if (!unterveranstaltung?.value) {
    return []
  }

  return [
    {
      title: 'Beginn',
      value: `${formatDate(unterveranstaltung.value.veranstaltung.beginn, 'DD.MM.YYYY, HH:mm')} Uhr`,
    },
    {
      title: 'Ende',
      value: `${formatDate(unterveranstaltung.value.veranstaltung.ende, 'DD.MM.YYYY, HH:mm')} Uhr`,
    },
    { title: 'Meldeschluss', value: `${formatDate(unterveranstaltung.value.meldeschluss, 'DD.MM.YYYY')} ` },
    { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '' },
    { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€' },
    { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
  ]
})

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

const isClosed = computed(() => dayjs().isAfter(unterveranstaltung?.value?.meldeschluss))
</script>

<template>
  <!-- <CookieAgreement /> -->

  <div
    v-if="unterveranstaltung"
    class="grow"
  >
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
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="prose dark:prose-invert"
            v-html="unterveranstaltung?.beschreibung"
          />
        </div>

        <template v-if="unterveranstaltung.documents && unterveranstaltung.documents.length > 0">
          <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Dokumente</div>
          <div class="px-3 py-5">
            <ul class="">
              <li
                v-for="document in unterveranstaltung.documents"
                :key="document.name"
              >
                <DownloadLink
                  :label="document.name"
                  :file-id="document.fileId"
                />
              </li>
            </ul>
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="prose dark:prose-invert"
              v-html="unterveranstaltung?.beschreibung"
            />
          </div>
        </template>
      </Tab>
      <Tab>
        <div class="my-10">
          <div class="text-lg font-semibold">Teilnahmebedingungen</div>
          <p class="max-w-2xl text-sm">Bitte beachte die folgenden Teilnahmebedingungen</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.bedingungen"
        />
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
        />
        <hr class="my-10" />
        <div class="my-10">
          <div class="text-lg font-semibold">Datenschutz</div>
          <p class="max-w-2xl text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
        </div>
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
        />
      </Tab>
    </Tabs>

    <p
      v-if="isClosed"
      class="text-red-500 my-10 text-center font-bold"
    >
      Meldeschluss erreicht. Anmeldung nicht mehr möglich.
    </p>
    <Button
      v-else
      color="primary"
      class="w-full justify-center my-10"
      @click="() => router.push(`/ausschreibung/${unterveranstaltung?.id}/anmeldung`)"
    >
      Jetzt anmelden
    </Button>
  </div>
  <div
    v-else
    class="grow flex flex-col items-center justify-center font-semibold"
  >
    <FaceFrownIcon class="w-20 h-20 text-primary-500 mb-5" />
    <span>Keine Ausschreibung gefunden</span>
  </div>
</template>
