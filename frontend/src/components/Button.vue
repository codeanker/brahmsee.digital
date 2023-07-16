<template>
  <component
    :is="to === undefined ? 'button' : 'router-link'"
    type="button"
    :class="
      [
        'block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm',
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

<script setup lang="ts">
import { RouterLinkProps } from 'vue-router'

type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
const colors: Record<Color, string> = {
  primary: 'text-white bg-green-600 hover:bg-green-500 focus:outline-green-600',
  secondary: 'text-white bg-secondary-500 hover:bg-secondary-400 focus:outline-secondary-500',
  success: '',
  warning: 'text-white bg-orange-500 hover:bg-orange-400 focus:outline-orange-500',
  danger: 'text-white bg-red-500 hover:bg-red-400 focus:outline-red-500',
}

interface Props {
  color: Color
  full?: boolean
  to?: RouterLinkProps['to']
}

defineProps<Props>()
</script>
