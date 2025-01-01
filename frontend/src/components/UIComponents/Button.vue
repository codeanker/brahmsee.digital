<script setup lang="ts">
import { type RouterLinkProps } from 'vue-router'

withDefaults(
  defineProps<{
    color?: Color
    to?: RouterLinkProps['to']
    full?: boolean
    disabled?: boolean
  }>(),
  {
    color: 'primary',
    size: 'sm',
    full: false,
    disabled: false,
  }
)
type Color = 'primary' | 'secondary' | 'warning' | 'danger'
const colors: Record<Color, string> = {
  primary: 'text-white bg-primary-600 hover:bg-primary-500',
  secondary: 'bg-primary-200 hover:bg-primary-300 text-primary-800',
  warning: 'text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-yellow-600',
  danger: 'text-white bg-red-600 hover:bg-red-500 disabled:bg-red-500 focus:outline-red-600',
}
</script>

<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    type="button"
    :disabled="disabled"
    :class="[{ 'w-full justify-center': full, 'hover:cursor-not-allowed': disabled }, colors[color]]"
    class="space-x-2 rounded-lg transition text-center leading-5 text-base cursor-pointer focus:outline-none focus:ring-0 py-2 px-4"
    :to="to"
  >
    <slot />
  </component>
</template>
