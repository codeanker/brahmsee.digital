<script setup lang="ts">
import { useVModel } from '@vueuse/core'

import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<number> & {
      inputClass?: string
      disableValidation?: boolean
    }
  >(),
  {
    type: 'text',
    autocapitalize: 'off',
    inputClass: '',
    disableValidation: false,
  }
)
const emit = defineEmits<{
  'update:modelValue': [string | undefined]
  focus: []
  blur: []
}>()
const { model, errorMessage } = props.disableValidation
  ? {
      model: useVModel(props, 'modelValue', emit),
      errorMessage: undefined,
    }
  : useValidationModel(props, emit)
</script>

<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :required="required"
    :error-message="errorMessage"
  >
    <div class="align-items-center flex">
      <input
        :id="id || name || label"
        v-model="model"
        :name="id || name || label"
        type="number"
        :placeholder="placeholder || label || name"
        :class="[{ 'rounded-r-none': $slots.append }, inputClass]"
        :disabled="disabled"
        @focus="emit('focus')"
        @blur="emit('blur')"
      />
      <div class="flex-shrink-0">
        <slot name="append" />
      </div>
    </div>
  </BasicFormGroup>
</template>
