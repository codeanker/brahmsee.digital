<script setup lang="ts">
import BasicValidationFeedback from './BasicValidationFeedback.vue'

import type { RequiredRulesParams } from '@codeanker/validation/rules'

withDefaults(
  defineProps<{
    id?: string
    label?: string
    name?: string
    required?: RequiredRulesParams
    errorMessage?: string
  }>(),
  {
    id: '',
    label: '',
    name: '',
    errorMessage: undefined,
  }
)
</script>

<template>
  <div>
    <label
      v-if="label"
      class="font-medium"
      :for="id || name || label"
      >{{ label }}
      <span
        v-if="required"
        class="text-danger-600"
        >*</span
      >
    </label>
    <slot></slot>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>
