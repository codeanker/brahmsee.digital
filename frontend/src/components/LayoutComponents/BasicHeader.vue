<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()

const emit = defineEmits<{
  (event: 'back'): void
}>()
</script>

<template>
  <div class="mb-8">
    <div
      class="grid grid-cols-[64px_auto] items-center gap-4 rounded-lg bg-gray-50 p-4 shadow md:flex md:flex-row"
      @click="emit('back')"
    >
      <div class="justify-self-center px-4">
        <slot name="icon"></slot>
      </div>
      <div class="flex-1">
        <div class="text-lg font-bold">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="mt-2 text-sm text-gray-500"
        >
          {{ subtitle }}
        </div>
      </div>

      <div class="col-span-2 justify-self-end md:mr-0">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
