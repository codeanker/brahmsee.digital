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
import useValidatedModel from '../../composables/useValidatedModel'

import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = defineProps<BasicInputDefaultProps<boolean>>()
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: boolean | undefined): void
}>()
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
