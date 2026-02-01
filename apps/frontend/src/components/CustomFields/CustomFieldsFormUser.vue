<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { toRef } from 'vue'

import Loading from '../UIComponents/Loading.vue'

import { apiClient } from '@/api'
import CustomField from '@/components/CustomFields/CustomField.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterOutput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'

type Field = RouterOutput['customFields']['list'][number]
type Value = Awaited<RouterOutput['anmeldung']['get']>[number]['customFieldValues'][number]

const props = defineProps<{
  customFields: Array<Field>
  customFieldValues: Array<Value>
  entryId: string
}>()

const emit = defineEmits<{
  'update:success': []
}>()

const bindings = toRef(
  props.customFieldValues
    ? props.customFieldValues.reduce(
        (acc, element) => {
          acc[element.field.id] = element.value
          return acc
        },
        {} as Record<number, unknown>
      )
    : {}
)

const { execute: submit, isLoading: isLoading } = useAsyncState(async () => {
  if (props.entryId) {
    isLoading.value = true
    await apiClient.customFields.valuesUpdate.mutate({
      data: Object.entries(bindings.value).map(([id, value]) => ({
        id: id,
        value: String(value),
      })),
      anmeldungId: props.entryId,
    })
    emit('update:success')
  }
}, undefined)
</script>

<template>
  <div v-if="bindings">
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

            <p class="text-sm text-gray-500">
              {{ customField.description }}
            </p>
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
