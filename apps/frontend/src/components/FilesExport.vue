<script setup lang="ts">
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import type { FunctionalComponent } from 'vue'

interface fileType {
  name: string
  initial?: string
  icon?: FunctionalComponent
  href: string
  description: string
  bgColor: string
  hoverColor: string
}

defineProps<{
  files: fileType[]
}>()
</script>

<template>
  <ul
    role="list"
    class="mt-3 grid grid-cols-1 gap-4"
  >
    <li
      v-for="file in files"
      :key="file.name"
      class="col-span-1 flex rounded-md shadow-sm"
    >
      <a
        :href="file.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex w-full"
      >
        <div
          :class="[
            file.bgColor,
            'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
          ]"
        >
          <component
            :is="file.icon"
            v-if="file.icon"
            class="h-7 w-7"
            aria-hidden="true"
          />

          <span
            v-if="file.initial"
            class="text-lg"
            >{{ file.initial }}</span
          >
        </div>
        <div
          class="flex flex-1 items-center justify-between rounded-r-md border-b border-r border-t border-gray-200 dark:border-gray-700"
        >
          <div
            class="flex-1 px-4 py-2 transition-all"
            :class="file.hoverColor"
          >
            {{ file.name }}
            <p class="text-gray-500 text-sm mb-0">{{ file.description }}</p>
          </div>
          <div class="flex-shrink-0 pr-2">
            <button
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :class="file.hoverColor"
            >
              <ArrowDownTrayIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>
