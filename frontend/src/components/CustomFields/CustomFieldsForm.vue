<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { toRef } from 'vue'

import Loading from '../UIComponents/Loading.vue'

import { apiClient } from '@/api'
import CustomField from '@/components/CustomFields/CustomField.vue'
import Button from '@/components/UIComponents/Button.vue'
import { ValidateForm } from '@codeanker/validation'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFieldValues: Array<any>
  entryId: number
  entityId: number
  entity: 'veranstaltung' | 'unterveranstaltung'
}>()

const emit = defineEmits<{
  (event: 'update:success'): void
}>()

const bindings = toRef(
  props.customFieldValues
    ? props.customFieldValues.reduce(
        (acc, element) => {
          acc[element.field.id] = element.value
          return acc
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<number, any>
      )
    : {}
)

const { state: customFields } = useAsyncState(async () => {
  if (props.entityId === undefined) {
    return undefined
  } else {
    return await apiClient.customFields.list.query({
      entity: props.entity,
      entityId: props.entityId,
    })
  }
}, undefined)

const { execute: submit, isLoading: isLoading } = useAsyncState(async () => {
  if (props.entryId) {
    isLoading.value = true
    await apiClient.customFields.valuesUpdate.mutate({
      data: Object.entries(bindings.value).map(([id, value]) => ({
        id: parseInt(id) as number,
        value: String(value),
      })),
      anmeldungId: props.entryId as number,
    })
    emit('update:success')
  }
}, undefined)
</script>

<template>
  <div v-if="customFields && bindings">
    <ValidateForm @submit="submit">
      <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
        <template
          v-for="customField in customFields"
          :key="customField.id"
        >
          <div class="flex flex-col gap-y-2">
            <CustomField
              v-model="bindings[customField.id]"
              :field="customField"
            />

            <p class="text-sm text-gray-500">{{ customField.description }}</p>
          </div>
        </template>
      </div>
      <Button
        color="primary"
        class="w-full justify-center mt-5 mb-20 disabled:bg-gray-300"
        type="submit"
      >
        <template v-if="isLoading">
          <Loading color="white" />
        </template>
        <span> Speichern </span>
      </Button>

      <!-- <template v-if="errorUpdate && errorUpdate.message">
        <pre><code>
        {{ errorUpdate.message }}
      </code></pre>
      </template> -->
    </ValidateForm>
  </div>
</template>
