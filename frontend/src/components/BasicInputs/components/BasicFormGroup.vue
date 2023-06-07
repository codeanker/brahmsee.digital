<template>
  <div>
    <label
      v-if="label"
      class="mb-2 block text-sm font-medium leading-6"
      :for="id || name || label"
      >{{ label
      }}<span
        v-if="required"
        class="text-red-500"
        >*</span
      ></label
    >
    <slot></slot>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import BasicValidationFeedback from './BasicValidationFeedback.vue'

withDefaults(
  defineProps<{
    id?: string
    label?: string
    name?: string
    required?: boolean
    errorMessage?: string
  }>(),
  {
    id: '',
    label: '',
    name: '',
    required: false,
    errorMessage: undefined,
  }
)
</script>
