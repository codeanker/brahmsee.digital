<script setup lang="ts">
import { computed } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import { KonfektionsgroesseMapping, getEnumOptions } from '@codeanker/api'

export interface ITShirtBestellung {
  bestellen: boolean
  groesse: keyof typeof KonfektionsgroesseMapping
}

const props = withDefaults(
  defineProps<{
    modelValue: ITShirtBestellung
    hideTitle?: boolean
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: ITShirtBestellung): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const konfektionsgroesseOptions = getEnumOptions(KonfektionsgroesseMapping)
</script>

<template>
  <div
    v-if="!hideTitle"
    class="font-medium mb-5"
  >
    T-Shirt Bestellung
  </div>
  <div class="flex flex-col gap-5 items-start">
    <BasicCheckbox
      v-model="model.bestellen"
      label="Ich möchte ein T-Shirt bestellen"
    />
    <BasicSelect
      v-if="model.bestellen"
      v-model="model.groesse"
      label="Konfektionsgröße"
      class="w-full"
      :options="konfektionsgroesseOptions"
    />
  </div>
</template>
