<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  baseUrl: string
  exportParams: string
}>()

const hinweisText = ref('')
const downloadUrl = computed(() => {
  const hinweis = hinweisText.value ? `&hinweis=${encodeURIComponent(hinweisText.value)}` : ''
  return `${props.baseUrl}?${props.exportParams}${hinweis}`
})
</script>

<template>
  <li class="col-span-1 flex flex-col rounded-md shadow-sm">
    <a
      :href="downloadUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="flex w-full"
    >
      <div class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-green-600 text-sm font-medium text-white">
        <span class="text-lg">TS</span>
      </div>
      <div class="flex flex-1 items-center justify-between rounded-r-md border-b border-r border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 px-4 py-2 transition-all hover:text-green-700">
          T-Shirt Liste
          <p class="text-gray-500 text-sm mb-0">T-Shirt Größen nach Gliederung</p>
        </div>
        <div class="flex-shrink-0 pr-2">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon
              class="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </a>
    <div class="mt-2 px-4 pb-4">
      <label
        for="hinweis"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Hinweis (optional)
      </label>
      <textarea
        id="hinweis"
        v-model="hinweisText"
        rows="2"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
        placeholder="z.B. Größe XL wurde durch L ersetzt"
      />
    </div>
  </li>
</template>
