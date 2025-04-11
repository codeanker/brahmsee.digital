<script setup lang="ts">
import { computed } from 'vue'

import Gliederung from './Gliederung.vue'
import Verwaltung from './Verwaltung.vue'

import { loggedInAccount } from '@/composables/useAuthentication'
import { useRouteTitle } from '@/composables/useRouteTitle'

const role = computed(() => loggedInAccount.value?.role)

const { setTitle } = useRouteTitle()
setTitle('Aktuelle Veranstaltungen')
</script>

<template>
  <div class="dashboard">
    <div class="mx-auto">
      <div class="isolate grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="col-span-8 flex flex-col gap-y-4">
          <Verwaltung v-if="role === 'ADMIN'" />
          <Gliederung v-if="role === 'GLIEDERUNG_ADMIN'" />
        </div>

        <div class="col-span-4">
          <ul class="list-disc">
            <li>Letzte Anmeldungen</li>
            <li>Meldeschlüsse eigener Veranstaltungen</li>
            <li>Nachrichten / News</li>
            <li>Admins: Account anfragen</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Logo cloud -->
    <div class="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8 hidden">
      <div
        class="mx-auto grid max-w-lg grid-cols-4 items-end gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5"
      >
        <div class="col-span-2 max-h-12 w-full object-contain lg:col-span-1">
          <img
            src="@/assets/images/sponsoren/codeanker.png"
            alt="CODEANKER"
            width="158"
            height="48"
          />
        </div>
        <div class="col-span-2 max-h-12 w-full object-contain lg:col-span-1">
          <img
            src="@/assets/images/sponsoren/provinzial.png"
            alt="Provinzial"
            width="158"
            height="48"
          />
        </div>
      </div>
      <div class="mt-16 flex justify-center">
        <p class="relative rounded-full bg-gray-50 dark:bg-dark-secondary px-4 py-1.5 text-sm leading-6">
          <span class="hidden md:inline"
            >Förder:innen und Sponsor:innen unterstützen unsere Veranstaltungen durch Geld- und Sachspenden</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
