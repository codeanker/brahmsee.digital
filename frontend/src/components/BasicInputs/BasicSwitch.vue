<template>
  <div>
    <Switch
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      type="checkbox"
      class="checkbox"
      :disabled="disabled"
      :class="[
        model ? 'bg-primary-600' : 'bg-gray-200',
        'focus:ring-primary-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
      ]"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="[
          model ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        ]"
      />
    </Switch>
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
import { Switch } from '@headlessui/vue'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    disabled?: boolean

    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: boolean | undefined
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
