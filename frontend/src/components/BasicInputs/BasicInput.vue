<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :error-message="errorMessage"
  >
    <div class="align-items-center flex">
      <input
        :id="id || name || label"
        v-model="model"
        :name="id || name || label"
        :type="type"
        :autocapitalize="autocapitalize"
        :placeholder="placeholder || label || name"
        :class="{ 'rounded-r-none': $slots.append }"
        :disabled="disabled"
      />
      <div class="flex-shrink-0">
        <slot name="append" />
      </div>
    </div>
  </BasicFormGroup>
</template>

<script setup lang="ts">
import { RuleFunction } from '@codeanker/validation'
import useValidatedModel from '../../composables/useValidatedModel'
import BasicFormGroup from './components/BasicFormGroup.vue'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'number' | 'password' | 'email'
    placeholder?: string
    disabled?: boolean
    autocapitalize?: 'off' | 'on' | 'words' | 'characters'

    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: string
    // eslint-disable-next-line vue/no-unused-properties
    rules?: RuleFunction[]
    // eslint-disable-next-line vue/no-unused-properties
    required?: RequiredRulesParams
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocapitalize: undefined,
    labelClass: '',
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
