<script setup lang="ts">
import { type RouterLinkProps } from 'vue-router'

withDefaults(
  defineProps<{
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    to?: RouterLinkProps['to']
  }>(),
  {
    color: 'primary',
    size: 'sm',
  }
)
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
const colors: Record<Color, string> = {
  primary: 'text-white bg-primary-500 hover:bg-primary-600 focus:outline-primary-500',
  secondary: 'bg-primary-200 hover:bg-primary-300 focus:outline-primary-500 text-primary-600',
  success: '',
  warning: 'text-white bg-orange-500 hover:bg-orange-400 focus:outline-orange-500',
  danger: 'text-white bg-red-500 hover:bg-red-400 focus:outline-red-500',
}
</script>

<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    type="button"
    :class="colors[color]"
    class="btn w-full rounded-xl"
    :to="to"
  >
    <slot></slot>
  </component>
</template>
