<script setup lang="ts">
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

let model = ref<Partial<RouterInput['ort']['verwaltungCreate']['data']>>({
  name: '',
})

async function create() {
  await apiClient.ort.verwaltungCreate.mutate({
    data: model.value as RouterInput['ort']['verwaltungCreate']['data'],
  })
}
</script>

<template>
  <ValidateForm
    class="space-y-4"
    @submit="create"
  >
    <h5>Ort anlegen</h5>
    <BasicInput
      v-model="model.name"
      required
      label="Name"
      placeholder="Name des Ortes"
    />
    <Button
      type="submit"
      color="primary"
      >Anlegen</Button
    >
  </ValidateForm>
</template>
