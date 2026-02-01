<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'

import { apiClient } from '@/api'
import CustomFieldsFormGeneral, { type ICustomFieldData } from '@/components/CustomFields/CustomFieldsFormGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { CustomFieldType } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import CustomFieldDeleteModal from './CustomFieldDeleteModal.vue'

const props = defineProps<{
  entity: 'veranstaltung' | 'unterveranstaltung'
  entityId: string
  fieldId: string
}>()

const deleteModal = useTemplateRef('deleteModal')

const { state: field } = useAsyncState(async () => {
  return apiClient.customFields.get.query({
    id: props.fieldId,
  })
}, null)

watch(field, () => {
  form.value = {
    name: field.value?.name ?? '',
    description: field.value?.description ?? '',
    required: field.value?.required ?? false,
    type: (field.value?.type ?? 'BASIC_INPUT') as CustomFieldType,
    options: field.value?.options ?? [],
    positions: field.value?.positions ?? [],
  }
})

const form = ref<ICustomFieldData>({
  name: '',
  description: '',
  required: false,
  type: 'BASIC_INPUT' as CustomFieldType,
  options: [],
  positions: [],
})

const validationErrors = ref([])

const {
  execute,
  error,
  isLoading: isUpdating,
} = useAsyncState(
  async () => {
    const data = form.value

    try {
      await apiClient.customFields.update.mutate({
        fieldId: props.fieldId,
        data: {
          name: data.name,
          description: data.description || null,
          required: data.required,
          type: data.type,
          options: data.options,
          positions: data.positions,
        },
      })

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
</script>

<template>
  <h5>Benutzerdefiniertes Feld erstellen</h5>

  <ValidateForm @submit="execute">
    <CustomFieldsFormGeneral v-model="form" />

    <div class="mt-4 flex gap-4 items-center">
      <Button
        type="submit"
        color="primary"
        :disabled="isUpdating"
      >
        <span v-if="!isUpdating">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
      <Button
        type="button"
        color="warning"
        :disabled="isUpdating"
        @click="() => router.back()"
      >
        Abbrechen
      </Button>
      <div class="flex-1" />
      <Button
        type="button"
        color="danger"
        :disabled="isUpdating"
        @click="deleteModal?.show()"
      >
        Löschen
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

  <CustomFieldDeleteModal
    v-if="field"
    ref="deleteModal"
    :entity="props.entity"
    :entity-id="props.entityId"
    :field="field"
    @delete="router.back()"
  />
</template>
