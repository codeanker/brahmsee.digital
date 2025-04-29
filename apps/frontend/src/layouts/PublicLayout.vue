<script lang="ts" setup>
import Loading from '@/components/UIComponents/Loading.vue'
import cn from '@/helpers/cn'
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/solid'
import { useEventListener, useLocalStorage } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const video = useTemplateRef('video')
const paused = useLocalStorage('login-video-paused', false)

useEventListener(video, 'pause', () => (paused.value = true))
useEventListener(video, 'play', () => (paused.value = false))

function toggle() {
  if (video.value?.paused) {
    video.value?.play()
  } else {
    video.value?.pause()
  }
}
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
        ref="video"
        class="absolute object-cover w-full h-full bg-transparent"
        :autoplay="!paused"
        muted
        loop
      >
        <source
          src="@/assets/images/brahmsee.digital.webm"
          type="video/webm"
        />
      </video>

      <button
        type="button"
        :class="
          cn(
            'absolute inset-0 bg-black text-white',
            paused ? 'bg-opacity-50' : 'transition-opacity opacity-0 bg-opacity-0 hover:bg-opacity-50 hover:opacity-100'
          )
        "
        @click="toggle"
      >
        <PlayIcon
          v-if="paused"
          class="size-24 mx-auto"
        />
        <PauseIcon
          v-else
          class="size-24 mx-auto"
        />
      </button>
    </div>

    <!-- Grid Cell 2-->
    <div class="h-svh col-span-2">
      <router-view />
    </div>
  </div>
</template>
