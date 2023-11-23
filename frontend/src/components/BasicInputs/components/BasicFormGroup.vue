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

<template>
  <div>
    <label
      v-if="label"
      :for="id || name || label"
      >{{ label }}</label
    >
    <slot></slot>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>
