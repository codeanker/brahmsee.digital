<script lang="ts" setup>
import { computed } from 'vue'

export interface ITShirtBestellungen {
  firstname?: string
  lastname?: string
  gender?: 'MALE' | 'FEMALE' | 'UNSPECIFIED'
  birthday?: Date | null
}

const props = withDefaults(
  defineProps<{
    modelValue: ITShirtBestellungen
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: ITShirtBestellungen): void
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
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">{{ model }}</div>
  </div>
</template>
