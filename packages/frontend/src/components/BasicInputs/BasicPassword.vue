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
          <i class="fa-sharp fa-light fa-tent fa-xl w-auto text-white"></i>
          <i
            v-if="passwordVisible"
            class="fa-sharp fa-light fa-eye text-primary"
            fixed-width
          ></i>
          <i
            v-else
            class="fa-sharp fa-light fa-eye-slash text-primary"
            fixed-width
          ></i>
        </button>
      </div>
    </div>
  </BasicFormGroup>
</template>

<script setup lang="ts">
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
