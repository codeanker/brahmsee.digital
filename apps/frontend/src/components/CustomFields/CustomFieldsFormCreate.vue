<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

import { apiClient } from '@/api'
import CustomFieldsFormGeneral, { type ICustomFieldData } from '@/components/CustomFields/CustomFieldsFormGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import { type Prisma, type CustomFieldType, type RouterInput, type CustomFieldPosition } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import CustomFieldTemplateModal from './CustomFieldTemplateModal.vue'

type Query = RouterInput['customFields']['list']

/* @vue-ignore */
const props = defineProps<{
  entity: Query['entity']
  entityId: Query['entityId']
}>()

const form = ref<ICustomFieldData>({
  name: '',
  description: '',
  required: false,
  type: 'BASIC_INPUT' as CustomFieldType,
  options: [],
  positions: [],
})

const validationErrors = ref([])

const { execute, error, isLoading } = useAsyncState(
  async () => {
    const data = form.value

    try {
      if (props.entity === 'veranstaltung') {
        await apiClient.customFields.veranstaltungCreate.mutate({
          type: 'new',
          veranstaltungId: props.entityId,
          data: {
            name: data.name,
            description: data.description || null,
            required: data.required,
            type: data.type,
            options: data.options || [],
            positions: data.positions || [],
          },
        })
      } else if (props.entity === 'unterveranstaltung') {
        await apiClient.customFields.unterveranstaltungCreate.mutate({
          unterveranstaltungId: props.entityId,
          data: {
            name: data.name,
            description: data.description || null,
            required: data.required,
            type: data.type,
            options: data.options || [],
            positions: data.positions || [],
          },
        })
      }

      router.back()
    } catch (error: any) {
      if (error.shape) {
        validationErrors.value = JSON.parse(error.shape?.message)
      }
    }
  },
  null,
  { immediate: false }
)

const templateModal = useTemplateRef('templateModal')

function onSelectTemplate(data: Prisma.CustomFieldCreateInput) {
  form.value = {
    name: data.name,
    description: data.description ?? '',
    type: data.type,
    required: data.required ?? false,
    options: (data.options as string[]) ?? [],
    positions: (data.positions as CustomFieldPosition[]) ?? [],
  }
}
</script>

<template>
  <h5>Benutzerdefiniertes Feld erstellen</h5>

  <ValidateForm @submit="execute">
    <CustomFieldsFormGeneral v-model="form" />

    <div class="mt-4 flex gap-4 items-center">
      <Button
        type="submit"
        color="primary"
      >
        <span v-if="!isLoading">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
      <Button
        type="button"
        color="warning"
        @click="() => router.back()"
      >
        Abbrechen
      </Button>
      <Button
        type="button"
        color="info"
        @click="() => templateModal?.show()"
      >
        Vorlage auswählen
      </Button>
    </div>
  </ValidateForm>

  <div class="mt-8">
    <div v-if="validationErrors.length > 0">
      <pre>{{ validationErrors }}</pre>
    </div>
    <div
      v-else-if="error"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-white"
    >
      {{ error }}
    </div>
  </div>

  <CustomFieldTemplateModal
    ref="templateModal"
    @select="onSelectTemplate"
  />
</template>
