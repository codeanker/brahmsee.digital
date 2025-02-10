<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    wrapperClass?: string
    iconClass?: string
  }>(),
  {
    wrapperClass: 'h-6 w-14',
    iconClass: 'h-5',
  }
)
const svg = ref()
const active = ref(false)

const animate = () => {
  let animations
  if (active.value) {
    animations = svg.value.querySelectorAll('.end')
  } else {
    animations = svg.value.querySelectorAll('.start')
  }
  for (let i = 0; i < animations.length; i++) {
    animations[i].beginElement()
  }
  active.value = !active.value
}

defineExpose({
  animate,
})
</script>

<template>
  <div
    class="flex items-center justify-center bg-slate-50 dark:bg-dark-secondary text-primary-900 dark:text-gray-200 rounded-lg rounded-l-none lg:hidden"
    :class="props.wrapperClass"
  >
    <svg
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      :class="props.iconClass"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      >
        <path d="M5 5L19 5">
          <animate
            class="start"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M5 5L19 5;M5 5L19 19"
          />
          <animate
            class="end"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M5 5L19 19;M5 5L19 5"
          />
        </path>
        <path
          d="M5 12H19"
          opacity="0"
        >
          <animate
            class="start"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M5 12H19;M12 12H12"
          />
          <animate
            class="end"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M12 12H12;M5 12H19"
          />
          <set
            attributeName="opacity"
            to="1"
          />
        </path>
        <path d="M5 19L19 19">
          <animate
            class="start"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M5 19L19 19;M5 19L19 5"
          />
          <animate
            class="end"
            fill="freeze"
            attributeName="d"
            begin="indefinite"
            dur="0.4s"
            values="M5 19L19 5;M5 19L19 19"
          />
        </path>
      </g>
    </svg>
  </div>
</template>
