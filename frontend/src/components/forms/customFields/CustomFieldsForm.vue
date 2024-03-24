<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect, { type Option } from '@/components/BasicInputs/BasicSelect.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import {
  CustomFieldPositionMapping,
  CustomFields,
  CustomFieldsMapping,
  getEnumOptions,
  CustomFieldPosition,
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

const typeOptions = ref<Option[]>(CustomFieldsMapping)
const positionOptions = ref(getEnumOptions(CustomFieldPositionMapping))

const field = computed(() => CustomFields.find((f) => f.name === model.value.type))

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
    <BasicSelect
      v-model="model.type"
      label="Typ"
      required
      :options="typeOptions"
    />
    <BasicInput
      v-model="model.description"
      class="col-span-full"
      label="Beschreibung"
      placeholder="Eine Beschreibung oder ein Hilfstext"
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
    <BasicSelect
      v-model="model.positions"
      label="Positionen"
      :options="positionOptions"
      multiple
      required
    />

    <div
      v-if="field?.hasOptions"
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
        :key="option"
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
          :label="`Option #${index + 1}`"
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
