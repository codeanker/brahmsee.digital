<script setup lang="ts">
import { type StatusColors } from '@/helpers/getAccountStatusColors'

withDefaults(
  defineProps<{
    color?: StatusColors
  }>(),
  {
    color: 'muted',
  }
)

const colors: Record<StatusColors, string> = {
  muted: 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-300',
  primary: 'bg-primary-600 text-white ring-primary-500/10',
  secondary: 'bg-primary-50 text-primary-600 ring-primary-500/10',
  warning: 'bg-yellow-50 text-yellow-600 ring-yellow-500/10',
  danger: 'bg-red-50 text-red-600 ring-red-500/10',
}
</script>

<template>
  <span
    class="whitespace-nowrap inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
    :class="[colors[color]]"
  >
    <slot></slot>
  </span>
</template>
