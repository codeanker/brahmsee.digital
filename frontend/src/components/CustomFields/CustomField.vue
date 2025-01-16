<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicRadio from '@/components/BasicInputs/BasicRadio.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import { type CustomField } from '@codeanker/api'

const props = defineProps<{
  field: CustomField
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': (value: any) => void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <BasicInput
    v-if="field.type === 'BASIC_INPUT'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicTextArea
    v-if="field.type === 'BASIC_TEXT_AREA'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicEditor
    v-if="field.type === 'BASIC_EDITOR'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicSwitch
    v-if="field.type === 'BASIC_SWITCH'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicCheckbox
    v-if="field.type === 'BASIC_CHECKBOX'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicInputNumber
    v-if="field.type === 'BASIC_INPUT_NUMBER'"
    v-model="model"
    :label="field.name"
    :required="field.required"
  />
  <BasicRadio
    v-if="field.type === 'BASIC_RADIO'"
    v-model="model"
    :label="field.name"
    :required="field.required"
    :options="field.options.map((o) => ({ label: o, value: o }))"
  />
  <BasicSelect
    v-if="field.type === 'BASIC_SELECT'"
    v-model="model"
    :label="field.name"
    :required="field.required"
    :options="field.options.map((o) => ({ label: o, value: o }))"
  />
  <BasicDropdown
    v-if="field.type === 'BASIC_DROPDOWN'"
    :label="field.name"
    :required="field.required"
    :right="false"
    :append="true"
    class="w-full"
    button-style="w-full text-left"
  >
    <template #buttonContent>
      <button
        type="button"
        class="input-style w-full text-left flex justify-between items-center"
      >
        <slot>
          <div class="flex space-x-2 items-center">
            <span>{{ model ?? 'Bitte auswählen…' }}</span>
          </div>
          <ChevronDownIcon class="h-5 text-gray-500" />
        </slot>
      </button>
    </template>
    <template #dropdownContent>
      <MenuItem as="div">
        <button
          v-for="status in field.options"
          :key="status"
          type="button"
          class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
          @click="model = status"
        >
          <span>{{ status }}</span>
        </button>
      </MenuItem>
    </template>
  </BasicDropdown>
</template>
