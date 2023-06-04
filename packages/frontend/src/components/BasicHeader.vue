<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()

const emit = defineEmits(['back'])
</script>

<template>
  <div class="pb-4 pt-4">
    <div
      class="flex h-16 items-center rounded-lg bg-gray-50 p-2"
      @click="emit('back')"
    >
      <div class="shrink-0 px-2">
        <div class="p-2">
          <i class="fa-sharp fa-light fa-tent"></i>
        </div>
      </div>
      <div>
        <div
          v-if="subtitle"
          class="text-sm text-gray-400"
        >
          {{ subtitle }}
        </div>
        <div
          class="font-bold"
          :class="{ 'text-lg': !subtitle }"
        >
          {{ title }}
        </div>
        <slot
          v-if="$slots.content"
          name="content"
        />
      </div>
    </div>
  </div>
</template>
