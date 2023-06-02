<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium leading-6 mb-2"
      :for="id || name || label"
      >{{ label }}</label
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
