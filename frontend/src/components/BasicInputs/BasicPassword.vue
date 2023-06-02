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
      />
      <div class="flex-shrink-0">
        <button
          type="button"
          class="btn rounded-l-none border border-solid border-gray-100 bg-gray-100"
          @click="passwordVisible = !passwordVisible"
        >
          <FontAwesomeIcon
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
          />
        </button>
      </div>
    </div>
  </BasicFormGroup>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/pro-duotone-svg-icons'
import useValidatedModel from '../../composables/useValidatedModel'
import { ref } from 'vue'
import BasicFormGroup from './components/BasicFormGroup.vue'
import { RuleFunction } from '@codeanker/validation'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/no-unused-properties
    rules?: RuleFunction[]
    // eslint-disable-next-line vue/no-unused-properties
    required?: RequiredRulesParams
  }>(),
  {
    placeholder: '',
    id: '',
    label: '',
    name: '',
    rules: undefined,
    required: false,
  }
)
const emit = defineEmits(['update:modelValue'])
const { model, errorMessage } = useValidatedModel(props, emit)

const passwordVisible = ref(false)
</script>
