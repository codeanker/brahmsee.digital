<script lang="ts" setup>
import { ref, computed } from 'vue'

import { Gender, GenderMapping, getEnumOptions } from '@codeanker/api/src/enumMappings'
import { BasicInputSelect, BasicInputDatepicker, BasicInputText } from '@codeanker/core-basic-inputs'

export interface IStammdaten {
  firstname: string
  lastname: string
  gender: Gender
  birthday: Date | null
}

const props = withDefaults(
  defineProps<{
    modelValue: IStammdaten
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: IStammdaten): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const identificationOptions = ref(getEnumOptions(GenderMapping))
</script>

<template>
  <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
    <BasicInputText
      v-model="model.firstname"
      label="Vorname"
      placeholder="Vornamen eingeben"
      required
    />
    <BasicInputText
      v-model="model.lastname"
      label="Nachname"
      placeholder="Nachname eingeben"
      required
    />
    <BasicInputSelect
      v-model="model.gender"
      label="Geschlecht"
      required
      :options="identificationOptions"
    />
    <BasicInputDatepicker
      v-model="model.birthday"
      label="Geburtsdatum"
      format="dd.MM.yyyy"
      required
      :disabled-dates="{
        from: new Date(),
      }"
      placeholder="Geburtsdatum auswählen"
    />
  </div>
</template>
