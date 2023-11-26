<script lang="ts" setup>
import { ref, computed } from 'vue'

import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'

export interface IStammdaten {
  firstname?: string
  lastname?: string
  gender?: 'MALE' | 'FEMALE' | 'UNSPECIFIED'
  birthday?: Date | null
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

const identificationOptions = ref([
  {
    label: 'Männlich',
    value: 'm',
  },
  {
    label: 'Weiblich',
    value: 'w',
  },
  {
    label: 'Divers',
    value: 'd',
  },
])
</script>

<template>
  <div>
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicSelect
        v-model="model.gender"
        label="Geschlecht"
        :options="identificationOptions"
      />
      <BasicInput
        v-model="model.firstname"
        label="Vorname"
        placeholder="Vornamen eingeben"
      />
      <BasicInput
        v-model="model.lastname"
        label="Nachname"
        placeholder="Nachname eingeben"
      />
      <BasicDatepicker
        v-model="model.birthday"
        label="Geburtsdatum"
        placeholder="Geburtsdatum auswählen"
      />
    </div>
    <hr class="my-5" />
    <!-- <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="model.street"
        label="Straße und Hausnummer"
        placeholder="Straße und Hausnummer eingeben"
      />
      <BasicInput
        v-model="model.number"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
      />
      <BasicInput
        v-model="model.zip"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
      />
      <BasicInput
        v-model="model.city"
        label="Ort"
        placeholder="Ort eingeben"
      />
    </div> -->
  </div>
</template>
