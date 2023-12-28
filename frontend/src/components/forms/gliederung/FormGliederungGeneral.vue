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
  gliederung?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (gliederung) => {
  return {
    name: gliederung?.name,
    edv: gliederung?.edv,
  }
}

const gliederungId = parseInt(props.gliederung?.id as string)
const gliederungCopy = ref(fill(props.gliederung))

const {
  execute: createGliederung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.gliederung.verwaltungCreate.mutate({
      data: gliederungCopy.value as unknown as RouterInput['gliederung']['verwaltungCreate']['data'],
    })
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateGliederung,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.gliederung.verwaltungPatch.mutate({
      id: gliederungId,
      data: gliederungCopy.value as unknown as RouterInput['gliederung']['verwaltungPatch']['data'],
    })

    props.onUpdate?.()
    router.back()
  },
  null,
  { immediate: false }
)

const handle = async (event: Event) => {
  event.preventDefault()
  switch (props.mode) {
    case 'create':
      await createGliederung()
      break
    case 'update':
      await updateGliederung()
      break
  }
}
</script>

<template>
  <form @submit="handle">
    <div class="grid grid-cols-1 sm:grid-cols-6 gap-6">
      <div class="sm:col-span-3">
        <BasicInput
          v-model="gliederungCopy.name"
          label="Name"
          name="name"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicInput
          v-model="gliederungCopy.edv"
          label="EDV"
          name="edv"
          required
        />
      </div>
    </div>

    <div class="mt-8 flex gap-4">
      <Button
        type="submit"
        color="primary"
        @click="handle"
      >
        <span v-if="!isLoadingCreate && !isLoadingUpdate">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
    </div>

    <div
      v-if="errorCreate"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
    >
      {{ errorCreate }}
    </div>
  </form>
</template>
