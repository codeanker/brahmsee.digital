<script lang="ts" setup>
import { ref, computed } from 'vue'

import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import { type Gender, GenderMapping, getEnumOptions } from '@codeanker/api'

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
  'update:modelValue': [IStammdaten]
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
    <BasicInput
      v-model="model.firstname"
      label="Vorname"
      placeholder="Vornamen eingeben"
      required
    />
    <BasicInput
      v-model="model.lastname"
      label="Nachname"
      placeholder="Nachname eingeben"
      required
    />
    <BasicSelect
      v-model="model.gender"
      label="Geschlecht"
      required
      :options="identificationOptions"
    />
    <BasicDatepicker
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
