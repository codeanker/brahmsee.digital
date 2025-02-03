<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    immediate?: boolean
    closeable?: boolean
    size?: string
    overflowVisible?: boolean
  }>(),
  {
    immediate: false,
    closeable: true,
    size: 'md',
    overflowVisible: false,
  }
)

const emit = defineEmits<{
  open: []
  close: []
}>()
const visible = ref(false)
const context = ref()

onUnmounted(() => {
  toggleHideOverflow(false)
})

const toggleHideOverflow = (hideOverflow) => {
  document.body.style.overflow = hideOverflow ? 'hidden' : ''
  document.body.style.paddingRight = hideOverflow ? '10px' : ''
}

const show = (ctx = {}) => {
  window.addEventListener('keydown', handleKeypress)
  emit('open')
  visible.value = true
  toggleHideOverflow(true)
  context.value = ctx
}

const hide = (ctx = {}) => {
  if (ctx === 'self' && !props.closeable) return
  visible.value = false
  toggleHideOverflow(false)
  context.value = ctx
  emit('close')
  window.removeEventListener('keydown', handleKeypress)
}

const handleKeypress = (e) => {
  if (e.key === 'Escape') {
    hide()
  }
}

export type ModalApi = {
  show: typeof show
  hide: typeof hide
}

defineExpose<ModalApi>({ show, hide })

if (props.immediate) {
  show()
}
</script>

<template>
  <div>
    <transition name="fade">
      <div
        v-if="visible"
        class="backdrop z-modal-backdrop fixed inset-0 flex items-center justify-center"
        @mousedown.self="hide('self')"
      >
        <div
          class="mx-2 max-h-[calc(100vh-4rem)] rounded-md bg-white dark:bg-slate-950 dark:text-white"
          :class="`size-${size} ${overflowVisible ? 'overflow-visible' : 'overflow-auto'}`"
        >
          <slot
            name="header"
            :hide="hide"
          />
          <div
            class="modal z-modal p-6"
            @keyup.esc="hide('self')"
          >
            <slot
              name="content"
              :hide="hide"
              :context="context"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.backdrop {
  background-color: rgba($color: #000000, $alpha: 0.4);
}
.size-md,
.size-full {
  width: 100%;
}
@media (min-width: 576px) {
  .size-sm {
    width: 22rem;
  }
  .size-md {
    width: 30rem;
  }
  .size-lg {
    width: 100%;
    max-width: 600px;
  }
  .size-xl {
    width: 100%;
    max-width: 1200px;
  }
}
@media (min-width: 768px) {
  .size-sm {
    width: 32rem;
  }
  .size-md {
    width: 40rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter-to, .fade-leave /* .fade-leave-active below version 2.1.8 */ {
  opacity: 1;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-enter-active .modal,
.fade-leave-active .modal {
  transition: transform 300ms;
}
</style>
