<script setup lang="ts">
import cn from '@/helpers/cn'

defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div className="h-1.5 w-full overflow-hidden bg-primary-700/20">
    <div :class="cn('size-full origin-left-right bg-primary-700/80', { 'animate-progress': active })"></div>
  </div>
</template>
