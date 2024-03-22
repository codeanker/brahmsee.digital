<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import CustomFieldsForm, { type ICustomFieldData } from '@/components/forms/customFields/CustomFieldsForm.vue'
import Button from '@/components/UIComponents/Button.vue'
import router from '@/router'
import { ValidateForm } from '@codeanker/validation'

const route = useRoute()

const veranstaltungId = computed(() => parseInt(route.params.veranstaltungId as string))

const form = ref<ICustomFieldData>({
  name: '',
  description: '',
  required: false,
  type: 'TEXT',
})

const validationErrors = ref([])

const { execute, error, isLoading } = useAsyncState(
  async () => {
    const data = form.value

    try {
      await apiClient.customFields.verwaltungCreate.mutate({
        veranstaltungId: veranstaltungId.value,
        data: {
          name: data.name,
          description: data.description || null,
          required: data.required,
          type: data.type,
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

  <ValidateForm>
    <CustomFieldsForm v-model="form" />
  </ValidateForm>

  <div class="mt-4 flex gap-4 items-center">
    <Button
      type="submit"
      color="primary"
      @click="execute"
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