<script lang="ts" setup>
import { PlusSmallIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import Button from '@/components/UIComponents/Button.vue'

export interface INotfallkontakte {
  notfallkontakt?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: INotfallkontakte
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: INotfallkontakte): void
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
  <div>
    {{ model }}
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <div class="font-medium mb-5">Notfallkontakte</div>
      <Button color="secondary"><PlusSmallIcon class="h-5 mr-2" />Notfallkontakt hinzufügen</Button>
    </div>
  </div>
</template>
