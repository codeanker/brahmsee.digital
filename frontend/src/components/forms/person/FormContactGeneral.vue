<script setup lang="ts">
import { computed } from 'vue'

import { BasicInputText, BasicInputPhone } from '@codeanker/core-basic-inputs'

export interface IContact {
  email: string
  telefon: string
}

const props = withDefaults(
  defineProps<{
    modelValue: IContact
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: IContact): void
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
  <div class="flex flex-col gap-y-5">
    <BasicInputText
      v-model="model.email"
      type="email"
      label="E-Mail"
      placeholder="Vornamen eingeben"
      required
    />
    <BasicInputPhone
      v-model="model.telefon"
      label="Telefonnummer"
      placeholder="Nachname eingeben"
      required
    />
  </div>
</template>
