<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unterveranstaltung?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (unterveranstaltung) => {
  return {
    beschreibung: unterveranstaltung?.beschreibung,
    maxTeilnehmende: unterveranstaltung?.maxTeilnehmende,
    meldebeginn: unterveranstaltung?.meldebeginn,
    meldeschluss: unterveranstaltung?.meldeschluss,
    teilnahmegebuehr: unterveranstaltung?.teilnahmegebuehr,
  }
}

const unterveranstaltungId = parseInt(props.unterveranstaltung?.id as string)
const unterveranstaltungCopy = ref(fill(props.unterveranstaltung))
const veranstaltung = props.unterveranstaltung?.veranstaltung

const {
  execute: createUnterveranstaltung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    // @todo typing
    if (loggedInAccount.value?.role === 'ADMIN') {
      await apiClient.unterveranstaltung.gliederungCreate.mutate({
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungCreate']['data'],
      })
    } else {
      await apiClient.unterveranstaltung.gliederungCreate.mutate({
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['gliederungCreate']['data'],
      })
    }
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateUnterveranstaltung,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    // @todo typing
    if (loggedInAccount.value?.role === 'ADMIN') {
      await apiClient.unterveranstaltung.gliederungPatch.mutate({
        id: unterveranstaltungId,
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungPatch']['data'],
      })
    } else {
      await apiClient.unterveranstaltung.gliederungPatch.mutate({
        id: unterveranstaltungId,
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['gliederungPatch']['data'],
      })
    }

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)

const handle = async () => {
  switch (props.mode) {
    case 'create':
      await createUnterveranstaltung()
      break
    case 'update':
      await updateUnterveranstaltung()
      break
  }
}
</script>

<template>
  <pre>{{ unterveranstaltung }}</pre>
  <pre>{{ veranstaltung }}</pre>
  <h5>Unterveranstaltung: {{ veranstaltung?.name }}</h5>
  <ValidateForm
    class="mt-10"
    @submit="handle"
  >
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div class="lg:col-span-full">
        <BasicEditor
          v-model="unterveranstaltungCopy.beschreibung"
          required
          label="Unterveranstaltung"
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
