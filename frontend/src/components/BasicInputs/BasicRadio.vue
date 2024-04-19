<script setup lang="ts">
import useValidationModel from '../../composables/useValidationModel'

import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'

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
const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <div>
    <label
      v-if="label"
      class="font-medium"
      :for="id || name || label"
      >{{ label }}
      <span
        v-if="required"
        class="text-danger-600"
        >*</span
      ></label
    >
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
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>
