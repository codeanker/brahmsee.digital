<script setup lang="ts">
import { CheckIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import type { IAddress } from '../anmeldung/Address.vue'
import Address from '../anmeldung/Address.vue'
import type { IStammdaten } from '../anmeldung/Stammdaten.vue'
import Stammdaten from '../anmeldung/Stammdaten.vue'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import KontaktItem from '@/components/UIComponents/KontaktItem.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import type { NahrungsmittelIntoleranzEnum } from '@codeanker/api/src/enumMappings'
import { KonfektionsgroesseMapping, getEnumOptions } from '@codeanker/api/src/enumMappings'
import { EssgewohnheitMapping } from '@codeanker/api/src/enumMappings/Essgewohnheit'
import { NahrungsmittelIntoleranzMapping } from '@codeanker/api/src/enumMappings/NahrungsmittelIntoleranz'
import type { TKontaktSchema } from '@codeanker/api/src/services/kontakt/schema/kontakt.schema'
import { ValidateForm } from '@codeanker/validation'

type Person = Awaited<RouterOutput['person']['verwaltungGet']>

const props = defineProps<{
  person?: Person
  isPublicAnmeldung?: boolean
  onUpdate?: () => void
}>()

const edit = computed(() => props.person !== undefined)

async function queryGliederungen(searchTerm: string) {
  return apiClient.gliederung.verwaltungList.query({ filter: { name: searchTerm }, pagination: { take: 100, skip: 0 } })
}

const stammdatenForm = ref<IStammdaten>({
  firstname: props.person?.firstname,
  lastname: props.person?.lastname,
  birthday: props.person?.birthday,
  gender: props.person?.gender ?? undefined,
})

const addressForm = ref<IAddress>({
  street: props.person?.address?.street,
  number: props.person?.address?.number,
  zip: props.person?.address?.zip,
  city: props.person?.address?.city,
})

const data = ref({
  ...props.person,
  essgewohnheit: props.person?.essgewohnheit ?? undefined,
  konfektionsgroesse: props.person?.konfektionsgroesse ?? undefined,
})
const gliederung = ref(props.person?.gliederung)

const anmeldung = ref<Partial<RouterInput['anmeldung']['publicCreate']['data']>>({
  tshirtBestellt: undefined,
})

/* const erziehungsberechtigtePerson = ref<TKontaktSchema>({
  firstname: '',
  lastname: '',
  telefon: '',
}) */

const notfallkontaktPersonen = ref<TKontaktSchema[]>([])

const notfallkontaktPersonenTemplate = ref<TKontaktSchema>({
  firstname: '',
  lastname: '',
  telefon: '',
})

const nahrungsmittelIntoleranzen = ref<Partial<NahrungsmittelIntoleranzEnum>[]>([])

const weitereIntoleranzen = ref<string[]>([])

const acceptTeilnahmebedingungen = ref(props.isPublicAnmeldung ? false : true)
const acceptDatenschutz = ref(props.isPublicAnmeldung ? false : true)

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

const { execute, isLoading } = useAsyncState(
  async () => {
    let endpoint
    if (edit.value) {
      endpoint = apiClient.person.verwaltungPatch
    } else {
      endpoint = apiClient.person.verwaltungCreate
    }

    const payload = {
      id: data.value.id,
      data: {
        ...stammdatenForm.value,
        address: {
          ...addressForm.value,
        },
        gliederungId: gliederung.value!.id,
        telefon: '123',
        notfallkontaktPersonen: notfallkontaktPersonen.value,
        essgewohnheit: data.value.essgewohnheit,
        konfektionsgroesse: 'XL',
        nahrungsmittelIntoleranzen: nahrungsmittelIntoleranzen.value,
      },
    }
    if (!edit.value) {
      delete payload.id
    }
    await endpoint.mutate(payload)

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)
</script>

<template>
  <ValidateForm @submit="execute">
    <Stammdaten v-model="stammdatenForm" />
    <hr class="my-5" />
    <Address v-model="addressForm"></Address>
    <hr class="my-5" />

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

    <!-- <div class="font-medium mb-5">Erziehungsberechtigte Person</div>
    <KontaktItem
      v-model="erziehungsberechtigtePerson"
      show-notfall-kontakt
    /> -->

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
        v-model="data.essgewohnheit"
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
          v-model="data.konfektionsgroesse"
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
        :disabled="isLoading || !acceptTeilnahmebedingungen || !acceptDatenschutz"
        type="submit"
      >
        <template v-if="isLoading">
          <Loading color="white" />
        </template>
        <span>Speichern</span>
      </Button>
    </div>
  </ValidateForm>
  <!-- <div v-if="error">{{ error }}</div> -->
</template>
