<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { ref, watch } from 'vue'

const darkMode = ref(false)

watch(darkMode, () => {
  if (darkMode.value) {
    localStorage.setItem('darkMode', 'true')
    document.getElementsByTagName('html')[0].classList.add('dark')
  } else {
    localStorage.removeItem('darkMode')
    document.getElementsByTagName('html')[0].classList.remove('dark')
  }
})

if (localStorage.getItem('darkMode') === 'true') {
  darkMode.value = true
}
</script>

<template>
  <Switch
    v-model="darkMode"
    :class="[
      darkMode ? 'bg-primary-600' : 'bg-gray-200',
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
    ]"
  >
    <span class="sr-only">Use setting</span>
    <span
      :class="[
        darkMode ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
      ]"
    >
      <span
        :class="[
          darkMode ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
        ]"
        aria-hidden="true"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3 h-3 text-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </span>
      <span
        :class="[
          darkMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
        ]"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-3 w-3 text-primary-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </span>
    </span>
  </Switch>
</template>
