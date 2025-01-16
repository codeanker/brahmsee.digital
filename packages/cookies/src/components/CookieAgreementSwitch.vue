<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps<{
  id?: string
  name?: string
  label?: string
  modelValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': (value: boolean) => void
}>()

const model = computed<boolean>({
  get() {
    return props.modelValue ?? false
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <div>
    <Switch
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      type="checkbox"
      class="checkbox"
      :disabled="disabled"
      :class="[
        model ? 'bg-green-600' : 'bg-gray-200',
        'focus:ring-green-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
      ]"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="[
          model ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        ]"
      />
    </Switch>
    <label
      v-if="label"
      class="ml-2"
      :for="id || name || label"
      >{{ label }}</label
    >
  </div>
</template>
