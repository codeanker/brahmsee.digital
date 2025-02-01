<script setup lang="ts">
import { useRoute } from 'vue-router'

import PublicHeaderBg from '@/components/LayoutComponents/PublicHeaderBg.vue'

const route = useRoute()
</script>

<template>
  <div
    class="flex flex-col lg:grid lg:grid-cols-3 2xl:grid-cols-2 bg-white dark:bg-dark-primary min-h-screen transition-colors duration-200"
  >
    <PublicHeaderBg
      class="lg:block relative h-72 lg:h-screen lg:sticky lg:top-0 shrink-0 lg:order-2 lg:col-span-1 2xl:col-span-1"
      :class="{ hidden: route.meta?.hidePublicHeaderBgOnMobile }"
    />
    <div
      class="p-6 lg:order-1 lg:col-span-2 2xl:col-span-1 flex flex-col grow"
      :class="{ 'h-screen': route.meta?.useFullheight }"
    >
      <slot>
        <router-view />
      </slot>
    </div>
  </div>
</template>
