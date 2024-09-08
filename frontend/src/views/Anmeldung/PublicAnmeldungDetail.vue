<script setup lang="ts">
import { ChevronLeftIcon, PencilSquareIcon, UserIcon } from '@heroicons/vue/24/outline'
import { formatDate, useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'

const route = useRoute()

const { state: unterveranstaltung, isLoading } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
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
  } else {
    return []
  }
})
</script>

<template>
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full overflow-y-auto">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow flex flex-col"
    >
      <!-- Header -->
      <PublicHeader
        show-profile-dropdown
        :gliederung="unterveranstaltung.gliederung"
      />
      <div class="grow flex flex-col">
        <div class="space-y-6 mb-6">
          <Button
            type="button"
            color="secondary"
            title="Zurück"
            class="flex items-center space-x-2"
          >
            <ChevronLeftIcon class="h-5" />
            <span>Zurück</span>
          </Button>
          <div class="flex flex-col justify-center">
            <h3>Brahmsee 2025</h3>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h5>Veranstaltungsdaten</h5>
            <InfoList :infos="keyInfos" />

            <div class="mt-5 lg:mt-10 mb-5 text-lg font-semibold">Beschreibung</div>
            <div class="px-3 py-5">
              <div
                class="prose dark:prose-invert"
                v-html="unterveranstaltung?.beschreibung"
              ></div>
            </div>
            <div class="my-6">
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
            <div class="my-6">
              <div class="text-lg font-semibold">Datenschutz</div>
              <p class="max-w-2xl text-sm">Bitte beachte die Hinweise zum Datenschutz</p>
            </div>
            <div
              class="prose dark:prose-invert mb-12"
              v-html="unterveranstaltung?.veranstaltung?.datenschutz"
            />
          </div>
          <div>
            <h5>Angemeldete Personen</h5>
            <div class="grid grid-cols-1 gap-4 mb-6">
              <div class="flex items-center border rounded-lg shadow-sm overflow-hidden">
                <div class="shrink-0 flex items-center justify-center w-16 h-16 text-secondary-50 bg-primary-600">
                  <UserIcon class="h-8" />
                </div>
                <div class="shrink-0 flex flex-col justify-center px-4">
                  <h6 class="m-0">Brahmsee 2024</h6>
                  <p class="m-0">Angemeldet am: 18.04.2024</p>
                </div>
                <div class="grow flex justify-end px-4">
                  <button
                    type="button"
                    class="text-primary-500 space-x-2 flex items-center"
                  >
                    <PencilSquareIcon class="h-5" />
                    <span>Bearbeiten</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center border rounded-lg shadow-sm overflow-hidden">
                <div class="shrink-0 flex items-center justify-center w-16 h-16 text-secondary-50 bg-primary-600">
                  <UserIcon class="h-8" />
                </div>
                <div class="shrink-0 flex flex-col justify-center px-4">
                  <h6 class="m-0">Brahmsee 2023</h6>
                  <p class="m-0">Angemeldet am: 12.04.2023</p>
                </div>
                <div class="grow flex justify-end px-4">
                  <button
                    type="button"
                    class="text-primary-500 space-x-2 flex items-center"
                  >
                    <PencilSquareIcon class="h-5" />
                    <span>Bearbeiten</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PublicFooter />
  </div>
</template>
