<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const route = useRoute()

const veranstaltungId = parseInt(route.params.veranstaltungId as string)

let ausschreibung = ref<Partial<RouterInput['unterveranstaltung']['verwaltungCreate']['data']>>({
  beschreibung: '',
  gliederungId: undefined,
  maxTeilnehmende: undefined,
  meldebeginn: undefined,
  meldeschluss: undefined,
  teilnahmegebuehr: undefined,
  type: 'GLIEDERUNG',
})

const { state: gliederungen } = useAsyncState(async () => {
  return apiClient.gliederung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

const gliederungOptions = computed(() => {
  return gliederungen.value.map((gliederung) => ({
    label: gliederung.name,
    value: gliederung.id,
  }))
})

async function create() {
  ausschreibung.value.veranstaltungId = veranstaltungId
  await apiClient.unterveranstaltung.verwaltungCreate.mutate({
    data: ausschreibung.value as RouterInput['unterveranstaltung']['verwaltungCreate']['data'],
  })
}
</script>

<template>
  <ValidateForm
    class="space-y-4"
    @submit="create"
  >
    <h5>Ausschreibung anlegen</h5>

    <BasicSelect
      v-model="ausschreibung.gliederungId"
      required
      label="Gliederung"
      :options="gliederungOptions"
    />

    <BasicInput
      v-model="ausschreibung.beschreibung"
      required
      label="Beschreibung"
      placeholder="Beschreibung der Ausschreibung"
    />
    <BasicInputNumber
      v-model="ausschreibung.maxTeilnehmende"
      required
      label="Maximale Teilnehmende"
      placeholder="Maximale Teilnehmende"
    />
    <BasicInputNumber
      v-model="ausschreibung.teilnahmegebuehr"
      required
      label="Maximale Teilnehmende"
      placeholder="Maximale Teilnehmende"
    />
    <BasicDatepicker
      v-model="ausschreibung.meldebeginn"
      required
      enable-time-picker
      format="dd.MM.yyyy HH:mm"
      label="Meldebeginn"
    />
    <BasicDatepicker
      v-model="ausschreibung.meldeschluss"
      required
      enable-time-picker
      format="dd.MM.yyyy HH:mm"
      label="Meldeschluss"
    />
    <Button
      type="submit"
      color="primary"
      >Anlegen</Button
    >
  </ValidateForm>
</template>
