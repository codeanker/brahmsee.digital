<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, ChevronLeftIcon, FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicRadio from '@/components/BasicInputs/BasicRadio.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
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
    entity: 'ausschreibung',
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
              <BasicInput
                v-if="field.type === 'BasicInput'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />
              <BasicTextArea
                v-if="field.type === 'BasicTextArea'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />
              <BasicEditor
                v-if="field.type === 'BasicEditor'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />
              <BasicSwitch
                v-if="field.type === 'BasicSwitch'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />
              <BasicCheckbox
                v-if="field.type === 'BasicCheckbox'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />
              <BasicInputNumber
                v-if="field.type === 'BasicInputNumber'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
              />

              <BasicRadio
                v-if="field.type === 'BasicRadio'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
                :options="field.options.map((o) => ({ label: o, value: o }))"
              />
              <BasicSelect
                v-if="field.type === 'BasicSelect'"
                v-model="customFieldValues[field.id]"
                :label="field.name"
                :required="field.required"
                :options="field.options.map((o) => ({ label: o, value: o }))"
              />
              <BasicDropdown
                v-if="field.type === 'BasicDropdown'"
                :label="field.name"
                :required="field.required"
                :right="false"
                :append="true"
                class="w-full"
                button-style="w-full text-left"
              >
                <template #buttonContent>
                  <button
                    type="button"
                    class="input-style w-full text-left flex justify-between items-center"
                  >
                    <slot>
                      <div class="flex space-x-2 items-center">
                        <span>{{ customFieldValues[field.id] ?? 'Bitte auswählen…' }}</span>
                      </div>
                    </slot>
                    <ChevronDownIcon class="h-5 text-gray-500" />
                  </button>
                </template>
                <template #dropdownContent>
                  <MenuItem as="div">
                    <button
                      v-for="status in field.options"
                      :key="status"
                      type="button"
                      class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
                      @click="customFieldValues[field.id] = status"
                    >
                      <span>{{ status }}</span>
                    </button>
                  </MenuItem>
                </template>
              </BasicDropdown>

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
