<script setup lang="ts">
import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<string> & {
      cols?: number
      rows?: number
    }
  >(),
  {
    cols: 3,
    rows: 3,
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: string): void
}>()
const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :required="required"
    :error-message="errorMessage"
  >
    <textarea
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      :cols="cols"
      :rows="rows"
      :placeholder="placeholder || label || name"
      :rules="rules"
    />
  </BasicFormGroup>
</template>
