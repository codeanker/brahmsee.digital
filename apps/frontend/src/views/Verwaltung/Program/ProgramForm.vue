<script setup lang="ts">
import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import ConfirmAction from '@/components/UIComponents/ConfirmAction.vue'
import { dayjs } from '@codeanker/helpers'
import { ValidateForm } from '@codeanker/validation'
import { useRouteParams } from '@vueuse/router'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const veranstaltungId = useRouteParams<string>('veranstaltungId')
const programId = useRouteParams<string>('programId')

const form = useTemplateRef('form')
const route = useRoute()

const isEdit = computed(() => !route.path.includes('create'))

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
  try {
    await form.value?.validate()

    if (isEdit.value) {
      await apiClient.program.edit.mutate({
        programId: programId.value,
        data: data.value,
      })
    } else {
      await apiClient.program.create.mutate({
        veranstaltungId: veranstaltungId.value,
        data: data.value,
      })
    }

    toast.success(`Programmpunkt erfolgreich ${isEdit.value ? 'bearbeitet' : 'erstellt'}.`, {
      duration: 5000,
    })
    router.push({
      name: 'Verwaltung Veranstaltungsdetails',
      params: {
        veranstaltungId: veranstaltungId.value,
      },
      query: {
        tab: 3,
      },
    })
  } catch (error) {
    console.error(error)
    toast.error(
      `Fehler beim ${isEdit.value ? 'Bearbeiten' : 'Erstellen'} des Programmpunkts. Bitte versuche es erneut.`,
      {
        duration: 5000,
      }
    )
  }
}

async function loadData() {
  try {
    const response = await apiClient.program.get.mutate({
      programId: route.params.programId as string,
    })

    data.value = {
      name: response.name,
      description: response.description ?? '',
      location: response.location,
      responsible: response.responsible,
      startingAt: new Date(response.startingAt),
      endingAt: new Date(response.endingAt),
    }
  } catch (error) {
    console.error(error)
    toast.error('Fehler beim Laden der Daten. Bitte versuche es erneut.', {
      duration: 5000,
    })
  }
}

async function deleteProgram() {
  try {
    await apiClient.program.delete.mutate({
      programId: route.params.programId as string,
    })

    toast.success('Programmpunkt erfolgreich gelöscht.', {
      duration: 5000,
    })
    router.push({
      name: 'Verwaltung Veranstaltungsdetails',
      params: {
        veranstaltungId: veranstaltungId.value,
      },
      query: {
        tab: 3,
      },
    })
  } catch (error) {
    console.error(error)
    toast.error('Fehler beim Löschen des Programmpunkts. Bitte versuche es erneut.', {
      duration: 5000,
    })
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadData()
  }
})
</script>

<template>
  <div class="mb-12">
    <div class="text-lg font-semibold">{{ `Programmpunkt ${isEdit ? 'bearbeiten' : 'erstellen'}` }}</div>
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
          />
        </div>

        <div class="mt-8 flex items-center gap-4">
          <ConfirmAction
            description="Möchten Sie den Programmpunkt wirklich löschen?"
            @confirm="deleteProgram"
          >
            <Button
              v-if="isEdit"
              color="danger"
              class="justify-self-end"
            >
              Löschen
            </Button>
          </ConfirmAction>
          <Button
            type="submit"
            color="primary"
            class="justify-self-end"
          >
            {{ isEdit ? 'Speichern' : 'Erstellen' }}
          </Button>
        </div>
      </div>
    </ValidateForm>
  </div>
</template>
