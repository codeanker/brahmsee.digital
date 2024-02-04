<script setup lang="ts">
defineProps<{
  infos: {
    title: string
    value: string
    small?: boolean
  }[]
}>()
</script>

<template>
  <div
    v-for="info in infos"
    :key="info.title"
    class="odd:bg-gray-50 dark:odd:bg-gray-900 grid grid-cols-2 gap-3 rounded-lg min-h-[50px] px-3"
  >
    <div class="font-medium flex items-center">
      {{ info.title }}
    </div>
    <div
      class="flex items-center"
      :class="{ 'text-xs': info.small }"
      v-html="info.value"
    ></div>
  </div>
</template>
