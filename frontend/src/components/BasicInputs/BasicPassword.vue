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
        :type="passwordVisible ? 'text' : 'password'"
        :placeholder="placeholder || label || name"
        class="rounded-r-none"
        :disabled="disabled"
        @focus="emit('focus')"
        @blur="emit('blur')"
      />
      <div class="flex-shrink-0">
        <button
          type="button"
          class="btn rounded-l-none border border-solid border-gray-100 bg-gray-100"
          @click="passwordVisible = !passwordVisible"
        >
          <!-- <FontAwesomeIcon
            v-if="passwordVisible"
            :icon="faEye"
            class="text-primary"
            fixed-width
          />
          <FontAwesomeIcon
            v-else
            :icon="faEyeSlash"
            class="text-primary"
            fixed-width
          /> -->
        </button>
      </div>
    </div>
  </BasicFormGroup>
</template>

<script setup lang="ts">
// import { faEye, faEyeSlash } from '@fortawesome/pro-duotone-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = defineProps<
  BasicInputDefaultProps<string> & {
    disableValidation?: boolean
  }
>()
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: string | undefined): void
  (event: 'focus'): void
  (event: 'blur'): void
}>()

const passwordVisible = ref(false)
const { model, errorMessage } = props.disableValidation
  ? {
      model: useVModel(props, 'modelValue', emit),
      errorMessage: undefined,
    }
  : useValidationModel(props, emit)
</script>
