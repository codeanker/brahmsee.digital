<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import { getCustomFieldIcon } from '@/helpers/getCustomFieldIcon'
import {
  CustomFieldPositionMapping,
  CustomFieldTypeMapping,
  getEnumOptions,
  type CustomFieldPosition,
  type CustomFieldType,
} from '@codeanker/api'

export interface ICustomFieldData {
  name: string
  description?: string
  type: CustomFieldType
  required: boolean
  options: string[]
  positions: CustomFieldPosition[]
}

const props = withDefaults(
  defineProps<{
    modelValue: ICustomFieldData
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: ICustomFieldData): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const typeOptions = getEnumOptions(CustomFieldTypeMapping)
const positionOptions = ref(getEnumOptions(CustomFieldPositionMapping))

const getFieldTypeHuman = computed(() => (fieldType) => {
  return typeOptions.find((m) => m.value === fieldType)?.label
})

const hasOptions = computed(
  () =>
    model.value.type === 'BASIC_RADIO' || model.value.type === 'BASIC_SELECT' || model.value.type === 'BASIC_DROPDOWN'
)
// const field = computed(() => CustomFieldType.find((f) => f.name === model.value.type))

function moveOptionUp(index: number) {
  const rows = [model.value.options[index - 1], model.value.options[index]]
  model.value.options.splice(index - 1, 2, rows[1], rows[0])
}

function moveOptionDown(index: number) {
  const rows = [model.value.options[index], model.value.options[index + 1]]
  model.value.options.splice(index, 2, rows[1], rows[0])
}
</script>

<template>
  <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
    <BasicInput
      v-model="model.name"
      label="Name"
      placeholder="Name für das Feld"
      required
    />
    <BasicDropdown
      :right="false"
      :append="true"
      label="Feldtyp"
      button-style="w-full min-w-52 text-left"
    >
      <template #buttonContent>
        <button
          type="button"
          class="input-style w-full block text-left flex justify-between items-center hover:cursor-pointer"
        >
          <slot>
            <div class="flex space-x-2 items-center">
              <img
                :src="getCustomFieldIcon(model.type)"
                class="h-5 w-5 mr-1"
              />
              <span v-if="getFieldTypeHuman(model.type)">{{ getFieldTypeHuman(model.type) }}</span>
              <span
                v-else
                class="text-gray-500"
                >Bitte wählen</span
              >
            </div>
          </slot>
          <ChevronDownIcon class="h-5 text-gray-500" />
        </button>
      </template>
      <template #dropdownContent>
        <MenuItem
          as="div"
          class=""
        >
          <button
            v-for="typeOption in typeOptions"
            :key="typeOption.value"
            type="button"
            class="hover:bg-primary-50 dark:hover:bg-slate-950 rounded items-center flex py-2 px-4 w-full space-x-2 text-left"
            @click="model.type = typeOption.value"
          >
            <img
              :src="getCustomFieldIcon(typeOption.value)"
              class="h-5 w-5 mr-1"
            />
            <div>
              <div>{{ typeOption.label }}</div>
              <div class="text-xs text-gray-500">{{ typeOption.description }}</div>
            </div>
          </button>
        </MenuItem>
      </template>
    </BasicDropdown>
    <BasicInput
      v-model="model.description"
      class="col-span-full"
      label="Beschreibung"
      placeholder="Eine Beschreibung oder ein Hilfstext"
    />
    <BasicSelect
      v-model="model.positions"
      class="col-span-full"
      label="Positionen"
      :options="positionOptions"
      multiple
      required
    />
    <div>
      <label
        for="required"
        class="font-medium"
      >
        Erforderlich?
      </label>
      <BasicSwitch
        v-model="model.required"
        name="required"
        label="Soll dieses Feld verpflichtend sein?"
        class="mt-2"
      />
    </div>

    <div
      v-if="hasOptions"
      class="col-span-full flex flex-col gap-5"
    >
      <hr class="mt-5" />

      <div class="flex flex-row items-center justify-between">
        <p class="font-medium">Optionen</p>
        <Button
          color="secondary"
          @click="model.options.push('')"
        >
          Weitere Option hinzufügen
        </Button>
      </div>

      <div
        v-for="(option, index) in model.options"
        :key="index"
        class="flex flex-row items-end gap-x-5"
      >
        <div class="flex flex-col gap-y-2">
          <button
            type="button"
            class="disabled:text-gray-400 disabled:cursor-not-allowed"
            :disabled="index === 0"
            tabindex="-1"
            @click="moveOptionUp(index)"
          >
            <ChevronUpIcon class="h-4" />
          </button>
          <button
            type="button"
            class="disabled:text-gray-400 disabled:cursor-not-allowed"
            :disabled="index === model.options.length - 1"
            tabindex="-1"
            @click="moveOptionDown(index)"
          >
            <ChevronDownIcon class="h-4" />
          </button>
        </div>
        <BasicInput
          v-model="model.options[index]"
          :label="`#${index + 1} Option`"
          placeholder="Lorem Ipsum"
          class="flex-1"
          required
        />
        <Button
          color="danger"
          @click="model.options.splice(index, 1)"
        >
          <TrashIcon class="h-5" />
        </Button>
      </div>

      <hr class="mt-5" />
    </div>
  </div>
</template>
