<script setup lang="ts">
import { useRoute } from 'vue-router'

import PublicHeaderBg from '@/components/LayoutComponents/PublicHeaderBg.vue'

const route = useRoute()
</script>

<template>
  <div class="relative flex flex-col lg:grid lg:grid-cols-2 bg-white">
    <PublicHeaderBg
      class="lg:block relative h-72 lg:h-screen lg:sticky lg:top-0 shrink-0"
      :class="{ hidden: route.meta?.hidePublicHeaderBgOnMobile }"
    />
    <div class="relative p-6 lg:h-full">
      <router-view />
    </div>
  </div>
</template>
