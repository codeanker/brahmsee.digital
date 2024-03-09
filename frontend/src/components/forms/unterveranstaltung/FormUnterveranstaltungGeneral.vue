<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { UnterveranstaltungTypeMapping, getEnumOptions } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unterveranstaltung?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  veranstaltungId?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const unterveranstaltungCopy = ref({
  beschreibung: props.unterveranstaltung?.beschreibung,
  bedingungen: props.unterveranstaltung?.bedingungen,
  maxTeilnehmende: props.unterveranstaltung?.maxTeilnehmende,
  meldebeginn: props.unterveranstaltung?.meldebeginn,
  meldeschluss: props.unterveranstaltung?.meldeschluss,
  teilnahmegebuehr: props.unterveranstaltung?.teilnahmegebuehr,
  veranstaltungId: props.unterveranstaltung?.veranstaltung?.id,
  gliederungId: props.unterveranstaltung?.gliederung?.id,
  type: props.unterveranstaltung?.type,
})

const unterveranstaltungId = props.unterveranstaltung?.id
const gliederung = ref(props.unterveranstaltung?.gliederung)

// Wird benötig damit man direkt von einer Veranstaltung eine Unterveranstaltung anlegen kann ohne diese extra auswählen zu müssen
if (props.mode === 'create') {
  unterveranstaltungCopy.value.veranstaltungId = props?.veranstaltungId
}

function useVeranstaltungList(isAdmin: boolean) {
  if (isAdmin) {
    const { state } = useAsyncState(async () => {
      return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
    }, [])
    return state
  } else {
    const { state } = useAsyncState(async () => {
      return apiClient.veranstaltung.gliederungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
    }, [])
    return state
  }
}

const veranstaltungen = useVeranstaltungList(loggedInAccount.value?.role === 'ADMIN')

const {
  execute: createUnterveranstaltung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN') {
      unterveranstaltungCopy.value.gliederungId = gliederung.value.id
      await apiClient.unterveranstaltung.verwaltungCreate.mutate({
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungCreate']['data'],
      })
    } else {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.type
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
  error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN') {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.veranstaltungId
      delete unterveranstaltungCopy.value.type
      if (unterveranstaltungCopy.value.bedingungen === null) {
        delete unterveranstaltungCopy.value.bedingungen
      }
      await apiClient.unterveranstaltung.verwaltungPatch.mutate({
        id: unterveranstaltungId,
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungPatch']['data'],
      })
    } else {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.veranstaltungId
      delete unterveranstaltungCopy.value.type
      if (unterveranstaltungCopy.value.bedingungen === null) {
        delete unterveranstaltungCopy.value.bedingungen
      }
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

async function queryObjectGliederungen(searchTerm) {
  return apiClient.gliederung.publicList.query({ filter: { name: searchTerm }, pagination: { take: 100, skip: 0 } })
}

const veranstaltung = computed(() => {
  if (props.mode === 'create') {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    unterveranstaltungCopy.value.meldebeginn = undefined
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    unterveranstaltungCopy.value.meldeschluss = undefined

    return veranstaltungen.value.find((item) => item.id == unterveranstaltungCopy.value.veranstaltungId)
  } else {
    return props.unterveranstaltung?.veranstaltung
  }
})

const disableddates = computed(() => {
  let obj = {
    to: undefined,
    from: undefined,
  }
  if (veranstaltung.value) {
    obj.to = veranstaltung.value.meldebeginn
    obj.from = veranstaltung.value.meldeschluss
  }
  return obj
})
</script>

<template>
  <h5>
    Ausschreibung <span v-if="unterveranstaltung">{{ unterveranstaltung.veranstaltung.name }}</span>
  </h5>
  <ValidateForm
    class="mt-5 lg:mt-10"
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
          :options="veranstaltungen.map((veranstaltung) => ({ label: veranstaltung.name, value: veranstaltung.id }))"
        />
      </div>
      <template v-if="mode === 'create' && loggedInAccount?.role === 'ADMIN'">
        <div class="lg:col-span-3">
          <BasicTypeahead
            v-model="gliederung"
            :query="queryObjectGliederungen"
            :input-formatter="(result) => result?.name"
            :result-formatter="(result) => result.name"
            :strict="true"
            label="Gliederung"
            required
            placeholder="Gliederung eingeben"
          />
        </div>
        <div class="lg:col-span-3">
          <BasicSelect
            v-model="unterveranstaltungCopy.type"
            required
            label="Veranstaltungstyp"
            placeholder="Typ"
            :options="getEnumOptions(UnterveranstaltungTypeMapping)"
          />
        </div>
      </template>
      <div
        v-if="mode === 'update' && loggedInAccount?.role === 'ADMIN'"
        class="lg:col-span-full"
      >
        <BasicInput
          :model-value="gliederung.name + ' (' + gliederung.edv + ')'"
          label="Gliederung"
          class="col-span-2"
          disabled
        />
      </div>
      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldebeginn"
          required
          format="dd.MM.yyyy"
          label="Meldebeginn"
          placeholder="Meldebeginn"
          :disabled-dates="disableddates"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldeschluss"
          required
          format="dd.MM.yyyy"
          label="Meldeschluss"
          placeholder="Meldeschluss"
          :disabled-dates="disableddates"
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
      <div class="lg:col-span-full">
        <BasicEditor
          v-model="unterveranstaltungCopy.bedingungen"
          label="Bedingungen"
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
      v-if="errorCreate || errorUpdate"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
    >
      {{ errorCreate }} {{ errorUpdate }}
    </div>
  </ValidateForm>
</template>
