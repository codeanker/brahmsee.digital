<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :error-message="errorMessage"
  >
    <textarea
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      :cols="cols"
      :placeholder="placeholder || label || name"
      :rules="rules"
    />
  </BasicFormGroup>
</template>

<script setup lang="ts">
import { RuleFunction } from '@codeanker/validation'
import useValidatedModel from '../../composables/useValidatedModel'
import BasicFormGroup from './components/BasicFormGroup.vue'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    cols?: number
    placeholder?: string

    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/no-unused-properties
    rules?: RuleFunction[]
    // eslint-disable-next-line vue/no-unused-properties
    required?: RequiredRulesParams
  }>(),
  {
    placeholder: undefined,
    cols: 3,
    id: '',
    label: '',
    name: '',
    rules: undefined,
    required: false,
  }
)
const emit = defineEmits(['update:modelValue'])
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
