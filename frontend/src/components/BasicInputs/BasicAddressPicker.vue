<script setup lang="ts">
import { ref, watch } from 'vue'

// import HintIcon from '../UIComponents/HintIcon.vue'
// import HintModal from '../UIComponents/HintModal.vue'

import BasicInputText from './BasicInput.vue'
import BasicInputTypeahead from './BasicTypeahead.vue'

import { Countries } from '@codeanker/interfaces/enums'

export type IAddress = {
  street: string
  streetNumber: string
  zip: string
  city: string
  country?: string
  position?: IPosition | undefined
  valid?: boolean
}

export type IPosition = {
  lat: number
  lon: number
}

type Country = (typeof Countries)[keyof typeof Countries]

const props = defineProps<{
  countryLabel?: string
  cityLabel?: string
  zipLabel?: string
  streetLabel?: string
  houseNumberLabel?: string
  autocompleteLabel?: string
  manualEntryLabel?: string
  countryFormatter: (country: Country) => string
  addressFind: (params: { query: string; country: string; language: string }) => Promise<IAddress[]>
  requireCountry?: boolean
  allowZusatz?: boolean
  country: string | undefined
  zip: string | undefined
  city: string | undefined
  street: string | undefined
  streetNumber: string | undefined
  position: object | undefined
  zusatz?: string | undefined
  validation?: boolean
  required?: boolean
  includeNonIndependentCountries?: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:country': [string | undefined]
  'update:zip': [string | undefined]
  'update:city': [string | undefined]
  'update:street': [string | undefined]
  'update:streetNumber': [string | undefined]
  'update:position': [
    | {
        lat: number
        lon: number
      }
    | undefined,
  ]
  'update:zusatz': [string | undefined]
  'update:is-valid-address': [boolean]
}>()

const countries = ref()
const smartLandInput = ref<{ label: string; value: string }>()
const smartAddressInput = ref()
const manualEntry = ref(false)
const valid = ref({
  country: false,
})
//This is needed to do the search on field focus
const smartResults = ref<
  {
    label: string
    value: string
    address: IAddress
  }[]
>([])

fetchCountries()

function fetchCountries() {
  countries.value = Object.values(Countries)
  if (!props.includeNonIndependentCountries) {
    countries.value = countries.value.filter((country) => country.independent)
  }
  if (props.country) {
    valid.value.country = true
    smartLandInput.value = {
      label: countries.value.find((country) => country.ISO === props.country).nameDE,
      value: props.country,
    }
  } else {
    emit('update:country', 'DE')
    smartLandInput.value = { label: 'Deutschland', value: 'DE' }
    valid.value.country = true
  }
}

watch(
  [
    () => props.country,
    () => props.zip,
    () => props.city,
    () => props.street,
    () => props.streetNumber,
    () => props.position,
    () => props.zusatz,
  ],
  () => {
    let address = {
      street: props.street,
      streetNumber: props.streetNumber,
      zip: props.zip,
      city: props.city,
      country: props.country,
      position: props.position,
      zusatz: props.zusatz,
    }
    if (address.streetNumber && address.zip && address.city && address.street) {
      smartAddressInput.value = {
        label: `${address.street}${address.streetNumber ? ' ' + address.streetNumber : ''}, ${address.zip} ${address.city}`,
        value: address.zip,
        address: address,
      }
    } else {
      smartAddressInput.value = undefined
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => smartAddressInput.value,
  () => {
    setAddress(smartAddressInput.value?.address)
  }
)

watch(
  () => smartLandInput.value,
  () => {
    setLand(smartLandInput.value)
  }
)

function handleLandTypeahead(input) {
  const countryOptions = countries.value.map((country) => {
    return {
      label: props.countryFormatter(country),
      value: country.ISO,
    }
  })
  if (!input) {
    return countryOptions
  } else {
    return countryOptions.filter((country) => country.label.toLowerCase().includes(input.toLowerCase()))
  }
}

function setLand(country) {
  if (!country) {
    emit('update:country', undefined)
    valid.value.country = false
    return
  }
  emit('update:country', country.value)
  valid.value.country = true
}

function setAddress(address) {
  if (!address) {
    emit('update:city', undefined)
    emit('update:zip', undefined)
    emit('update:street', undefined)
    emit('update:position', undefined)
    emit('update:streetNumber', undefined)
    emit('update:is-valid-address', false)
    return
  }
  if (
    address.city === props.city &&
    address.zip === props.zip &&
    address.street === props.street &&
    address.streetNumber === props.streetNumber
  ) {
    return
  }
  emit('update:city', address.city)
  emit('update:zip', address.zip)
  emit('update:street', address.street)
  emit('update:position', address.position)

  if (address.streetNumber) {
    emit('update:streetNumber', address.streetNumber)
    //Timeout because race condition
    setTimeout(() => {
      emit('update:is-valid-address', true)
    })
  }
}

async function handleAddressTypeahead(input) {
  if (!props.country) return { data: smartResults.value }
  if (input.length < 3) return { data: [] }
  const result = await props.addressFind({
    country: props.country,
    query: input,
    language: navigator.language,
  })
  smartResults.value = result.map((entry) => ({
    label: `${entry.street}${entry.streetNumber ? ' ' + entry.streetNumber : ''}, ${entry.zip} ${entry.city}`,
    value: entry.zip,
    address: entry,
  }))
  return smartResults.value
}

function addressChange() {
  valid.value.country = false
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        v-if="requireCountry"
        class="col-span-2"
      >
        <!--
    result-formatter: Whats in the list
    input-formatter: Whats in the field
    serializer: what to save
    -->
        <BasicInputTypeahead
          id="country"
          v-model="smartLandInput"
          :result-formatter="(input) => input?.label"
          :input-formatter="(input) => input?.label"
          :serializer="(input) => input.value"
          :query="handleLandTypeahead"
          :label="countryLabel"
          :placeholder="countryLabel"
          :required="required"
          @hit="setLand"
          @change="addressChange"
        />
      </div>
      <template v-if="validation && !manualEntry">
        <div class="col-span-2">
          <BasicInputTypeahead
            id="smartAddressInput"
            v-model="smartAddressInput"
            :result-formatter="(input) => `${input.label}`"
            :input-formatter="(input) => input?.label"
            :query="handleAddressTypeahead"
            :label="label"
            :required="required"
            :placeholder="label"
            :disabled="!country && requireCountry"
            strict
          >
            <!-- <template #label>
              <HintModal
                v-if="hintModal"
                :hint="hintModal"
              ></HintModal>
              <HintIcon
                v-if="hint"
                :hint="hint"
              ></HintIcon>
            </template> -->
          </BasicInputTypeahead>
        </div>
      </template>
      <template v-else>
        <div class="col-span-1">
          <BasicInputText
            id="zip"
            :model-value="zip"
            :label="zipLabel"
            :required="required"
            :placeholder="zipLabel"
            :disabled="!valid.country"
            @update:model-value="(value) => emit('update:zip', value)"
          />
        </div>
        <div class="col-span-1">
          <BasicInputText
            id="city"
            :model-value="city"
            :label="cityLabel"
            :required="required"
            :placeholder="cityLabel"
            :disabled="!valid.country"
            @update:model-value="(value) => emit('update:city', value)"
          />
        </div>
        <div class="col-span-1">
          <BasicInputText
            id="street"
            :model-value="street"
            :label="streetLabel"
            :required="required"
            :placeholder="streetLabel"
            :disabled="!valid.country"
            @update:model-value="(value) => emit('update:street', value)"
          />
        </div>
        <div class="col-span-1">
          <BasicInputText
            id="streetNumber"
            :model-value="streetNumber"
            :label="houseNumberLabel"
            :required="required"
            :placeholder="houseNumberLabel"
            :disabled="!valid.country"
            @update:model-value="(value) => emit('update:streetNumber', value)"
          />
        </div>
      </template>
    </div>

    <BasicInputText
      v-if="allowZusatz"
      id="zusatz"
      class="col-span-2 mt-2"
      :model-value="zusatz"
      label="Adresszusatz"
      placeholder="Zusatz (z.B. c/o Name, Etage, etc.)"
      @update:model-value="(value) => emit('update:zusatz', value)"
    />
    <template v-if="validation">
      <button
        class="text-primary-600 mt-2 px-0 transition-all hover:px-3"
        type="button"
        @click="manualEntry = !manualEntry"
      >
        {{ manualEntry ? autocompleteLabel : manualEntryLabel }}
      </button>
    </template>
  </div>
</template>
