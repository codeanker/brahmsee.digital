<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useMediaQuery } from '@vueuse/core'
import { Toaster } from 'vue-sonner'

const isMobile = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <Toaster
    :position="isMobile ? 'top-center' : 'top-right'"
    rich-colors
  />
  <router-view />

  <VueQueryDevtools />
</template>
