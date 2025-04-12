<script setup lang="ts">
import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="bg-white rounded-lg p-4 grid grid-cols-switch text-left border-2 border-danger-500 shadow">
    <ShieldExclamationIcon class="size-8 mr-4 text-danger-500" />
    <p class="text-danger-500 font-medium">{{ title }}</p>
    <p class="col-start-2">
      <slot />
    </p>
  </div>
</template>
