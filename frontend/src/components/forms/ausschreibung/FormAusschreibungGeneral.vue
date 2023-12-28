<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ausschreibung?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (ausschreibung) => {
  return {
    beschreibung: ausschreibung?.beschreibung,
    maxTeilnehmende: ausschreibung?.maxTeilnehmende,
    meldebeginn: ausschreibung?.meldebeginn,
    meldeschluss: ausschreibung?.meldeschluss,
    teilnahmegebuehr: ausschreibung?.teilnahmegebuehr,
  }
}

const ausschreibungId = parseInt(props.ausschreibung?.id as string)
const ausschreibungCopy = ref(fill(props.ausschreibung))
const veranstaltung = props.ausschreibung?.veranstaltung

const {
  execute: createAusschreibung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.unterveranstaltung.gliederungCreate.mutate({
      data: ausschreibungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungCreate']['data'],
    })
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateAusschreibung,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.unterveranstaltung.gliederungPatch.mutate({
      id: ausschreibungId,
      data: ausschreibungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungPatch']['data'],
    })

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)

const handle = async () => {
  switch (props.mode) {
    case 'create':
      await createAusschreibung()
      break
    case 'update':
      await updateAusschreibung()
      break
  }
}
</script>

<template>
  <pre>{{ ausschreibungCopy }}</pre>
  <pre>{{ veranstaltung }}</pre>
  <h5>Ausschreibung: {{ veranstaltung?.name }}</h5>
  <ValidateForm
    class="mt-10"
    @submit="handle"
  >
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div class="lg:col-span-full">
        <BasicEditor
          v-model="ausschreibungCopy.beschreibung"
          required
          label="Ausschreibung"
        />
      </div>
    </div>
    <div class="mt-8 flex gap-4">
      <Button
        type="submit"
        color="primary"
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
  </ValidateForm>
</template>
