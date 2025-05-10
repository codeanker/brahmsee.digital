<script setup lang="ts">
import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import { dayjs } from '@codeanker/helpers'
import { ValidateForm } from '@codeanker/validation'
import { useRouteParams } from '@vueuse/router'
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const veranstaltungId = useRouteParams('veranstaltungId', '', {
  transform: (id) => parseInt(id),
})

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
  if (isNaN(veranstaltungId.value)) {
    return
  }

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

  <div class="grid grid-cols-3">
    <ValidateForm
      ref="form"
      class="col-span-2 grid grid-cols-2 gap-x-4 gap-y-8"
      :initial-values="initialData"
      @submit="submit"
    >
      <BasicDatepicker
        v-model="data.startingAt"
        label="Startzeit"
        required
        enable-time-picker
        :format="(date) => (date ? dayjs(date).format('dddd, DD. MMMM [um] HH:mm [Uhr]') : '')"
      />
      <BasicDatepicker
        v-model="data.endingAt"
        label="Endzeit"
        required
        enable-time-picker
        :disabled-dates="{ to: data.startingAt }"
        :format="(date) => (date ? dayjs(date).format('dddd, DD. MMMM [um] HH:mm [Uhr]') : '')"
      />

      <BasicInput
        v-model="data.name"
        label="Titel"
        required
      />
      <BasicInput
        v-model="data.description"
        label="Beschreibung"
        required
      />
      <BasicInput
        v-model="data.location"
        label="Ort"
        required
      />
      <BasicInput
        v-model="data.responsible"
        label="Verantwortlichkeit"
        required
      />

      <div class="col-span-2 grid grid-cols-2 items-start">
        <div class="space-y-2">
          <!-- <BasicSwitch
            v-model="anotherOne"
            label="Weiteren Programmpunkt erstellen"
          />
          <p class="text-sm text-gray-500">
            Wenn ausgewählt, kannst du im Anschluss einen weiteren Programmpunkt erstellen und bleibst auf dieser Seite.
          </p> -->
        </div>

        <Button
          type="submit"
          color="primary"
          class="justify-self-end"
        >
          Speichern
        </Button>
      </div>
    </ValidateForm>
  </div>
</template>
