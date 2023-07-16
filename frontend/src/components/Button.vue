<template>
  <button
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
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
const colors: Record<Color, string> = {
  primary: 'text-white bg-green-600 hover:bg-green-500 focus:outline-green-600',
  secondary: 'text-white bg-secondary-500 hover:bg-secondary-400 focus:outline-secondary-500',
  success: '',
  warning: 'text-white bg-orange-500 hover:bg-orange-400 focus:outline-orange-500',
  danger: 'text-white bg-red-500 hover:bg-red-400 focus:outline-red-500',
}

defineProps({
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  full: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
