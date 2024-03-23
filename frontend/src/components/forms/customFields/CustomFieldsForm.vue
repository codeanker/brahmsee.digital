<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect, { type Option } from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import { CustomFields, CustomFieldsMapping, type CustomFieldType } from '@codeanker/api'

export interface ICustomFieldData {
  name: string
  description?: string
  type: CustomFieldType
  required: boolean
  options: string[]
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
const field = computed(() => CustomFields.find((f) => f.name === model.value.type))
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
    <div class="col-span-full">
      <BasicCheckbox
        v-model="model.required"
        label="Erforderlich?"
      />
    </div>

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
        v-for="(_, index) in model.options"
        :key="index"
        class="flex flex-row items-end gap-x-5"
      >
        <BasicInput
          v-model="model.options[index]"
          :label="`Option #${index + 1}`"
          placeholder="Lorem Ipsum"
          class="flex-1"
        />
        <Button
          color="danger"
          @click="model.options.splice(index, 1)"
        >
          <TrashIcon class="h-5" />
        </Button>
      </div>
    </div>
  </div>
</template>
