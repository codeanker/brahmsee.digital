<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  veranstaltung?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (veranstaltung) => {
  return {
    name: veranstaltung?.name,
    beginn: veranstaltung?.beginn,
    ende: veranstaltung?.ende,
    ortId: veranstaltung?.ort?.id,
    meldebeginn: veranstaltung?.meldebeginn ?? '',
    meldeschluss: veranstaltung?.meldeschluss ?? '',
    maxTeilnehmende: veranstaltung?.maxTeilnehmende ?? '',
    teilnahmegebuehr: veranstaltung?.teilnahmegebuehr ?? '',
    beschreibung: veranstaltung?.beschreibung ?? '',
    datenschutz: veranstaltung?.datenschutz ?? '',
    teilnahmeBedingungen: veranstaltung?.teilnahmeBedingungen ?? '',
    teilnahmeBedingungenPublic: veranstaltung?.teilnahmeBedingungenPublic ?? '',
    zielgruppe: veranstaltung?.zielgruppe ?? '',
    hostnameId: veranstaltung?.hostname?.id,
  }
}

const veranstaltungId = props.veranstaltung?.id
const veranstaltungCopy = ref(fill(props.veranstaltung) ?? { role: 'ADMIN' })

const {
  execute: createVeranstaltung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.veranstaltung.verwaltungCreate.mutate({
      data: veranstaltungCopy.value as unknown as RouterInput['veranstaltung']['verwaltungCreate']['data'],
    })
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateVeranstaltung,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.veranstaltung.verwaltungPatch.mutate({
      id: veranstaltungId,
      data: veranstaltungCopy.value as unknown as RouterInput['veranstaltung']['verwaltungPatch']['data'],
    })

    props.onUpdate?.()
    router.back()
  },
  null,
  { immediate: false }
)

const handle = async () => {
  switch (props.mode) {
    case 'create':
      await createVeranstaltung()
      break
    case 'update':
      await updateVeranstaltung()
      break
  }
}

const { state: orte } = useAsyncState(async () => {
  return apiClient.ort.list.query({ filter: {}, orderBy: [], pagination: { take: 100, skip: 0 } })
}, [])

const { state: hostnames } = useAsyncState(async () => {
  return apiClient.system.hostnamesGet.query({})
}, [])
</script>

<template>
  <ValidateForm @submit="handle">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div class="lg:col-span-full">
        <BasicInput
          v-model="veranstaltungCopy.name"
          required
          label="Name"
          placeholder="Name der Veranstaltung"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="veranstaltungCopy.beginn"
          required
          format="dd.MM.yyyy"
          label="Veranstaltungsbegin"
          placeholder="Veranstaltungsbegin"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="veranstaltungCopy.ende"
          required
          format="dd.MM.yyyy"
          label="Veranstaltungsende"
          placeholder="Veranstaltungsende"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="veranstaltungCopy.meldebeginn"
          required
          format="dd.MM.yyyy"
          label="Meldebeginn"
          placeholder="Meldebeginn"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="veranstaltungCopy.meldeschluss"
          required
          format="dd.MM.yyyy"
          label="Meldeschluss"
          placeholder="Meldeschluss"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="veranstaltungCopy.maxTeilnehmende"
          required
          label="Maximale Teilnehmenden Zahl"
          placeholder="Maximale Teilnehmenden Zahl"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="veranstaltungCopy.teilnahmegebuehr"
          required
          label="Teilnahmegebühr"
          placeholder="Teilnahmegebühr"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicSelect
          v-model="veranstaltungCopy.ortId"
          required
          label="Ort"
          placeholder="Bitte wählen..."
          :options="orte.map((ort) => ({ label: ort.name, value: ort.id }))"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicSelect
          v-model="veranstaltungCopy.hostnameId"
          required
          label="Hostname"
          placeholder="Bitte wählen..."
          :options="hostnames.map((hostname) => ({ label: 'https://' + hostname.hostname, value: hostname.id }))"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="veranstaltungCopy.beschreibung"
          required
          label="Beschreibung"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="veranstaltungCopy.teilnahmeBedingungen"
          label="interne Teilnahmebedingungen"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="veranstaltungCopy.teilnahmeBedingungenPublic"
          label="öffentliche Teilnahmebedingungen"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="veranstaltungCopy.zielgruppe"
          label="Zielgruppe"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="veranstaltungCopy.datenschutz"
          label="Datenschutz"
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
