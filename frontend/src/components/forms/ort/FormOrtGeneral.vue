import type LoadingVue from '@/components/UIComponents/Loading.vue';
<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ort?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (ort) => {
  return {
    name: ort?.name ?? '',
    address: ort?.address ?? {
      street: undefined,
      number: undefined,
      zip: undefined,
      city: undefined,
    },
  }
}

const ortId = parseInt(props.ort?.id as string)
const ortCopy = ref(fill(props.ort))

const {
  execute: createOrt,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    await apiClient.ort.verwaltungCreate.mutate({
      data: ortCopy.value as unknown as RouterInput['ort']['verwaltungCreate']['data'],
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
    await apiClient.ort.verwaltungPatch.mutate({
      id: ortId,
      data: ortCopy.value as unknown as RouterInput['ort']['verwaltungPatch']['data'],
    })
    props.onUpdate?.()
    router.back()
  },
  null,
  { immediate: false }
)

const { execute: deleteOrt, error: errorDelete } = useAsyncState(
  async () => {
    await apiClient.ort.verwaltungRemove.mutate({ id: ortId })
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
        v-model="ortCopy.name"
        label="Name"
        name="name"
        required
      />
      <div class="grid grid-cols-3 gap-4">
        <BasicInput
          v-model="ortCopy.address.street"
          label="Straße"
          name="street"
          class="col-span-2"
          required
        />
        <BasicInput
          v-model="ortCopy.address.number"
          label="Hausnummer"
          name="number"
          class="col-span-1"
          required
        />
        <BasicInput
          v-model="ortCopy.address.zip"
          label="PLZ"
          name="zip"
          class="col-span-1"
          required
        />
        <BasicInput
          v-model="ortCopy.address.city"
          label="Stadt"
          name="city"
          class="col-span-2"
          required
        />
      </div>
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
