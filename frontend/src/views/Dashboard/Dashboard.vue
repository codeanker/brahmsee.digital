<script setup lang="ts">
import { computed } from 'vue'

import Gliederung from './Gliederung.vue'
import Verwaltung from './Verwaltung.vue'

import { loggedInAccount } from '@/composables/useAuthentication'

const role = computed(() => loggedInAccount.value?.role)
</script>

<template>
  <div class="dashboard">
    <h5>Aktuelle Veranstaltungen</h5>
    <div class="mx-auto mt-16 max-w-7xlsm:mt-32">
      <div
        class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl lg:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none"
      >
        <Verwaltung v-if="role === 'ADMIN'" />
        <Gliederung v-if="role === 'GLIEDERUNG_ADMIN'" />
      </div>
    </div>

    <!-- Logo cloud -->
    <div class="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8">
      <div
        class="mx-auto grid max-w-lg grid-cols-4 items-end gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5"
      >
        <img
          class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          src="@/assets/images/sponsoren/codeanker.png"
          alt="CODEANKER"
          width="158"
          height="48"
        />
        <img
          class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          src="@/assets/images/sponsoren/provinzial.png"
          alt="Provinzial"
          width="158"
          height="48"
        />
      </div>
      <div class="mt-16 flex justify-center">
        <p
          class="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5"
        >
          <span class="hidden md:inline"
            >Förder:innen und Sponsor:innen unterstützen unsere Veranstaltungen durch Geld- und Sachspenden</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
