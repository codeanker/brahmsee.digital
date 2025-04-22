<script lang="ts" setup>
import Loading from '@/components/UIComponents/Loading.vue'
</script>

<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-3 w-screen h-svh bg-white dark:bg-dark-primary divide-x dark:divide-gray-800"
  >
    <!-- Grid Cell 1-->
    <div class="relative overflow-hidden flex items-center justify-center">
      <Loading
        size="md"
        class="text-gray-300 dark:text-gray-700"
      />
      <video
        class="absolute object-cover w-full h-full bg-transparent"
        autoplay
        muted
        loop
      >
        <source
          src="@/assets/images/trailer_temp.webm"
          type="video/webm"
        />
      </video>
    </div>

    <!-- Grid Cell 2-->
    <div class="h-svh col-span-2">
      <router-view />
    </div>
  </div>
</template>
