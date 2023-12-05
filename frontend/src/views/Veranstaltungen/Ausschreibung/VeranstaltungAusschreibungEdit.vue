<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const route = useRoute()

const ausschreibungCopy = ref<Partial<RouterInput['unterveranstaltung']['verwaltungPatch']['data']>>()

const ausschreibungId = parseInt(route.params.ausschreibungId as string)

const { state: ausschreibung } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.verwaltungGet.query({
    id: ausschreibungId,
  })
}, undefined)

watch(ausschreibung, (value) => {
  ausschreibungCopy.value = {
    beschreibung: value?.beschreibung ?? '',
    maxTeilnehmende: value?.maxTeilnehmende,
    teilnahmegebuehr: value?.teilnahmegebuehr,
    meldebeginn: value?.meldebeginn,
    meldeschluss: value?.meldeschluss,
  }
})

async function save() {
  await apiClient.unterveranstaltung.verwaltungPatch.mutate({
    id: ausschreibungId,
    data: ausschreibungCopy.value as RouterInput['unterveranstaltung']['verwaltungPatch']['data'],
  })
}
</script>

<template>
  <ValidateForm
    class="space-y-4"
    @submit="save"
  >
    <h5>Ausschreibung berbeiten</h5>
    <template v-if="ausschreibungCopy">
      <BasicInput
        v-model="ausschreibungCopy.beschreibung"
        required
        label="Beschreibung"
        placeholder="Beschreibung der Ausschreibung"
      />
      <BasicInputNumber
        v-model="ausschreibungCopy.maxTeilnehmende"
        required
        label="Maximale Teilnehmende"
        placeholder="Maximale Teilnehmende"
      />
      <BasicDatepicker
        v-model="ausschreibungCopy.meldebeginn"
        required
        time-picker
        format="dd.MM.yyyy HH:mm"
        label="Meldebeginn"
      />
      <BasicDatepicker
        v-model="ausschreibungCopy.meldeschluss"
        required
        time-picker
        format="dd.MM.yyyy HH:mm"
        label="Meldeschluss"
      />
      <Button
        type="submit"
        color="primary"
        >Speichern</Button
      >
    </template>
  </ValidateForm>
</template>
