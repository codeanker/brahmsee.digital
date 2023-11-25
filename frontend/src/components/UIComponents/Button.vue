<script setup lang="ts">
import { type RouterLinkProps } from 'vue-router'

type Color = 'primary' | 'secondary' | 'link' | 'success' | 'warning' | 'danger'
defineProps<Props>()

const colors: Record<Color, string> = {
  primary: 'text-white bg-primary-500 hover:bg-primary-600 focus:outline-primary-500',
  secondary: 'text-white bg-primary-300 hover:bg-primary-400 focus:outline-primary-500',
  link: 'text-primary-950 bg-transparent',
  success: '',
  warning: 'text-white bg-orange-500 hover:bg-orange-400 focus:outline-orange-500',
  danger: 'text-white bg-red-500 hover:bg-red-400 focus:outline-red-500',
}

interface Props {
  color: Color
  full?: boolean
  to?: RouterLinkProps['to']
}
</script>

<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    type="button"
    :class="
      [
        'block rounded-lg px-3 py-2 text-center text-sm font-medium',
        'focus:outline focus:outline-2 focus:outline-offset-2',
        'disabled:cursor-not-allowed',
        colors[color],
        full ? 'w-full' : 'w-auto',
      ].join(' ')
    "
    :to="to"
  >
    <slot></slot>
  </component>
</template>
