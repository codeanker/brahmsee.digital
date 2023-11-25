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
    class="even:bg-gray-50 text-sm grid grid-cols-2 gap-3 rounded-lg min-h-[50px] px-3"
  >
    <div class="font-medium flex items-center">
      {{ info.title }}
    </div>
    <div
      class="flex items-center"
      :class="{ 'text-xs': info.small }"
    >
      {{ info.value }}
    </div>
  </div>
</template>
