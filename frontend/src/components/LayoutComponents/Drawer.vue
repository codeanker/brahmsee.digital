<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { nextTick, onMounted, ref, watch } from 'vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const show = ref(false)
const showDrawer = ref(false)

onMounted(() => {
  show.value = true
})

watch(show, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      showDrawer.value = true
    })
  } else {
    document.body.style.overflow = 'auto'
    showDrawer.value = false
    show.value = false
    nextTick(() => {
      emit('close')
    })
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed top-0 right-0 bg-black/50 w-screen h-screen z-50"
      >
        <div
          class="w-full h-full relative"
          @click.self="show = false"
        >
          <Transition name="slide-fade">
            <div
              v-if="showDrawer"
              class="justify-center bg-white overflow-y-scroll dark:bg-dark-secondary absolute lg:w-auto lg:min-w-96 w-full h-full top-0 right-0 shadow-xl pt-6 z-50"
            >
              <div class="flex justify-between align-items-start px-4">
                <slot name="title" />
                <div
                  class="h-8 aspect-square top-3 right-7 z-50 flex items-center justify-center bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer transition-colors rounded-lg"
                  @click="show = false"
                >
                  <XMarkIcon class="h-5" />
                </div>
              </div>
              <slot name="content" />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
