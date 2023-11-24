<script setup lang="ts">
withDefaults(
  defineProps<{
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    size: 'sm' | 'md' | 'lg'
  }>(),
  {
    color: 'primary',
    size: 'md',
  }
)
</script>

<template>
  <span
    :class="`before:bg-${color}-100 after:bg-${color}-100 before:w-${size} before:h-${size} after:w-${size} after:h-${size}`"
  ></span>
</template>

<style>
.loader {
  display: inline-block;
  position: relative;
}
.loader::after,
.loader::before {
  content: '';
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  animation: animloader 2s linear infinite;
}
.loader::after {
  animation-delay: 1s;
}

@keyframes animloader {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
