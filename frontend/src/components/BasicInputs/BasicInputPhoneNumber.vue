<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils'
import { onMounted, onUnmounted, ref } from 'vue'

import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<string> & {
      inputClass?: string
      disableValidation?: boolean
    }
  >(),
  {
    type: 'number',
    autocapitalize: 'off',
    inputClass: '',
    disableValidation: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': (eventArgs: string | undefined) => void
  focus: () => void
  blur: () => void
}>()
const { model, errorMessage } = props.disableValidation
  ? {
      model: useVModel(props, 'modelValue', emit),
      errorMessage: undefined,
    }
  : useValidationModel(props, emit)

let intl: any = null
const phone = ref()
onMounted(async () => {
  // await import('intl-tel-input/build/js/utils.js')
  intl = intlTelInput(phone.value, {
    separateDialCode: true,
    strictMode: true,
    initialCountry: 'de',
    autoPlaceholder: 'off',
  })
})

onUnmounted(() => {
  intl?.destroy()
})
</script>

<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :required="required"
    :error-message="errorMessage"
  >
    <div class="intl-tel-wrapper">
      <input
        :id="id || name || label"
        ref="phone"
        :value="model"
        type="tel"
        :placeholder="placeholder || label || name"
        :class="inputClass"
        :name="id || name || label"
        :disabled="disabled"
      />
    </div>
    <template #label>
      <slot name="label" />
    </template>
  </BasicFormGroup>
</template>

<style lang="scss">
@import 'intl-tel-input/build/css/intlTelInput.css';
.intl-tel-wrapper {
  .iti {
    @apply block w-full;
    .form-control {
      @apply block w-full;
    }
  }
}
</style>
