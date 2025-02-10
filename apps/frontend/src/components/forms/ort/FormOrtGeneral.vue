import type LoadingVue from '@/components/UIComponents/Loading.vue';
<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'

import { apiClient } from '@/api'
import type { IAddress } from '@/components/BasicInputs/BasicAddressPicker.vue'
import BasicAddressPicker from '@/components/BasicInputs/BasicAddressPicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { RouterOutput } from '@codeanker/api'

type Ort = RouterOutput['ort']['verwaltungGet']

const props = defineProps<{
  ort?: Ort
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const nameForm = ref(props.ort?.name ?? '')

const addressForm = ref<IAddress>({
  street: props.ort?.address?.street ?? '',
  streetNumber: props.ort?.address?.streetNumber ?? '',
  zip: props.ort?.address?.zip ?? '',
  city: props.ort?.address?.city ?? '',
  country: props.ort?.address?.country ?? 'DE',
  position: {
    lat: props.ort?.address?.lat ?? 0,
    lon: props.ort?.address?.lon ?? 0,
  },
})

watch(addressForm, (addressForm) => {
  if (nameForm.value.trim().length === 0) {
    nameForm.value = `${addressForm.street} ${addressForm.streetNumber}`
  }
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

const {
  execute: createOrt,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    await apiClient.ort.verwaltungCreate.mutate({
      data: {
        name: nameForm.value,
        address: addressForm.value,
      },
    })
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateOrt,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    if (!props.ort) {
      return
    }

    await apiClient.ort.verwaltungPatch.mutate({
      id: props.ort.id,
      data: {
        name: nameForm.value,
        address: addressForm.value,
      },
    })
    props.onUpdate?.()
    router.back()
  },
  null,
  { immediate: false }
)

const { execute: deleteOrt, error: errorDelete } = useAsyncState(
  async () => {
    if (!props.ort) {
      return
    }
    await apiClient.ort.verwaltungRemove.mutate({
      id: props.ort.id,
    })
    router.push({ name: 'Verwaltung Alle Orte' })
  },
  null,
  { immediate: false }
)

const handle = async (event: Event) => {
  event.preventDefault()
  switch (props.mode) {
    case 'create':
      await createOrt()
      break
    case 'update':
      await updateOrt()
      break
  }
}
</script>

<template>
  <form @submit="handle">
    <div class="space-y-4">
      <BasicInput
        v-model="nameForm"
        label="Name"
        name="name"
        required
      />

      <BasicAddressPicker
        label="Adresse"
        country-label="Land"
        city-label="Ort"
        zip-label="Postleitzahl"
        street-label="Straße"
        house-number-label="Hausnummer"
        autocomplete-label="Intelligente Suche"
        manual-entry-label="Adresse nicht gefunden? Manuell eingeben"
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
    </div>

    <div class="mt-4 flex gap-4 items-center">
      <Button
        type="submit"
        color="primary"
        @click="handle"
      >
        <span v-if="!isLoadingCreate && !isLoadingUpdate">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
      <Button
        v-if="props.ort"
        type="button"
        color="danger"
        @click="deleteOrt"
      >
        Ort löschen
      </Button>
    </div>

    <div class="mt-8">
      <div
        v-if="errorCreate"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ errorCreate }}
      </div>
      <div
        v-if="errorDelete"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ errorDelete }}
      </div>
    </div>
  </form>
</template>
