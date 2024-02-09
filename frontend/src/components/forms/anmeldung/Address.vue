<script lang="ts" setup>
import { computed } from 'vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'

export interface IAddress {
  street: string
  number: string
  zip: string
  city: string
}

const props = withDefaults(
  defineProps<{
    modelValue: IAddress
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: IAddress): void
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
  <div>
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="model.street"
        label="Straße"
        placeholder="Straße eingeben"
        class="grow"
        required
      />
      <BasicInput
        v-model="model.number"
        label="Hausnummer"
        placeholder="Hausnummer eingeben"
        required
      />
      <BasicInput
        v-model="model.zip"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
        required
      />
      <BasicInput
        v-model="model.city"
        label="Ort"
        placeholder="Ort eingeben"
        required
      />
    </div>
  </div>
</template>
