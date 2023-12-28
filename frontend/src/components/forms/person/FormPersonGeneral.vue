<script setup lang="ts">
import { PlusIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import KontaktItem from '@/components/UIComponents/KontaktItem.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import type { RouterInput } from '@codeanker/api'
import type { NahrungsmittelIntoleranzEnum } from '@codeanker/api/src/enumMappings'
import { KonfektionsgroesseMapping, getEnumOptions } from '@codeanker/api/src/enumMappings'
import { EssgewohnheitMapping } from '@codeanker/api/src/enumMappings/Essgewohnheit'
import { GenderMapping } from '@codeanker/api/src/enumMappings/Gender'
import { NahrungsmittelIntoleranzMapping } from '@codeanker/api/src/enumMappings/NahrungsmittelIntoleranz'
import type { TKontaktSchema } from '@codeanker/api/src/services/kontakt/schema/kontakt.schema'
import type { TPersonSchema } from '@codeanker/api/src/services/person/schema/person.schema'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  loading: boolean
  error: Error
  isPublicAnmeldung?: boolean
  submitText?: string
}>()

const emit = defineEmits<{
  (event: 'submit', value: Partial<RouterInput['anmeldung']['publicCreate']['data']>): void
}>()

const person = ref<Partial<TPersonSchema>>({
  firstname: undefined,
  lastname: undefined,
  birthday: undefined,
  gender: undefined,
  email: undefined,
  gliederungId: undefined,
  telefon: undefined,
  address: {
    street: '',
    number: '',
    zip: '',
    city: '',
  },
  essgewohnheit: undefined,
  nahrungsmittelIntoleranzen: undefined,
  weitereIntoleranzen: undefined,
  qualifikationenFahrerlaubnis: undefined,
  qualifikationenSchwimmer: undefined,
  qualifikationenErsteHilfe: undefined,
  qualifikationenSanitaeter: undefined,
  qualifikationenFunk: undefined,
  konfektionsgroesse: undefined,
  erziehungsberechtigtePersonen: [],
  notfallkontaktPersonen: [],
})

const anmeldung = ref<Partial<RouterInput['anmeldung']['publicCreate']['data']>>({
  tshirtBestellt: undefined,
})

const erziehungsberechtigtePerson = ref<Partial<TKontaktSchema>>({
  firstname: undefined,
  lastname: undefined,
  telefon: undefined,
})

const notfallkontaktPersonen = ref<Partial<TKontaktSchema>[]>([])

const notfallkontaktPersonenTemplate = ref<Partial<TKontaktSchema>>({
  firstname: undefined,
  lastname: undefined,
  telefon: undefined,
})

const nahrungsmittelIntoleranzen = ref<Partial<NahrungsmittelIntoleranzEnum>[]>([])

const weitereIntoleranzen = ref<string[]>([])

const acceptTeilnahmebedingungen = ref(props.isPublicAnmeldung ? false : true)
const acceptDatenschutz = ref(props.isPublicAnmeldung ? false : true)

const geschlechtOptions = getEnumOptions(GenderMapping)
const essgewohnheitOptions = getEnumOptions(EssgewohnheitMapping)
const nahrungsmittelIntoleranzOptions = getEnumOptions(NahrungsmittelIntoleranzMapping)
const konfektionsgroesseOptions = getEnumOptions(KonfektionsgroesseMapping)

const toggleOption = (option) => {
  if (nahrungsmittelIntoleranzen.value.includes(option)) {
    nahrungsmittelIntoleranzen.value = nahrungsmittelIntoleranzen.value.filter((item) => item !== option)
  } else {
    nahrungsmittelIntoleranzen.value = [...nahrungsmittelIntoleranzen.value, option]
  }
}

const tempWeitereInteloranzen = ref('')

const emitSubmit = () => {
  let toSubmit = { ...person.value }
  if (props.isPublicAnmeldung) {
    toSubmit = {
      ...toSubmit,
      ...anmeldung.value,
      erziehungsberechtigtePersonen: [erziehungsberechtigtePerson.value as TKontaktSchema],
      notfallkontaktPersonen: [...(notfallkontaktPersonen.value as TKontaktSchema[])],
      nahrungsmittelIntoleranzen:
        nahrungsmittelIntoleranzen.value as RouterInput['anmeldung']['publicCreate']['data']['nahrungsmittelIntoleranzen'],
      weitereIntoleranzen: weitereIntoleranzen.value,
    }
  }
  emit('submit', toSubmit)
}
</script>

<template>
  <ValidateForm @submit="emitSubmit">
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        id="personFirstname"
        v-model="person.firstname"
        label="Vorname"
        placeholder="Vorname eingeben"
        required
      />
      <BasicInput
        id="personLastname"
        v-model="person.lastname"
        label="Nachname"
        placeholder="Nachname eingeben"
        required
      />
      <BasicSelect
        v-model="person.gender"
        required
        label="Geschlecht"
        :options="geschlechtOptions"
      />
      <BasicDatepicker
        v-model="person.birthday"
        required
        label="Geburtsdatum"
        format="dd.MM.yyyy HH:mm"
        placeholder="Geburtsdatum auswählen"
      />
    </div>
    <hr class="my-5" />
    <div
      v-if="person.address"
      class="grid grid-flow-row lg:grid-cols-2 gap-5"
    >
      <div class="col-span-2 flex items-end space-x-5">
        <BasicInput
          v-model="person.address.street"
          label="Straße und Hausnummer"
          placeholder="Straße eingeben"
          class="grow"
          required
        />
        <BasicInput
          v-model="person.address.number"
          placeholder="Hausnummer eingeben"
          required
        />
      </div>
      <BasicInput
        v-model="person.address.zip"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
        required
      />
      <BasicInput
        v-model="person.address.city"
        label="Ort"
        placeholder="Ort eingeben"
        required
      />
    </div>
    <hr class="my-5" />
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="person.email"
        label="E-Mail Adresse"
        placeholder="E-Mail Adresse eingeben"
        required
      />
      <BasicInput
        v-model="person.telefon"
        label="Mobiltelefonnummer"
        placeholder="Mobiltelefonnummer eingeben"
        required
      />
    </div>
    <hr class="my-5" />
    <div class="font-medium mb-5">Erziehungsberechtigte Person</div>
    <KontaktItem
      v-model="erziehungsberechtigtePerson"
      show-notfall-kontakt
    />
    <hr class="my-5" />
    <div class="font-medium mb-5">Notfallkontakte</div>
    <div
      v-for="(_notfallkontaktPerson, index) in notfallkontaktPersonen"
      :key="index"
    >
      <KontaktItem
        v-model="notfallkontaktPersonen[index]"
        show-remove-option
        @remove="notfallkontaktPersonen.splice(index, 1)"
      />
      <hr
        v-if="index < notfallkontaktPersonen.length - 1"
        class="my-5"
      />
    </div>
    <Button
      color="secondary"
      class="mt-5"
      @click="notfallkontaktPersonen.push(notfallkontaktPersonenTemplate)"
      ><PlusIcon class="h-5 mr-2" />Notfallkontakt hinzufügen</Button
    >
    <hr class="my-5" />
    <div class="grid grid-flow-row gap-5">
      <BasicSelect
        v-model="person.essgewohnheit"
        label="Essgewohnheit"
        :options="essgewohnheitOptions"
        required
      />
      <label class="mb-0 font-medium">Nahrungsmittelintoleranzen</label>
      <div class="grid grid-flow-row gap-2">
        <div
          v-for="option in nahrungsmittelIntoleranzOptions"
          :key="option.value"
          class="bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
          :class="{
            'bg-primary-200': nahrungsmittelIntoleranzen?.includes(option.value),
          }"
          @click="toggleOption(option.value)"
        >
          {{ option.label }}
          <CheckIcon
            v-if="nahrungsmittelIntoleranzen?.includes(option.value)"
            class="h-5 text-primary-950"
          />
        </div>
      </div>
      <BasicInput
        v-model="tempWeitereInteloranzen"
        label="Weitere Intoleranzen"
        placeholder="Weitere Intoleranzen eingeben"
      >
        <template #append>
          <div
            class="py-2 px-4 bg-primary-200 rounded-r-lg flex items-center text-primary-800 cursor-pointer hover:bg-primary-300 transition-all"
            @click="
              () => {
                if (!tempWeitereInteloranzen) return
                weitereIntoleranzen?.push(tempWeitereInteloranzen)
                tempWeitereInteloranzen = ''
              }
            "
          >
            <PlusIcon class="h-5 mr-2" /> Hinzufügen
          </div>
        </template>
      </BasicInput>
      <div
        v-if="weitereIntoleranzen?.length !== 0"
        class="flex flex-wrap space-x-2"
      >
        <Badge
          v-for="item in weitereIntoleranzen"
          :key="item"
        >
          {{ item }}
        </Badge>
      </div>
    </div>
    <hr class="my-5" />
    <template v-if="isPublicAnmeldung">
      <div class="font-medium mb-5">T-Shirt Bestellung</div>
      <div class="grid grid-flow-row lg:grid-cols-2 gap-5 items-start">
        <BasicCheckbox
          v-model="anmeldung.tshirtBestellt"
          label="Ich möchte ein T-Shirt bestellen"
          class="mt-1 font-medium"
        />
        <BasicSelect
          v-if="anmeldung.tshirtBestellt"
          v-model="person.konfektionsgroesse"
          label="Konfektionsgröße"
          :options="konfektionsgroesseOptions"
        />
      </div>
      <hr class="my-5" />
      <div class="flex items-start mb-5 space-x-3">
        <BasicCheckbox
          v-model="acceptTeilnahmebedingungen"
          label="Ich habe die allgemeinen Teilnahmebedingungen gelesen und akzeptiere diese."
          class="mt-1 font-medium"
          required
        />
      </div>
      <div class="flex items-start mb-10 space-x-3">
        <BasicCheckbox
          v-model="acceptDatenschutz"
          label="Ich habe die gesonderten Datenschutzerklärung gelesen und akzeptiere diese."
          class="mt-1 font-medium"
          required
        />
      </div>
    </template>
    <div class="flex items-center justify-between">
      <Button
        color="primary"
        class="w-full lg:w-auto justify-center mb-20 items-center space-x-2"
        :disabled="loading || !acceptTeilnahmebedingungen || !acceptDatenschutz"
        type="submit"
      >
        <template v-if="loading">
          <Loading color="white" />
        </template>
        {{ submitText || 'Speichern' }}
      </Button>
      <div class="text-danger-500 text-right">
        <template v-if="error">
          {{ error }}
        </template>
      </div>
    </div>
  </ValidateForm>
</template>
