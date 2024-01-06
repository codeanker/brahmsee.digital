<script setup lang="ts">
// import { faEye, faEyeSlash } from '@fortawesome/pro-duotone-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
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

<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :required="required"
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
          <EyeSlashIcon
            v-if="passwordVisible"
            class="w-6 h-6 stroke-primary-700"
          ></EyeSlashIcon>
          <EyeIcon
            v-else
            class="w-6 h-6 stroke-primary-700"
          ></EyeIcon>
        </button>
      </div>
    </div>
  </BasicFormGroup>
</template>
