<template>
  <div :id="id || name || label">
    <label
      v-if="label"
      class="mb-2 block text-sm font-medium leading-6"
      :for="id || name || label"
      >{{ label }}</label
    >
    <Listbox
      v-model="model"
      as="div"
      :name="id || name || label"
    >
      <ListboxButton class="input-style flex items-center justify-between">
        {{ options.find((option) => option.value === modelValue)?.label || placeholder || 'Bitte wählen...' }}
        <i class="fa-sharp fa-light fa-angle-down text-gray-500"></i>
      </ListboxButton>
      <div class="relative mt-1">
        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ListboxOption
              v-for="option in options"
              v-slot="{ active }"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              <div
                :class="[
                  active ? 'bg-primary-600 text-white' : 'text-gray-900',
                  'relative cursor-default select-none px-3 py-2',
                ]"
              >
                {{ option.label }}
              </div>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import useValidatedModel from '../../composables/useValidatedModel'
import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { RuleFunction } from '@codeanker/validation'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    options: { label: string; value: string | number; disabled?: boolean }[]

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
    placeholder: undefined,
    id: '',
    label: '',
    name: '',
    rules: undefined,
    required: false,
  }
)
const emit = defineEmits(['update:modelValue'])
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
