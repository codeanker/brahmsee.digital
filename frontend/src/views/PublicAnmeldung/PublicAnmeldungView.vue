<script setup lang="ts">
import { ChevronLeftIcon, PlusSmallIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import KontaktItem from '@/components/UIComponents/KontaktItem.vue'
import type { RouterInput } from '@codeanker/api'
import { GenderMapping } from '@codeanker/api/src/enumMappings/'
import { EssgewohnheitMapping } from '@codeanker/api/src/enumMappings/Essgewohnheit'
import { getEnumOptions } from '@codeanker/api/src/enumMappings/getEnumOptions'
import { KonfektionsgroesseMapping } from '@codeanker/api/src/enumMappings/Konfektionsgroesse'
import { NahrungsmittelIntoleranzMapping } from '@codeanker/api/src/enumMappings/NahrungsmittelIntoleranz'
import type { TKontaktSchema } from '@codeanker/api/src/services/kontakt/schema/kontakt.schema'

const router = useRouter()
const route = useRoute()

const anmeldung = ref<Partial<RouterInput['anmeldung']['publicCreate']['data']>>({
  unterveranstaltungId: Number(route.params.ausschreibungId),
  firstname: undefined,
  lastname: undefined,
  birthday: undefined,
  gender: undefined,
  email: undefined,
  telefon: undefined,
  addresse: {
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
  tshirtBestellt: undefined,
})

const erziehungsberechtigtePerson = ref<Partial<TKontaktSchema>>({
  firstname: undefined,
  lastname: undefined,
  telefon: undefined,
  isNotfallKontakt: false,
})

const notfallkontaktPersonen = ref<Partial<TKontaktSchema>[]>([])

const notfallkontaktPersonenTemplate = ref<Partial<TKontaktSchema>>({
  firstname: undefined,
  lastname: undefined,
  telefon: undefined,
  isNotfallKontakt: true,
})

const nahrungsmittelIntoleranzen = ref<
  Partial<RouterInput['anmeldung']['publicCreate']['data']['nahrungsmittelIntoleranzen']>
>([])

const weitereIntoleranzen = ref<RouterInput['anmeldung']['publicCreate']['data']['weitereIntoleranzen']>([])

const acceptTeilnahmebedingungen = ref(false)
const acceptDatenschutz = ref(false)

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
</script>

<template>
  <div
    v-if="anmeldung"
    class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40"
  >
    <!-- Header -->
    <PublicHeader />
    <Button
      class="mb-10"
      color="secondary"
      @click="router.back()"
      ><ChevronLeftIcon class="h-5 mr-2" />Zurück zur Aussschreibung</Button
    >
    <div class="text-3xl font-medium">Anmeldung</div>
    <div class="mb-5">Zum Landeskindertreffen am Brahmsee 2023</div>
    <!-- Form -->
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="anmeldung.firstname"
        label="Vorname"
        placeholder="Vornamen eingeben"
      />
      <BasicInput
        v-model="anmeldung.lastname"
        label="Nachname"
        placeholder="Nachname eingeben"
      />
      <BasicSelect
        v-model="anmeldung.gender"
        label="Geschlecht"
        :options="geschlechtOptions"
      />
      <BasicDatepicker
        v-model="anmeldung.birthday"
        label="Geburtsdatum"
        placeholder="Geburtsdatum auswählen"
      />
    </div>
    <hr class="my-5" />
    <div
      v-if="anmeldung.addresse"
      class="grid grid-flow-row lg:grid-cols-2 gap-5"
    >
      <div class="col-span-2 flex items-end space-x-5">
        <BasicInput
          v-model="anmeldung.addresse.street"
          label="Straße und Hausnummer"
          placeholder="Straße eingeben"
          class="grow"
        />
        <BasicInput
          v-model="anmeldung.addresse.number"
          placeholder="Hausnummer eingeben"
        />
      </div>
      <BasicInput
        v-model="anmeldung.addresse.zip"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
      />
      <BasicInput
        v-model="anmeldung.addresse.city"
        label="Ort"
        placeholder="Ort eingeben"
      />
    </div>
    <hr class="my-5" />
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="anmeldung.email"
        label="E-Mail Adresse"
        placeholder="E-Mail Adresse eingeben"
      />
      <BasicInput
        v-model="anmeldung.telefon"
        label="Mobiltelefonnummer"
        placeholder="Mobiltelefonnummer eingeben"
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
      ><PlusSmallIcon class="h-5 mr-2" />Notfallkontakt hinzufügen</Button
    >
    <hr class="my-5" />
    <div class="grid grid-flow-row gap-5">
      <BasicSelect
        v-model="anmeldung.essgewohnheit"
        label="Essgewohnheit"
        :options="essgewohnheitOptions"
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
            <PlusSmallIcon class="h-5 mr-2" /> Hinzufügen
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
    <div class="font-medium mb-5">T-Shirt Bestellung</div>
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5 items-start">
      <BasicCheckbox
        v-model="anmeldung.tshirtBestellt"
        label="Ich möchte ein T-Shirt bestellen"
        class="mt-1 font-medium"
      />
      <BasicSelect
        v-if="anmeldung.tshirtBestellt"
        v-model="anmeldung.konfektionsgroesse"
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
      />
    </div>
    <div class="flex items-start mb-10 space-x-3">
      <BasicCheckbox
        v-model="acceptDatenschutz"
        label="Ich habe die gesonderten Datenschutzerklärung gelesen und akzeptiere diese."
        class="mt-1 font-medium"
      />
    </div>
    <Button
      color="primary"
      class="w-full lg:w-auto justify-center mb-20"
      >Anmelden</Button
    >
    <PublicFooter />
  </div>
</template>
