<script setup lang="ts">
import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'
import cn from '@/helpers/cn'

import useValidationModel from '@/composables/useValidationModel'

const props = defineProps<BasicInputDefaultProps<boolean>>()
const emit = defineEmits<{
  'update:modelValue': [boolean | undefined]
}>()
const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <div :class="cn('flex items-center', props.class)">
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
