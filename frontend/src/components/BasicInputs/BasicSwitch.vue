<script setup lang="ts">
import { Switch } from '@headlessui/vue'

import useValidationModel from '../../composables/useValidationModel'

import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = defineProps<BasicInputDefaultProps<boolean>>()
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: boolean): void
}>()
const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <div class="grid grid-cols-switch gap-2 max-w-fit">
    <Switch
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
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
      class="ml-2 select-none"
      :for="id || name || label"
    >
      <span>{{ label }}</span>
      <span
        v-if="required"
        class="text-danger-600"
      >
        *
      </span>
    </label>
    <BasicValidationFeedback
      class="col-span-2"
      :error-message="errorMessage"
    />
  </div>
</template>
