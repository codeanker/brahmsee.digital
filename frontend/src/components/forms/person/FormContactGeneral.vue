<script setup lang="ts">
import { computed } from 'vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputPhoneNumber from '@/components/BasicInputs/BasicInputPhoneNumber.vue'

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
  'update:modelValue': [IContact]
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
    <BasicInputPhoneNumber
      v-model="model.telefon"
      label="Telefonnummer"
      placeholder="Telefonnummer"
      required
    />
  </div>
</template>
