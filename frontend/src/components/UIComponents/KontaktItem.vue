<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

import BasicCheckbox from '../BasicInputs/BasicCheckbox.vue'
import BasicInputPhoneNumber from '../BasicInputs/BasicInputPhoneNumber.vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import type { TKontaktSchema } from '@codeanker/api'

const props = defineProps<{
  modelValue: Partial<TKontaktSchema>
  showRemoveOption?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': (value: Partial<TKontaktSchema>) => void
  remove: () => void
}>()

const kontakt = ref(props.modelValue)

watch(
  kontakt,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  {
    deep: true,
  }
)
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
    <BasicInput
      v-model="kontakt.firstname"
      label="Vorname"
      placeholder="Vorname eingeben"
      required
    />
    <BasicInput
      v-model="kontakt.lastname"
      label="Nachname"
      placeholder="Nachname eingeben"
      required
    />
    <BasicInputPhoneNumber
      v-model="kontakt.telefon"
      label="Mobiltelefonnummer"
      placeholder="Mobiltelefonnummer eingeben"
      required
    />
    <div
      class="flex flex-row justify-between items-end h-full"
      :class="{ 'justify-end': showRemoveOption }"
    >
      <BasicCheckbox
        v-model="kontakt.istErziehungsberechtigt"
        label="Erziehungsberechtigt?"
      />
      <a
        v-if="showRemoveOption"
        class="text-red-600 hover:underline mb-2 cursor-pointer text-sm flex items-center"
        @click="emit('remove')"
      >
        <TrashIcon class="h-5 mr-2" />
        Entfernen
      </a>
    </div>
  </div>
</template>
