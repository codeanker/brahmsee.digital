<script setup lang="ts">
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

let model = ref<Partial<RouterInput['veranstaltung']['verwaltungCreate']['data']>>({
  name: '',
  beginn: new Date(),
  ende: new Date(),
  ort: '',
  meldebeginn: undefined,
  meldeschluss: undefined,
  maxTeilnehmende: undefined,
  teilnahmegebuehr: undefined,
})

async function create() {
  await apiClient.veranstaltung.verwaltungCreate.mutate({
    data: model.value as RouterInput['veranstaltung']['verwaltungCreate']['data'],
  })
}
</script>

<template>
  <ValidateForm @submit="create">
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
    <BasicInput
      v-model="model.ort"
      required
      label="Ort"
      placeholder="Veranstaltungsort"
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
    <BasicDatepicker
      v-model="model.maxTeilnehmende"
      required
      format="dd.MM.yyyy"
      label="Maximale Teilnehmenden Zahl"
      placeholder="Maximale Teilnehmenden Zahl"
    />
    <BasicInputNumber
      v-model="model.teilnahmegebuehr"
      required
      type="number"
      label="Teilnahmegebühr"
      placeholder="Teilnahmegebühr"
    />
    <button type="submit">Anlegen</button>
  </ValidateForm>
</template>
