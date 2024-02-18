<script setup lang="ts">
import { computed } from 'vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'

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
    <BasicInput
      v-model="model.email"
      type="email"
      label="E-Mail"
      placeholder="Email-Adresse"
      required
    />
    <BasicInput
      v-model="model.telefon"
      type="tel"
      label="Telefonnummer"
      placeholder="Telefonnummer"
      required
    />
  </div>
</template>
