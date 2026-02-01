<script setup lang="ts">
import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import { dayjs } from '@codeanker/helpers'
import { ValidateForm } from '@codeanker/validation'
import { useRouteParams } from '@vueuse/router'
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const veranstaltungId = useRouteParams<string>('veranstaltungId')

// const anotherOne = ref(false)

const form = useTemplateRef('form')

const initialData = {
  startingAt: dayjs().toDate(),
  endingAt: dayjs().add(1, 'hour').toDate(),
  name: '',
  description: '',
  location: '',
  responsible: '',
}
const data = ref(initialData)

async function submit() {
  await apiClient.program.create.mutate({
    veranstaltungId: veranstaltungId.value,
    ...data.value,
  })

  // TODO: Toast

  // if (anotherOne.value) {
  //   router.replace({ name: 'Verwaltung Programmpunkt erstellen', force: true })
  // } else {
  router.push({
    name: 'Verwaltung Veranstaltungsdetails',
    params: {
      veranstaltungId: veranstaltungId.value,
    },
  })
  // }
}
</script>

<template>
  <div class="mb-12">
    <div class="text-lg font-semibold">Programmpunkt erstellen</div>
    <p class="max-w-2xl text-sm text-gray-500">Füll unten die Daten aus</p>
  </div>
  <div class="grid lg:grid-cols-2 gap-6">
    <ValidateForm
      ref="form"
      :initial-values="initialData"
      @submit="submit"
    >
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div class="lg:col-span-full">
          <BasicInput
            v-model="data.name"
            label="Titel"
            required
            class="col-span-full"
          />
        </div>
        <div class="lg:col-span-3">
          <BasicDatepicker
            v-model="data.startingAt"
            label="Startzeit"
            required
            enable-time-picker
            format="dd.MM.yyyy"
          />
        </div>
        <div class="lg:col-span-3">
          <BasicDatepicker
            v-model="data.endingAt"
            label="Endzeit"
            required
            enable-time-picker
            :disabled-dates="{ to: data.startingAt }"
            format="dd.MM.yyyy"
          />
        </div>

        <div class="lg:col-span-3">
          <BasicInput
            v-model="data.location"
            label="Ort"
            required
          />
        </div>
        <div class="lg:col-span-3">
          <BasicInput
            v-model="data.responsible"
            label="Verantwortlichkeit"
            required
          />
        </div>

        <div class="lg:col-span-full">
          <BasicEditor
            v-model="data.description"
            label="Beschreibung"
            required
          />
        </div>

        <div class="mt-8 flex gap-4">
          <Button
            type="submit"
            color="primary"
            class="justify-self-end"
          >
            Speichern
          </Button>
        </div>
      </div>
    </ValidateForm>
  </div>
</template>
