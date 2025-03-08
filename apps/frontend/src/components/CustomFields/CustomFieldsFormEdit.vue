<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'

import { apiClient } from '@/api'
import CustomFieldsFormGeneral, { type ICustomFieldData } from '@/components/CustomFields/CustomFieldsFormGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { CustomFieldType } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  fieldId: number
}>()

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

const {
  execute: doDelete,
  // error: errorDelete,
  isLoading: isDeleting,
} = useAsyncState(
  async () => {
    await apiClient.customFields.delete.mutate({
      fieldId: field.value!.id,
      veranstaltungId: 0,
    })

    router.back()
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
        :disabled="isUpdating || isDeleting"
      >
        <span v-if="!isUpdating">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
      <Button
        type="button"
        color="warning"
        :disabled="isUpdating || isDeleting"
        @click="() => router.back()"
      >
        Abbrechen
      </Button>
      <div class="flex-1" />
      <Button
        type="button"
        color="danger"
        :disabled="isUpdating || isDeleting"
        @click="doDelete"
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
</template>
