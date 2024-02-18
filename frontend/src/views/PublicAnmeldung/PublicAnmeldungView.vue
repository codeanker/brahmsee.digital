<script setup lang="ts">
import { ChevronLeftIcon, FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { type NahrungsmittelIntoleranz } from '@codeanker/api'

const router = useRouter()
const route = useRoute()

const { state: unterveranstaltung, isLoading } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)

const showBedingungen = ref(false)

const {
  execute: createAnmeldung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)

    await apiClient.anmeldung.publicCreate.mutate({
      data: {
        unterveranstaltungId: Number(route.params.ausschreibungId),
        gliederungId: Number(unterveranstaltung.value?.gliederung.id),

        firstname: anmeldung.stammdaten.firstname,
        lastname: anmeldung.stammdaten.lastname,
        gender: anmeldung.stammdaten.gender,
        birthday: anmeldung.stammdaten.birthday ?? new Date(),
        email: anmeldung.contact.email,
        telefon: anmeldung.contact.telefon,

        address: {
          ...anmeldung.address,
        },

        notfallkontaktPersonen: anmeldung.notfallKontakte.personen,
        essgewohnheit: anmeldung.essgewohnheiten.essgewohnheit,
        nahrungsmittelIntoleranzen,
        weitereIntoleranzen: anmeldung.essgewohnheiten.weitereIntoleranzen,

        tshirtBestellt: anmeldung.tshirt.bestellen,
        konfektionsgroesse: anmeldung.tshirt.groesse,
        comment: anmeldung.comment,
      },
    })
    router.push('/ausschreibung/' + route.params.ausschreibungId + '/anmeldung/result')
  },
  undefined,
  {
    immediate: false,
  }
)
</script>

<template>
  <Drawer
    v-if="showBedingungen"
    @close="showBedingungen = false"
  >
    <div class="container mx-auto">
      <div class="text-lg font-semibold">Teilnahmebedingungen</div>
      <div
        class="prose prose-neutra"
        v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungen"
      />

      <div class="text-lg font-semibold mt-10">Datenschutz</div>
      <div
        class="prose prose-neutra"
        v-html="unterveranstaltung?.veranstaltung?.datenschutz"
      />
    </div>
  </Drawer>

  <div class="lg:py-10 lg:px-20 flex flex-col h-full grow">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow"
    >
      <!-- Header -->
      <PublicHeader :gliederung="unterveranstaltung.gliederung" />
      <Button
        class="mb-10 flex flex-row items-center"
        color="secondary"
        @click="router.back()"
      >
        <ChevronLeftIcon class="h-5 mr-2" />
        <span>Zurück zur Ausschreibung</span>
      </Button>
      <div class="text-3xl font-medium">Anmeldung</div>
      <div class="mb-5">{{ unterveranstaltung?.veranstaltung.name }}</div>
      <!-- Form -->
      <FormPersonGeneral
        :is-loading="isLoadingCreate"
        :error="errorCreate as Error"
        submit-text="Anmelden"
        is-public-anmeldung
        @submit="(value) => createAnmeldung(undefined, value)"
        @show-terms="showBedingungen = true"
      />
      <PublicFooter />
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
        <span>Es ist ein Fehler aufgetreten</span>
      </template>
    </div>
  </div>
</template>
