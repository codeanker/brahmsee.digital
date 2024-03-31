<script setup lang="ts">
import { ChevronLeftIcon, FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import CustomField from '@/components/CustomFields/CustomField.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { type NahrungsmittelIntoleranz } from '@codeanker/api'

const router = useRouter()
const route = useRoute()

const unterveranstaltungId = computed(() => parseInt(route.params.ausschreibungId as string))

const { state: unterveranstaltung, isLoading } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: unterveranstaltungId.value })
}, undefined)

const { state: customFields } = useAsyncState(async () => {
  if (!unterveranstaltung) {
    return undefined
  }

  return apiClient.customFields.list.query({
    entity: 'unterveranstaltung',
    entityId: unterveranstaltungId.value,
  })
}, undefined)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customFieldValues = ref<Record<number, any>>({})

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
      customFieldValues: Object.entries(customFieldValues.value).map((entry) => ({
        fieldId: parseInt(entry[0]),
        value: entry[1],
      })),
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
        v-html="unterveranstaltung?.bedingungen"
      />
      <div
        class="prose prose-neutra"
        v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
      />
      <hr class="my-10" />
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
        :show-tshirt="unterveranstaltung?.veranstaltung?.hostname?.hostname !== 'landes.digital'"
        @submit="(value) => createAnmeldung(undefined, value)"
        @show-terms="showBedingungen = true"
      >
        <div
          v-if="(customFields?.length ?? 0) > 0"
          class="grid grid-cols-2"
        >
          <template
            v-for="field in customFields"
            :key="field.id"
          >
            <div class="flex flex-col gap-y-2">
              <!-- @ToDo in Komponente auslagern-->
              <CustomField
                v-model="customFieldValues[field.id]"
                :field="field"
              />

              <p class="text-sm text-gray-500">{{ field.description }}</p>
            </div>
          </template>
        </div>
        <hr
          v-if="(customFields?.length ?? 0) > 0"
          class="my-5"
        />
      </FormPersonGeneral>
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
