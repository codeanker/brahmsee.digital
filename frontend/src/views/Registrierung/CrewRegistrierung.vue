<script setup lang="ts">
import { FaceFrownIcon } from '@heroicons/vue/24/outline'

import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <!-- Header -->
    <PublicHeader />
    <div class="h-full flex grow justify-center items-center">
      <!-- Form -->
      <div class="my-10 text-xl flex flex-col items-center">
        <FaceFrownIcon class="h-20"></FaceFrownIcon>
        <div>Diese Funktion steht leider noch nicht zur Verfügung.</div>
      </div>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
