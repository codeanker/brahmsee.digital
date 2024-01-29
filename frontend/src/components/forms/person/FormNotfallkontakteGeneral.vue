<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import Button from '@/components/UIComponents/Button.vue'
import KontaktItem from '@/components/UIComponents/KontaktItem.vue'
import type { TKontaktSchema } from '@codeanker/api/src/services/kontakt/schema/kontakt.schema'

export interface INotfallKontakte {
  personen: TKontaktSchema[]
}

const props = withDefaults(
  defineProps<{
    modelValue: INotfallKontakte
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: INotfallKontakte): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const personTemplate = ref<TKontaktSchema>({
  firstname: '',
  lastname: '',
  telefon: '',
  istErziehungsberechtigt: false,
})
</script>

<template>
  <p class="font-medium mb-5">Notfallkontakte</p>

  <div
    v-for="(_notfallkontaktPerson, index) in model.personen"
    :key="index"
  >
    <KontaktItem
      v-model="model.personen[index]"
      show-remove-option
      @remove="model.personen.splice(index, 1)"
    />
    <hr
      v-if="index < model.personen.length - 1"
      class="my-5"
    />
  </div>

  <Button
    color="secondary"
    class="mt-5 flex flex-row items-center justify-center w-full"
    @click="model.personen.push(personTemplate)"
  >
    <PlusIcon class="h-5 mr-2" />
    <span>Notfallkontakt hinzufügen</span>
  </Button>
</template>
