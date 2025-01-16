<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import type { IStammdaten } from '../anmeldung/Stammdaten.vue'
import Stammdaten from '../anmeldung/Stammdaten.vue'

import type { IContact } from './FormContactGeneral.vue'
import FormContactGeneral from './FormContactGeneral.vue'
import FormEssgewohnheitGeneral, { type IEssgewohnheiten } from './FormEssgewohnheitGeneral.vue'
import FormNotfallkontakteGeneral, { type INotfallKontakte } from './FormNotfallkontakteGeneral.vue'
import type { ITShirtBestellung } from './FormTShirtBestellungGeneral.vue'
import FormTShirtBestellungGeneral from './FormTShirtBestellungGeneral.vue'

import { apiClient } from '@/api'
import BasicAddressPicker, { type IAddress } from '@/components/BasicInputs/BasicAddressPicker.vue'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import type { RouterOutput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

type Gliederung = Awaited<RouterOutput['gliederung']['publicList']>[number]

export interface FormPersonGeneralSubmit {
  stammdaten: IStammdaten
  address: IAddress
  contact: IContact
  notfallKontakte: INotfallKontakte
  essgewohnheiten: IEssgewohnheiten
  tshirt: ITShirtBestellung
  gliederung: Gliederung
  comment: string
}

type Person = Awaited<RouterOutput['person']['verwaltungGet']>

const props = defineProps<{
  isLoading: boolean
  isPublicAnmeldung?: boolean
  person?: Person
  submitText?: string
  error?: Error
  showTshirt?: boolean
}>()

const emit = defineEmits<{
  submit: [data: FormPersonGeneralSubmit]
  showTerms: []
}>()

async function queryGliederungen(searchTerm: string) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    pagination: { take: 100, skip: 0 },
    orderBy: [],
  })
}

const stammdatenForm = ref<IStammdaten>({
  firstname: props.person?.firstname ?? '',
  lastname: props.person?.lastname ?? '',
  birthday: props.person?.birthday ?? null,
  gender: props.person?.gender ?? 'MALE',
})

const addressForm = ref<IAddress>({
  street: props.person?.address?.street ?? '',
  streetNumber: props.person?.address?.streetNumber ?? '',
  zip: props.person?.address?.zip ?? '',
  city: props.person?.address?.city ?? '',
  country: props.person?.address?.country ?? 'DE',
  position: {
    lat: props.person?.address?.lat ?? 0,
    lon: props.person?.address?.lon ?? 0,
  },
})

async function addressFind(params: { query: string; country: string; language: string }) {
  return apiClient.address.findAddress.query({
    query: params.query,
    zip: addressForm.value.zip,
    city: addressForm.value.city,
    street: addressForm.value.street,
    streetNumber: addressForm.value.streetNumber,
    country: addressForm.value.country,
  })
}

const contactForm = ref<IContact>({
  email: props.person?.email ?? '',
  telefon: props.person?.telefon ?? '',
})

const notfallKontakteForm = ref<INotfallKontakte>({
  personen: props.person?.notfallkontakte ?? [],
})

/**
 * Format the notfallKontakte to the correct format
 */
const formatNotfallKontakte = (notfallKontakte: INotfallKontakte) => {
  const personen = notfallKontakte.personen.map((person) => ({
    firstname: person.firstname,
    lastname: person.lastname,
    telefon: person.telefon,
    istErziehungsberechtigt: person.istErziehungsberechtigt ?? false,
  }))
  return { personen }
}

const essgewohnheitenForm = ref<IEssgewohnheiten>({
  essgewohnheit: props.person?.essgewohnheit ?? 'VEGETARISCH',
  intoleranzen: {
    FRUCTOSE: props.person?.nahrungsmittelIntoleranzen.includes('FRUCTOSE') ?? false,
    GLUTEN: props.person?.nahrungsmittelIntoleranzen.includes('GLUTEN') ?? false,
    LAKTOSE: props.person?.nahrungsmittelIntoleranzen.includes('LAKTOSE') ?? false,
    SCHWEIN: props.person?.nahrungsmittelIntoleranzen.includes('SCHWEIN') ?? false,
  },
  weitereIntoleranzen: props.person?.weitereIntoleranzen ?? [],
})

const comment = ref('')

const tshirtForm = ref<ITShirtBestellung>({
  bestellen: false,
  groesse: props.person?.konfektionsgroesse ?? 'JUNIOR_122_128',
})

const gliederung = ref<Gliederung | null>(props.person?.gliederung ?? null)

const acceptTeilnahmebedingungen = ref(false)
const acceptDatenschutz = ref(false)

const submit = () => {
  emit('submit', {
    gliederung: gliederung.value!,
    stammdaten: stammdatenForm.value,
    address: addressForm.value,
    contact: contactForm.value,
    essgewohnheiten: essgewohnheitenForm.value,
    notfallKontakte: formatNotfallKontakte(notfallKontakteForm.value),
    tshirt: tshirtForm.value,
    comment: comment.value,
  })
}
</script>

<template>
  <div class="grid">
    <ValidateForm @submit="submit">
      <Stammdaten v-model="stammdatenForm" />
      <hr class="my-5" />

      <BasicAddressPicker
        label="Adresse"
        country-label="Land"
        city-label="Ort"
        zip-label="Postleitzahl"
        street-label="Straße"
        house-number-label="Hausnummer"
        autocomplete-label="Intelligente Suche"
        manual-entry-label="Manuell eingeben"
        :address-find="addressFind"
        :country-formatter="(country) => country.name"
        :country="addressForm.country"
        :ort="addressForm.city"
        :plz="addressForm.zip"
        :strasse="addressForm.street"
        :hausnummer="addressForm.streetNumber"
        :is-valid-address="addressForm.valid"
        :validation="true"
        required
        :include-non-independent-countries="true"
        :street="addressForm.street"
        :street-number="addressForm.streetNumber"
        :zip="addressForm.zip"
        :city="addressForm.city"
        :position="addressForm.position"
        @update:country="addressForm['country'] = $event ?? ''"
        @update:city="addressForm['city'] = $event ?? ''"
        @update:zip="addressForm['zip'] = $event ?? ''"
        @update:street="addressForm['street'] = $event ?? ''"
        @update:street-number="addressForm['streetNumber'] = $event ?? ''"
        @update:position="addressForm['position'] = $event"
        @update:is-valid-address="addressForm['valid'] = $event"
      />
      <hr class="my-5" />

      <FormContactGeneral v-model="contactForm" />
      <hr class="my-5" />

      <template v-if="!isPublicAnmeldung">
        <BasicTypeahead
          v-model="gliederung"
          :query="queryGliederungen"
          :input-formatter="(result) => result?.name"
          :result-formatter="(result) => result.name"
          :strict="true"
          required
          label="Gliederung"
          placeholder="Gliederung eingeben"
        />
        <hr class="my-5" />
      </template>

      <FormNotfallkontakteGeneral v-model="notfallKontakteForm" />
      <hr class="my-5" />

      <FormEssgewohnheitGeneral v-model="essgewohnheitenForm" />
      <hr class="my-5" />

      <template v-if="isPublicAnmeldung">
        <BasicTextArea
          v-model="comment"
          label="Bemerkung"
          :rows="3"
        />
        <hr class="my-5" />
      </template>

      <slot />

      <template v-if="isPublicAnmeldung">
        <template v-if="showTshirt">
          <FormTShirtBestellungGeneral v-model="tshirtForm" />
          <hr class="my-5" />
        </template>

        <BasicCheckbox
          v-model="acceptTeilnahmebedingungen"
          class="mt-1 font-medium"
          required
        >
          <span>Ich habe die allgemeinen </span>
          <u
            class="cursor-pointer"
            @click="emit('showTerms')"
          >
            <span>Teilnahmebedingungen</span>
            <ArrowTopRightOnSquareIcon class="h-4 inline ml-1" />
          </u>
          <span> gelesen und akzeptiere diese.</span>
        </BasicCheckbox>
        <BasicCheckbox
          v-model="acceptDatenschutz"
          class="mt-1 font-medium"
          required
        >
          <span>Ich habe die gesonderten </span>
          <u
            class="cursor-pointer"
            @click="emit('showTerms')"
          >
            <span>Datenschutzerklärung</span>
            <ArrowTopRightOnSquareIcon class="h-4 inline ml-1" />
          </u>
          <span> gelesen und akzeptiere diese.</span>
        </BasicCheckbox>
      </template>

      <Button
        color="primary"
        class="w-full justify-center mt-5 mb-20 disabled:bg-gray-300"
        :disabled="isPublicAnmeldung && (!acceptTeilnahmebedingungen || !acceptDatenschutz)"
        type="submit"
      >
        <template v-if="isLoading">
          <Loading color="white" />
        </template>
        <span>
          {{ submitText ?? 'Speichern' }}
        </span>
      </Button>

      <template v-if="error && error.message">
        <pre><code>
        {{ error.message }}
      </code></pre>
      </template>
    </ValidateForm>
  </div>
</template>
