<script setup lang="ts">
import { type RouterLinkProps } from 'vue-router'

withDefaults(
  defineProps<{
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    to?: RouterLinkProps['to']
    full?: boolean
  }>(),
  {
    color: 'primary',
    size: 'sm',
    full: false,
  }
)
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
const colors: Record<Color, string> = {
  primary: 'text-white bg-primary-600 hover:bg-primary-500 focus:outline-primary-600',
  secondary: 'bg-primary-200 hover:bg-primary-300 focus:outline-primary-600 text-primary-600',
  success: '',
  warning: 'text-white bg-orange-600 hover:bg-orange-500 focus:outline-orange-600',
  danger: 'text-white bg-red-600 hover:bg-red-500 focus:outline-red-600',
}
</script>

<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    type="button"
    :class="[{ 'w-full justify-center': full }, colors[color]]"
    class="btn flex space-x-2 rounded-lg"
    :to="to"
  >
    <slot></slot>
  </component>
</template>
