<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import type { TKontaktSchema } from '@codeanker/api/src/services/kontakt/schema/kontakt.schema'

const props = defineProps<{
  modelValue: Partial<TKontaktSchema>
  showNotfallKontakt?: boolean
  showRemoveOption?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Partial<TKontaktSchema>): void
  (event: 'remove'): void
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
    />
    <BasicInput
      v-model="kontakt.lastname"
      label="Nachname"
      placeholder="Nachname eingeben"
    />
    <BasicInput
      v-model="kontakt.telefon"
      label="Mobiltelefonnummer"
      placeholder="Mobiltelefonnummer eingeben"
    />
    <div
      class="flex items-end h-full"
      :class="{ 'justify-end': showRemoveOption }"
    >
      <BasicCheckbox
        v-if="showNotfallKontakt"
        v-model="kontakt.isNotfallKontakt"
        label="Ist ein Notfallkontakt"
        class="mb-2"
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
