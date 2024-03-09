<script lang="ts" setup>
import { computed, ref } from 'vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import { CustomFieldTypeMapping, getEnumOptions, type CustomFieldType } from '@codeanker/api'

export interface ICustomFieldData {
  name: string
  description?: string
  type: CustomFieldType
  required: boolean
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

const typeOptions = ref(getEnumOptions(CustomFieldTypeMapping))
</script>

<template>
  <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
    <BasicInput
      v-model="model.name"
      label="Name"
      placeholder="Vornamen eingeben"
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
      placeholder="Nachname eingeben"
    />
  </div>

  <hr />
</template>
