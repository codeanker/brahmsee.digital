<script setup lang="ts">
import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'
import InputNumber from 'primevue/inputnumber'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<number> & {
      locale?: string
      currency?: string
      prefix?: string
      suffix?: string
      minFractionDigits?: number
      maxFractionDigits?: number
      useGrouping?: boolean
      min?: number
      max?: number
      step?: number
    }
  >(),
  {
    locale: 'de-DE',
    useGrouping: true,
  }
)
const emit = defineEmits<{
  'update:modelValue': [string | undefined]
  focus: []
  blur: []
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
    <InputNumber
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      :placeholder="placeholder || label || name"
      :class="{ 'rounded-r-none': $slots.append }"
      :disabled="disabled"
      :locale="locale"
      :currency="currency"
      :prefix="prefix"
      :suffix="suffix"
      :min-fraction-digits="minFractionDigits"
      :max-fraction-digits="maxFractionDigits"
      :use-grouping="useGrouping"
      :min="min"
      :max="max"
      :step="step"
      mode="decimal"
      input-class="input-style"
      class="block"
      unstyled
    />
    <div class="flex-shrink-0">
      <slot name="append" />
    </div>
  </BasicFormGroup>
</template>
