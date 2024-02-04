<script setup lang="ts">
import { toRef } from 'vue'

import { type BasicInputDefaultProps } from './defaultProps'

import { ValidationFeedback } from '@codeanker/core-ui-components'
import { useValidatedModel } from '@codeanker/core-validation'

const props = defineProps<
  BasicInputDefaultProps<string | number | boolean> & {
    options: {
      id?: string
      label: string
      value: string | boolean | number
    }[]
  }
>()
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: string | number | boolean | undefined): void
}>()
const { model, errorMessage } = useValidatedModel(
  {
    modelValue: toRef(props, 'modelValue'),
    label: toRef(props, 'label'),
    name: toRef(props, 'name'),
    required: toRef(props, 'required'),
    rules: toRef(props, 'rules'),
  },
  emit
)
</script>

<template>
  <div>
    <div
      v-for="option in options"
      :key="option.id || option.label"
      class="flex items-center"
    >
      <input
        :id="option.id || option.label"
        v-model="model"
        type="radio"
        class="radio"
        :name="name"
        :value="option.value"
        :disabled="disabled"
      />
      <label
        class="ml-2"
        :for="option.id || option.label"
      >
        {{ option.label }}
      </label>
    </div>
    <ValidationFeedback :error-message="errorMessage" />
  </div>
</template>
