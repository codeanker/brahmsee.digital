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
type Color = 'primary' | 'secondary' | 'warning' | 'danger' | 'info'
const colors: Record<Color, string> = {
  primary: 'text-white bg-primary-600 hover:bg-primary-500 disabled:bg-gray-400',
  secondary: 'bg-primary-200 hover:bg-primary-300 text-primary-800 disabled:bg-gray-400',
  warning: 'text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-yellow-600 disabled:bg-gray-400',
  danger: 'text-white bg-red-600 hover:bg-red-500 disabled:bg-red-500 focus:outline-red-600 disabled:bg-gray-400',
  info: 'text-white bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500 focus:outline-sky-600 disabled:bg-gray-400',
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
