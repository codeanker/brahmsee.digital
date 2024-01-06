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
        placeholder="Geburtsdatum auswählen"
      />
    </div>
  </div>
</template>
