<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import Button from '@/components/UIComponents/Button.vue'
import KontaktItem from '@/components/UIComponents/KontaktItem.vue'
import type { TKontaktSchema } from '@codeanker/api'

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
  'update:modelValue': (eventArgs: INotfallKontakte) => void
}>()

const model = computed({
  get() {
    const model = props.modelValue
    if (props.modelValue.personen.length === 0) {
      model.personen.push(personTemplate.value)
    }
    return model
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
      :show-remove-option="model.personen.length > 1"
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
