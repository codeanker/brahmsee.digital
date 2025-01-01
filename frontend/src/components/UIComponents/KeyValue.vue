<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    keyText: string
    valueText: string | number
    icon?: Component
  }>(),
  {
    keyText: 'keyText',
    valueText: 'value',
  }
)
</script>

<template>
  <div class="flex items-center space-x-2">
    <component
      :is="icon"
      class="w-5 h-5"
    />
    <p class="m-0">{{ keyText }}: {{ valueText }}</p>
  </div>
</template>
