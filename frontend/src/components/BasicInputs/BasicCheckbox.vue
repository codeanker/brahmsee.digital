<script setup lang="ts">
import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'

import useValidationModel from '@/composables/useValidationModel'

const props = defineProps<BasicInputDefaultProps<boolean>>()
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: boolean | undefined): void
}>()
const { model, errorMessage } = useValidationModel(props, emit)
</script>

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
    <div class="ml-2">
      <label
        v-if="label"
        :for="id || name || label"
      >
        {{ label }}
      </label>
      <slot />
    </div>
  </div>
  <BasicValidationFeedback :error-message="errorMessage" />
</template>
