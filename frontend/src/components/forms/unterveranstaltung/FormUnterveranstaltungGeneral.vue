<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unterveranstaltung?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  veranstaltungId?: any
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
    veranstaltungId: unterveranstaltung?.veranstaltung?.id,
  }
}

const unterveranstaltungId = parseInt(props.unterveranstaltung?.id as string)
const unterveranstaltungCopy = ref(fill(props.unterveranstaltung))

if (props.mode === 'create') {
  unterveranstaltungCopy.value.veranstaltungId = props?.veranstaltungId
}

const { state: veranstaltungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN')
    return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  return apiClient.veranstaltung.gliederungList.query()
}, [])

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
    router.back()
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
  <h5>
    Ausschreibung <span v-if="unterveranstaltung">{{ unterveranstaltung.veranstaltung.name }}</span>
  </h5>
  <ValidateForm
    class="mt-10"
    @submit="handle"
  >
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div
        v-if="mode === 'create'"
        class="lg:col-span-full"
      >
        <BasicSelect
          v-model="unterveranstaltungCopy.veranstaltungId"
          required
          label="Veranstaltung"
          placeholder="Veranstaltungsort"
          :options="
            veranstaltungen.map((veranstaltungen) => ({ label: veranstaltungen.name, value: veranstaltungen.id }))
          "
        />
      </div>
      <!-- <div
        v-if="mode === 'create' && loggedInAccount?.role === 'ADMIN'"
        class="lg:col-span-full"
      >
        <BasicSelect
          v-model="unterveranstaltungCopy.gliederungId"
          required
          label="Gliederung"
          placeholder="Gliederung"
          :options="gliederungen.map((gliederung) => ({ label: gliederung.name, value: gliederung.id }))"
        />
      </div> -->
      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldebeginn"
          required
          format="dd.MM.yyyy"
          label="Meldebeginn"
          placeholder="Meldebeginn"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldeschluss"
          required
          format="dd.MM.yyyy"
          label="Meldeschluss"
          placeholder="Meldeschluss"
        />
      </div>
      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="unterveranstaltungCopy.teilnahmegebuehr"
          required
          label="Teilnahmegebühr"
          placeholder="Teilnahmegebühr"
        />
      </div>
      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="unterveranstaltungCopy.maxTeilnehmende"
          required
          label="Maximale Teilnehmenden Zahl"
          placeholder="Maximale Teilnehmenden Zahl"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="unterveranstaltungCopy.beschreibung"
          required
          label="Beschreibung"
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
