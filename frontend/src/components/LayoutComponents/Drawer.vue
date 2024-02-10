<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref, watch, type Ref, nextTick } from 'vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const container: Ref<HTMLElement | null> = ref(null)
const show = ref(false)
const showDrawer = ref(false)

onMounted(() => {
  container.value = document.getElementById('base-layout')
  show.value = true
})

const containerMarginLeft = computed(() => {
  if (!container.value) return 0
  return container.value.getBoundingClientRect().left
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
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed top-0 right-0 bg-black/50 w-screen h-screen z-50"
      :style="{ left: '-' + containerMarginLeft + 'px' }"
    >
      <div
        class="w-full h-full relative"
        @click.self="show = false"
      >
        <Transition name="slide-fade">
          <div
            v-if="showDrawer"
            class="bg-white dark:bg-dark-secondary absolute w-full lg:w-auto lg:min-w-96 h-full top-0 right-0 shadow-xl pt-6 lg:pt-12 z-50"
          >
            <div
              class="absolute h-8 aspect-square top-3 right-7 z-50 flex items-center justify-center bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer transition-colors rounded-lg"
              @click="show = false"
            >
              <XMarkIcon class="h-5" />
            </div>
            <slot />
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>
