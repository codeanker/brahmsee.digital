<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

let model = ref<Partial<RouterInput['veranstaltung']['verwaltungCreate']['data']>>({
  name: '',
  beginn: new Date(),
  ende: new Date(),
  ortId: undefined,
  meldebeginn: undefined,
  meldeschluss: undefined,
  maxTeilnehmende: undefined,
  teilnahmegebuehr: undefined,
})

const { state: orte } = useAsyncState(async () => {
  return apiClient.ort.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

async function create() {
  await apiClient.veranstaltung.verwaltungCreate.mutate({
    data: model.value as RouterInput['veranstaltung']['verwaltungCreate']['data'],
  })
}
</script>

<template>
  <ValidateForm
    class="space-y-4"
    @submit="create"
  >
    <h5>Veranstaltung anlegen</h5>
    <BasicInput
      v-model="model.name"
      required
      label="Name"
      placeholder="Name der Veranstaltung"
    />
    <BasicDatepicker
      v-model="model.beginn"
      required
      format="dd.MM.yyyy"
      label="Beginn"
      placeholder="Veranstaltungsbegin"
    />
    <BasicDatepicker
      v-model="model.ende"
      required
      format="dd.MM.yyyy"
      label="Ende"
      placeholder="Veranstaltungsende"
    />
    <BasicSelect
      v-model="model.ortId"
      required
      label="Ort"
      placeholder="Veranstaltungsort"
      :options="orte.map((ort) => ({ label: ort.name, value: ort.id }))"
    />
    <BasicDatepicker
      v-model="model.meldebeginn"
      required
      format="dd.MM.yyyy"
      label="Meldebeginn"
      placeholder="Meldebeginn"
    />
    <BasicDatepicker
      v-model="model.meldeschluss"
      required
      format="dd.MM.yyyy"
      label="Meldeschluss"
      placeholder="Meldeeschluss"
    />
    <BasicInputNumber
      v-model="model.maxTeilnehmende"
      required
      label="Maximale Teilnehmenden Zahl"
      placeholder="Maximale Teilnehmenden Zahl"
    />
    <BasicInputNumber
      v-model="model.teilnahmegebuehr"
      required
      label="Teilnahmegebühr"
      placeholder="Teilnahmegebühr"
    />
    <Button
      type="submit"
      color="primary"
      >Anlegen</Button
    >
  </ValidateForm>
</template>
