<script setup lang="ts">
import { useRoute } from 'vue-router'

import PublicHeaderBg from '@/components/LayoutComponents/PublicHeaderBg.vue'

const route = useRoute()
</script>

<template>
  <div class="w-full lg:h-full flex flex-col lg:grid lg:grid-cols-2 bg-white lg:overflow-hidden">
    <div class="hidden lg:block h-full overflow-y-auto">
      <router-view />
    </div>
    <PublicHeaderBg
      class="lg:block shrink-0"
      :class="{ hidden: route.meta?.hidePublicHeaderBgOnMobile }"
    />
    <div class="block lg:hidden p-6">
      <router-view />
    </div>
  </div>
</template>
