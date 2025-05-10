<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <Toaster
    :position="isMobile ? 'top-center' : 'top-right'"
    rich-colors
  />
  <router-view />
</template>
