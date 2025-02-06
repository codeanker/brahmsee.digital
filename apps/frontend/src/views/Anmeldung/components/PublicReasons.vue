<script setup>
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div
    v-if="
      unterveranstaltung?.landingSettings?.miscellaneousVisible &&
      unterveranstaltung?.landingSettings?.miscellaneousItems
    "
    class="bg-white py-24 sm:py-32"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <p class="mt-2 text-4xl font-semibold text-pretty text-gray-900 sm:text-5xl lg:text-balance">
          {{ unterveranstaltung?.landingSettings?.miscellaneousTitle }}
        </p>
        <p class="mt-6 text-lg/8 text-gray-600">
          {{ unterveranstaltung?.landingSettings?.miscellaneousSubtitle }}
        </p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div
            v-for="item in unterveranstaltung.landingSettings.miscellaneousItems"
            :key="item.title"
            class="flex flex-col"
          >
            <dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
              <CheckIcon
                class="size-5 flex-none text-primary-600"
                aria-hidden="true"
              />
              {{ item.title }}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
              <p class="flex-auto">{{ item.content }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
