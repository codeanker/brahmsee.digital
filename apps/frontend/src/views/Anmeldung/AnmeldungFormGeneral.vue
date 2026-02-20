<script setup lang="ts">
import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { apiClient } from '@/api'
import CustomField from '@/components/CustomFields/CustomField.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { type NahrungsmittelIntoleranz } from '@codeanker/api'

const props = withDefaults(
  defineProps<{
    isPublic: boolean
    token?: string
  }>(),
  {
    isPublic: true,
  }
)
const router = useRouter()

const unterveranstaltung = injectUnterveranstaltung()

const { state: customFields, execute: loadCustomFields } = useAsyncState(async () => {
  if (!unterveranstaltung) {
    return undefined
  }
  // TODO: Nur Felder für die Position anzeigen
  return apiClient.customFields.list.query({
    entity: 'unterveranstaltung',
    entityId: unterveranstaltung.value.id,
    position: 'PUBLIC_ANMELDUNG',
  })
}, [])

// load custom fields when the unterveranstaltung has been injected
watch(unterveranstaltung, () => loadCustomFields())

const customFieldValues = ref<Record<number, any>>({})

const showBedingungen = ref(false)

const {
  execute: createAnmeldung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    if (!unterveranstaltung?.value) {
      return
    }

    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)

    await apiClient.anmeldung.publicCreate.mutate({
      token: props.token,
      data: {
        unterveranstaltungId: unterveranstaltung.value.id,
        gliederungId: unterveranstaltung.value.gliederung.id ?? -1,

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

        comment: anmeldung.comment,
      },
      customFieldValues: Object.entries(customFieldValues.value).map((entry) => ({
        fieldId: entry[0],
        value: entry[1],
      })),
    })

    if (props.isPublic) {
      router.push('/ausschreibung/' + unterveranstaltung?.value.id + '/anmeldung/result')
    } else {
      router.back()
    }
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
    <template #content>
      <div class="container mx-auto">
        <div class="text-lg font-semibold">Teilnahmebedingungen</div>
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.bedingungen"
        />
        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.teilnahmeBedingungenPublic"
        />
        <hr class="my-10" />
        <div class="text-lg font-semibold mt-10">Datenschutz</div>

        <div
          class="prose dark:prose-invert"
          v-html="unterveranstaltung?.veranstaltung?.datenschutz"
        />
      </div>
    </template>
  </Drawer>

  <div
    class="lg:py-10 flex flex-col h-full grow"
    :class="{ 'lg:px-20': props.isPublic }"
  >
    <div
      v-if="unterveranstaltung"
      class="grow"
    >
      <FormPersonGeneral
        :is-loading="isLoadingCreate"
        :error="errorCreate as Error"
        submit-text="Anmeldung abschicken"
        :is-public-anmeldung="props.isPublic"
        @submit="(value) => createAnmeldung(undefined, value)"
        @show-terms="showBedingungen = true"
      >
        <div
          v-if="(customFields?.length ?? 0) > 0"
          class="grid grid-flow-row gap-5"
        >
          <template
            v-for="field in customFields"
            :key="field.id"
          >
            <div class="flex flex-col gap-y-2">
              <CustomField
                v-model="customFieldValues[field.id]"
                :field="field"
              />

              <p class="text-sm text-gray-500">
                {{ field.description }}
              </p>
            </div>
          </template>
        </div>
        <hr
          v-if="(customFields?.length ?? 0) > 0"
          class="my-5"
        />
      </FormPersonGeneral>
    </div>
    <div
      v-else
      class="grow flex flex-col items-center justify-center font-semibold"
    >
      <FaceFrownIcon class="w-20 h-20 text-primary-500 mb-5" />
      <span>Es ist ein Fehler aufgetreten</span>
    </div>
  </div>
</template>
