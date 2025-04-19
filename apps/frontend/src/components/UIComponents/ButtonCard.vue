<script lang="ts" setup>
import type { Component } from 'vue'

defineProps<{
  to?: string
  icon?: Component
  badge?: Component
  title: string
  description?: string
}>()
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'div'"
    :to="to ? { name: to } : null"
    class="w-full relative p-4 overflow-hidden space-x-3 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-600 group"
  >
    <component
      :is="icon"
      v-if="icon"
      class="size-8 transition-all ease-in-out group-hover:text-primary-600"
    />
    <div>
      <div class="font-medium text-lg transition-all ease-in-out group-hover:text-primary-600">{{ title }}</div>
      <div>{{ description }}</div>
    </div>
    <div
      class="absolute top-0 right-0 flex items-center rounded-bl-lg overflow-hidden"
      aria-hidden="true"
    >
      <component :is="badge" />
    </div>
  </component>
</template>
