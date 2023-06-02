<template>
  <div class="flex items-center">
    <input
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      type="checkbox"
      class="checkbox"
      :disabled="disabled"
    />
    <label
      v-if="label"
      class="ml-2"
      :for="id || name || label"
      >{{ label }}</label
    >
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { RuleFunction } from '@codeanker/validation'
import useValidatedModel from '../../composables/useValidatedModel'
import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = defineProps<{
  disabled?: boolean
  id?: string
  label?: string
  name?: string
  // eslint-disable-next-line vue/no-unused-properties
  modelValue: boolean | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/no-unused-properties
  rules?: RuleFunction[]
  // eslint-disable-next-line vue/no-unused-properties
  required?: RequiredRulesParams
}>()
const emit = defineEmits(['update:modelValue'])
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
