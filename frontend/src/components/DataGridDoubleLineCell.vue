<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<template>
  <div class="flex flex-col">
    <div class="text-base">{{ title }}</div>
    <div class="text-sm text-gray-500">{{ message }}</div>
  </div>
</template>
