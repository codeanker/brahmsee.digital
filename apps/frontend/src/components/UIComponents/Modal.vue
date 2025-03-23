<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot } from 'vaul-vue'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'reka-ui'
import { ref, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(
  defineProps<{
    immediate?: boolean
    closeable?: boolean
    size?: string
  }>(),
  {
    immediate: false,
    closeable: true,
    size: 'lg',
  }
)

const isOpen = ref(false)

const isMobile = useMediaQuery('(max-width: 640px)')

onMounted(() => {
  if (props.immediate) {
    show()
  }
})

const show = () => {
  isOpen.value = true
}

const hide = () => {
  isOpen.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<template>
  <!-- Bottom Sheet for mobile use -->
  <template v-if="isMobile">
    <DrawerRoot v-model:open="isOpen">
      <DrawerPortal>
        <DrawerOverlay class="fixed inset-0 bg-black/50 dark:bg-white/50" />
        <DrawerContent class="bg-white dark:bg-dark-primary fixed inset-x-0 bottom-0 rounded-t-lg p-6">
          <div class="absolute inset-0 h-6 flex items-center justify-center">
            <div class="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          <div
            v-if="closeable"
            class="absolute right-0 top-0 p-4 cursor-pointer"
          >
            <XMarkIcon
              class="size-6"
              @click="hide"
            />
          </div>
          <slot name="content" />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </template>

  <!-- Dialog for desktop use -->
  <template v-else>
    <DialogRoot v-model:open="isOpen">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 bg-black/50 dark:3bg-white/50" />
        <DialogContent
          class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-dark-primary rounded-lg p-6 w-full focus:outline-none"
          :class="{ 'max-w-lg': size === 'lg', 'max-w-2xl': size === 'xl', 'max-w-4xl': size === '2xl' }"
        >
          <div
            v-if="closeable"
            class="absolute right-0 top-0 p-4 cursor-pointer"
          >
            <XMarkIcon
              class="size-6"
              @click="hide"
            />
          </div>
          <slot name="content" />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </template>
</template>
