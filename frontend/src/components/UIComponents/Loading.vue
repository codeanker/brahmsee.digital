<script setup lang="ts">
import { SunIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'white'
    size: 'sm' | 'md' | 'lg'
  }>(),
  {
    color: 'primary',
    size: 'sm',
  }
)
const getSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return '6'
    case 'md':
      return '12'
    case 'lg':
      return '24'
    default:
      return '6'
  }
})

const getColor = computed(() => {
  switch (props.color) {
    case 'white':
      return 'white'
    default:
      return props.color + '-600'
  }
})
</script>

<template>
  <SunIcon
    class="spinner inline-block"
    :class="`w-${getSize} h-${getSize} text-${getColor}`"
  ></SunIcon>
</template>

<style scoped>
.spinner {
  animation: rotateMe 2s linear infinite;
}

@keyframes rotateMe {
  0% {
    transform: rotate(-360deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
