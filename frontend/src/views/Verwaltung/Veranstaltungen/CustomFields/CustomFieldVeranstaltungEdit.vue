<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import CustomFieldsForm, { type ICustomFieldData } from '@/components/forms/customFields/CustomFieldsForm.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import type { CustomFieldType } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

const route = useRoute()

const fieldId = computed(() => parseInt(route.params.fieldId as string))

const { state: field, isReady } = useAsyncState(async () => {
  return apiClient.customFields.get.query({
    id: fieldId.value,
  })
}, null)

watch(field, () => {
  form.value = {
    name: field.value?.name ?? '',
    description: field.value?.description ?? '',
    required: field.value?.required ?? false,
    type: (field.value?.type ?? 'BasicInput') as CustomFieldType,
    options: field.value?.options ?? [],
  }
})

const form = ref<ICustomFieldData>({
  name: '',
  description: '',
  required: false,
  options: [],
  type: 'BasicInput',
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
      await apiClient.customFields.verwaltungUpdate.mutate({
        fieldId: fieldId.value,
        data: {
          name: data.name,
          description: data.description || null,
          required: data.required,
          type: data.type,
          options: data.options,
        },
      })

      router.back()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  <ValidateForm v-if="isReady">
    <CustomFieldsForm v-model="form" />
  </ValidateForm>

  <div class="mt-4 flex gap-4 items-center">
    <Button
      type="submit"
      color="primary"
      @click="execute"
    >
      <span v-if="!isUpdating">Speichern</span>
      <span v-else>Loading...</span>
    </Button>
    <Button
      type="button"
      color="warning"
      @click="() => router.back()"
    >
      Abbrechen
    </Button>
  </div>

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
