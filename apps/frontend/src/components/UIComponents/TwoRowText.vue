<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div>
    <span>{{ title }}</span>
    <br />
    <span
      class="text-sm"
      v-html="subtitle"
    />
  </div>
</template>
