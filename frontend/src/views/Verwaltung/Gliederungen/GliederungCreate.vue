<script setup lang="ts">
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

let model = ref<Partial<RouterInput['gliederung']['verwaltungCreate']['data']>>({
  name: '',
  edv: '',
})

async function create() {
  await apiClient.gliederung.verwaltungCreate.mutate({
    data: model.value as RouterInput['gliederung']['verwaltungCreate']['data'],
  })
}
</script>

<template>
  <ValidateForm @submit="create">
    <h5>Gliederung erstellen</h5>
    <BasicInput
      v-model="model.name"
      required
      label="Name"
      placeholder="Name der Gliederung"
    />
    <BasicInput
      v-model="model.edv"
      required
      label="EDV"
      placeholder="EDV-Nummer"
    />
    <button type="submit">Anlegen</button>
  </ValidateForm>
</template>
