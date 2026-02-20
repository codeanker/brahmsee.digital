<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

import useValidationModel from '../../composables/useValidationModel'

import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import { type BasicInputDefaultProps } from './defaultProps'
import cn from '@/helpers/cn'

export interface Option {
  label: string
  description?: string
  value: string | number
  disabled?: boolean
}

const props = defineProps<
  BasicInputDefaultProps<string | number | string[] | number[]> & {
    options: Option[]

    multiple?: boolean
  }
>()

const emit = defineEmits<{
  'update:modelValue': [string | number | undefined]
}>()
const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <div :id="id || name || label">
    <label
      v-if="label"
      :for="id || name || label"
    >
      <span>{{ label }}</span>
      <span
        v-if="required"
        class="text-danger-600"
      >
        *
      </span>
    </label>
    <Listbox
      v-model="model"
      as="div"
      :name="id || name || label"
      :multiple="props.multiple"
      :disabled="disabled"
    >
      <ListboxButton class="input-style !flex flex-row items-center gap-x-2 justify-between">
        <span :class="cn('text-start', { 'text-gray-500': disabled })">
          {{ options.find((option) => option.value === modelValue)?.label || placeholder || 'Bitte wählen...' }}
        </span>
        <ChevronDownIcon class="h-5 text-gray-500 self-end" />
      </ListboxButton>
      <div class="relative mt-1">
        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ListboxOption
              v-for="option in options"
              v-slot="{ active, selected }"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              <div
                :class="[
                  active ? 'bg-primary-600 text-white' : 'text-gray-900',
                  selected ? 'bg-primary-200' : '',
                  'relative cursor-default select-none px-3 py-2',
                  'flex flex-row gap-x-4 items-center',
                ]"
              >
                <CheckIcon
                  class="h-4"
                  :class="selected ? 'text-primary-600' : 'invisible'"
                />
                <div class="flex flex-col">
                  <span>{{ option.label }}</span>
                  <span class="text-xs mb-1">{{ option.description }}</span>
                </div>
              </div>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>
